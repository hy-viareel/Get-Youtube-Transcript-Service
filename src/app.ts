import express from 'express';
import fetch from 'cross-fetch';
import cors from 'cors';
import { URL } from 'url';
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

// Regular expressions for validation and parsing
// const RE_YOUTUBE = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const RE_XML_TRANSCRIPT = /<text start="(\d+(?:\.\d+)?)" dur="(\d+(?:\.\d+)?)">(.*?)<\/text>/g;

/**
 * Extracts video ID from a YouTube URL or returns the ID if valid.
 * @param input - YouTube video URL or ID.
 * @returns Video ID.
 */
function retrieveVideoId(input: string): string {
    try {
        const url = new URL(input);
        return url.searchParams.get('v') || '';
    } catch {
        if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
        throw new Error('Invalid YouTube URL or Video ID');
    }
}

/**
 * Fetches the transcript for a YouTube video.
 * @param videoId - The video ID.
 * @returns Array of transcript objects.
 */
async function fetchTranscript(videoId: string): Promise<any[]> {
    const videoPageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: { 'User-Agent': USER_AGENT }
    });

    const videoPageBody = await videoPageResponse.text();
    const splitHTML = videoPageBody.split('"captions":');

    if (splitHTML.length <= 1) {
        if (videoPageBody.includes('class="g-recaptcha"')) {
            throw new Error('Captcha detected, too many requests');
        }
        throw new Error('Transcripts are unavailable for this video');
    }

    const captions = JSON.parse(splitHTML[1].split(',"videoDetails')[0].replace('\n', ''))?.['playerCaptionsTracklistRenderer'];
    if (!captions || !captions.captionTracks || captions.captionTracks.length === 0) {
        throw new Error('No transcripts available');
    }

    const transcriptURL = captions.captionTracks[0].baseUrl;

    const transcriptResponse = await fetch(transcriptURL, {
        headers: { 'User-Agent': USER_AGENT }
    });

    if (!transcriptResponse.ok) {
        throw new Error('Failed to fetch the transcript');
    }

    const transcriptBody = await transcriptResponse.text();
    const results = [...transcriptBody.matchAll(RE_XML_TRANSCRIPT)];

    return results.map((result) => ({
        text: result[3].replace(/&#39;/g, "'"), // Decode HTML entities
        duration: parseFloat(result[2]),
        offset: parseFloat(result[1])
    }));
}

app.get('/', (_, res) => {
    res.status(200).send('Server is running! You can now use the /transcript route to fetch transcripts.');
});

/**
 * API Endpoint to get YouTube transcript.
 */
app.get('/transcript', async (req, res) => {
    const { videoUrl } = req.query;

    if (!videoUrl || typeof videoUrl !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid videoUrl parameter' });
    }

    try {
        const videoId = retrieveVideoId(videoUrl);
        const transcript = await fetchTranscript(videoId);
        return res.json(transcript);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


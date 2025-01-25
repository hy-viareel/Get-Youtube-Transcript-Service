import { Request, Response } from 'express';
import { YoutubeTranscript } from 'youtube-transcript';

export const getCaptions = async (req: Request, res: Response): Promise<Response> => {
    try {
        const videoId = req.query.videoId;
        console.log('VideoId', videoId);
        if (!videoId || typeof videoId !== 'string') {
            return res.status(400).json({ error: 'The "videoId" parameter is required and must be a string.' });
        }

        const transcript = await YoutubeTranscript.fetchTranscript(videoId);

        if (!transcript || transcript.length === 0) {
            return res.status(404).json({
                error: 'No transcript found for the given video ID.'
            });
        }

        return res.status(200).json({
            youtubeId: videoId,
            transcript
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: `An unexpected error occurred. ${error}`
        });
    }
};


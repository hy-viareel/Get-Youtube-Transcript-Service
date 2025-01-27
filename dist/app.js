"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const cors_1 = __importDefault(require("cors"));
const url_1 = require("url");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
const RE_XML_TRANSCRIPT = /<text start="(\d+(?:\.\d+)?)" dur="(\d+(?:\.\d+)?)">(.*?)<\/text>/g;
function retrieveVideoId(input) {
    try {
        const url = new url_1.URL(input);
        return url.searchParams.get('v') || '';
    }
    catch (_a) {
        if (/^[a-zA-Z0-9_-]{11}$/.test(input))
            return input;
        throw new Error('Invalid YouTube URL or Video ID');
    }
}
function fetchTranscript(videoId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const videoPageResponse = yield (0, cross_fetch_1.default)(`https://www.youtube.com/watch?v=${videoId}`, {
            headers: { 'User-Agent': USER_AGENT }
        });
        const videoPageBody = yield videoPageResponse.text();
        const splitHTML = videoPageBody.split('"captions":');
        if (splitHTML.length <= 1) {
            if (videoPageBody.includes('class="g-recaptcha"')) {
                throw new Error('Captcha detected, too many requests');
            }
            throw new Error('Transcripts are unavailable for this video');
        }
        const captions = (_a = JSON.parse(splitHTML[1].split(',"videoDetails')[0].replace('\n', ''))) === null || _a === void 0 ? void 0 : _a['playerCaptionsTracklistRenderer'];
        if (!captions || !captions.captionTracks || captions.captionTracks.length === 0) {
            throw new Error('No transcripts available');
        }
        const transcriptURL = captions.captionTracks[0].baseUrl;
        const transcriptResponse = yield (0, cross_fetch_1.default)(transcriptURL, {
            headers: { 'User-Agent': USER_AGENT }
        });
        if (!transcriptResponse.ok) {
            throw new Error('Failed to fetch the transcript');
        }
        const transcriptBody = yield transcriptResponse.text();
        const results = [...transcriptBody.matchAll(RE_XML_TRANSCRIPT)];
        return results.map((result) => ({
            text: result[3].replace(/&#39;/g, "'"),
            duration: parseFloat(result[2]),
            offset: parseFloat(result[1])
        }));
    });
}
app.get('/', (_, res) => {
    res.status(200).send('Server is running! You can now use the /transcript route to fetch transcripts.');
});
app.get('/transcript', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoUrl } = req.query;
    if (!videoUrl || typeof videoUrl !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid videoUrl parameter' });
    }
    try {
        const videoId = retrieveVideoId(videoUrl);
        const transcript = yield fetchTranscript(videoId);
        return res.json(transcript);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}));
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map
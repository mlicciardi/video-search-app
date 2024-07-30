const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");

const openai = require("openai");
const path = require("path");
const fs = require("fs");

ffmpeg.setFfmpegPath(ffmpegPath);
const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/video_search", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const videoSchema = new mongoose.Schema({
  filename: String,
  subtitles: Array,
});

const Video = mongoose.model("Video", videoSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("video"), async (req, res) => {
  const videoPath = path.join(__dirname, "uploads", req.file.filename);

  ffmpeg(videoPath)
    .outputOptions("-vf", "subtitles")
    .save(`${videoPath}.srt`)
    .on("end", async () => {
      const subtitles = fs.readFileSync(`${videoPath}.srt`, "utf8");
      const subtitleArray = parseSRT(subtitles);

      const video = new Video({
        filename: req.file.filename,
        subtitles: subtitleArray,
      });

      await video.save();
      res.status(200).send("Video uploaded and subtitles generated");
    });
});

app.post("/api/search", async (req, res) => {
  const { query } = req.body;
  const video = await Video.findOne(); // For simplicity, using the first video

  const response = await openai.Completion.create({
    engine: "davinci",
    prompt: `Find the timestamp in the subtitles for the query: "${query}"\nSubtitles:\n${video.subtitles.join("\n")}`,
    max_tokens: 10,
  });

  const timestamp = response.choices[0].text.trim();
  const frameUrl = `/path/to/frame/${timestamp}`; // Frame extraction logic

  res.json({ timestamp, frameUrl });
});

const parseSRT = (srt) => {
  // Function to parse SRT subtitles
};

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

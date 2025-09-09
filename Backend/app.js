const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const shortid = require("shortid");
const Url = require("./Models/url_schema.js");

dotenv.config({ path: __dirname + "/.env" });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const HOST_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Database connection error:", err));

app.post("/create-short-url", async (req, res) => {
  const { originalUrl, expiryMinutes, customCode } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "Original URL is a required field." });
  }

  const shortId = customCode || shortid.generate(6); // Changed length of shortid

  // Check if the short ID already exists
  const existingUrl = await Url.findOne({ shortId });
  if (existingUrl) {
    return res.status(409).json({ error: "The custom code is already in use." });
  }

  const minutes = expiryMinutes || 30;
  const expirationDate = new Date(Date.now() + minutes * 60 * 1000);
  const shortenedUrl = `${HOST_URL}/${shortId}`;

  const newUrlEntry = new Url({
    originalUrl: originalUrl,
    shortId,
    shortenedUrl,
    expirationDate,
  });

  try {
    await newUrlEntry.save();
    res.status(201).json({
      shortLink: shortenedUrl,
      expiration: expirationDate,
    });
  } catch (error) {
    console.error("Error saving new URL:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Endpoint to redirect from the short URL
app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;

  try {
    const foundUrl = await Url.findOne({ shortId });
    if (!foundUrl) {
      return res.status(404).json({ error: "Shortened URL was not found." });
    }

    if (new Date() > foundUrl.expirationDate) {
      return res.status(410).json({ error: "This short URL has expired." });
    }

    res.redirect(foundUrl.originalUrl);
  } catch (err) {
    console.error("Error retrieving URL:", err);
    res.status(500).json({ error: "Server encountered an error." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is live and listening on port ${PORT}`);
});
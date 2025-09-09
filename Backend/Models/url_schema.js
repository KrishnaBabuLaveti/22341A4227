const mongoose = require("mongoose");

// Define the schema for the URL model
const urlSchema = new mongoose.Schema({
  // The original, full-length URL
  originalUrl: {
    type: String,
    required: true,
  },
  // A unique, short identifier for the URL
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  // The complete shortened URL
  shortenedUrl: {
    type: String,
    required: true,
    unique: true,
  },
  // The date and time when the short URL will expire
  expirationDate: {
    type: Date,
    required: true,
  },
  // Timestamp for when the record was created
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Url", urlSchema);
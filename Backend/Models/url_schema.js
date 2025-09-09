const mongoose = require("mongoose");

// Define the schema for the URL model
const urlSchema = new mongoose.Schema({
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
  shortenedUrl: {
    type: String,
    required: true,
    unique: true,
  },

  expirationDate: {
    type: Date,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Url", urlSchema);
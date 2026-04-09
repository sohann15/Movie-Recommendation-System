const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  genre: {
    type: [String],   // multiple genres
    required: true
  },

  year: {
    type: Number
  },

  description: {
    type: String
  },

  rating: {
    type: Number,
    default: 0
  },

  poster: {
    type: String
  }

});

module.exports = mongoose.model("Movie", MovieSchema);
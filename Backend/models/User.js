const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  genres: [String],

  // ✅ FIXED: INSIDE schema
  watchlist: [
    {
      movieId: Number,
      title: String,
      poster: String,
      rating: Number,
      genres: [Number],     // optional but useful for ML
      userRating: Number    // optional but useful for ML
    }
  ]

});

module.exports = mongoose.model("User", UserSchema);
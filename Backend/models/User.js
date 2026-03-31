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

  genres: [String]

});

watchlist: [
  {
    movieId: Number,
    title: String,
    poster: String,
    rating: Number
  }
]

module.exports = mongoose.model("User", UserSchema);
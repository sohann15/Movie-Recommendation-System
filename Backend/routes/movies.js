const express = require("express");
const router = express.Router();
const Movie = require("../models/Movies");


/* ===========================
   GET ALL MOVIES
=========================== */
router.get("/", async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const movies = await Movie.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(movies);

  } catch (err) {

    res.status(500).json(err);

  }

});


/* ===========================
   GET MOVIES BY GENRE
=========================== */
router.get("/genre/:genre", async (req, res) => {

  try {

    const genre = req.params.genre;

    const movies = await Movie.find({
      genre: genre
    });

    res.status(200).json(movies);

  } catch (err) {

    res.status(500).json({
      message: "Error fetching movies by genre",
      error: err.message
    });

  }

});


/* ===========================
   SEARCH MOVIES BY TITLE
=========================== */
router.get("/search/:title", async (req, res) => {

  try {

    const title = req.params.title;

    const movies = await Movie.find({
      title: { $regex: title, $options: "i" }
    });

    res.status(200).json(movies);

  } catch (err) {

    res.status(500).json({
      message: "Error searching movies",
      error: err.message
    });

  }

});


/* ===========================
   ADD MOVIE
=========================== */
router.post("/", async (req, res) => {

  try {

    const movie = new Movie(req.body);

    const savedMovie = await movie.save();

    res.status(201).json(savedMovie);

  } catch (err) {

    res.status(500).json({
      message: "Error adding movie",
      error: err.message
    });

  }

});


module.exports = router;
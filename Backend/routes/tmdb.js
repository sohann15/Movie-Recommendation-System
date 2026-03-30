const express = require("express");
const axios = require("axios");

const router = express.Router();

const API_KEY = "71cdad227e0b3d8a7797836bf5411a75";


/* GET POPULAR MOVIES */

router.get("/popular", async (req, res) => {

  const page = req.query.page || 1;

  try {

    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;

    const response = await axios.get(url);

    res.json({
      success: true,
      page: response.data.page,
      total_pages: response.data.total_pages,
      results: response.data.results
    });

  } catch (error) {

    console.log("TMDB ERROR FULL:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch popular movies"
    });

  }

});


module.exports = router;
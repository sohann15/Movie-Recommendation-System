const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");


/* ===========================
   REGISTER
=========================== */
router.post("/register", async (req, res) => {
  try {

    const { username, email, password, genres } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      genres: genres || [],
      watchlist: []
    });

    const savedUser = await newUser.save();

    res.status(200).json(savedUser);

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ===========================
   LOGIN
=========================== */
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.status(200).json({
      email: user.email,
      username: user.username
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ===========================
   ADD TO WATCHLIST
=========================== */
router.post("/watchlist/add", async (req, res) => {
  try {

    const { email, movie } = req.body;

    if (!email || !movie || !movie.movieId) {
      return res.status(400).json({ message: "Invalid data sent" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.watchlist) {
      user.watchlist = [];
    }

    const exists = user.watchlist.find(
      m => m.movieId === movie.movieId
    );

    if (exists) {
      return res.json({ message: "Already in watchlist" });
    }

    user.watchlist.push({
      movieId: movie.movieId,
      title: movie.title,
      poster: movie.poster,
      rating: movie.rating,
      genres: movie.genres || [],
      userRating: movie.userRating || 0
    });

    await user.save();

    console.log("✅ WATCHLIST SAVED:", user.watchlist.length);

    res.json({ message: "Added to watchlist" });

  } catch (err) {
    console.error("WATCHLIST ADD ERROR:", err);
    res.status(500).json({ message: "Error adding to watchlist" });
  }
});


/* ===========================
   GET WATCHLIST
=========================== */
router.get("/watchlist/:email", async (req, res) => {
  try {

    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      watchlist: user.watchlist || []
    });

  } catch (err) {
    console.error("WATCHLIST FETCH ERROR:", err);
    res.status(500).json({ message: "Error fetching watchlist" });
  }
});


/* ===========================
   REMOVE FROM WATCHLIST
=========================== */
router.post("/watchlist/remove", async (req, res) => {
  try {

    const { email, movieId } = req.body;

    if (!email || !movieId) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.watchlist = (user.watchlist || []).filter(
      m => m.movieId !== movieId
    );

    await user.save();

    res.json({ message: "Removed from watchlist" });

  } catch (err) {
    console.error("WATCHLIST REMOVE ERROR:", err);
    res.status(500).json({ message: "Error removing movie" });
  }
});


/* ===========================
   🎯 SMART RECOMMENDATIONS
=========================== */
router.get("/recommend/:email", async (req, res) => {
  try {

    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let genreScore = {};

    (user.watchlist || []).forEach(movie => {

      const weight = movie.userRating || 1;

      if (movie.genres && movie.genres.length > 0) {
        movie.genres.forEach(g => {
          genreScore[g] = (genreScore[g] || 0) + weight;
        });
      }

    });

    const sortedGenres = Object.keys(genreScore)
      .sort((a, b) => genreScore[b] - genreScore[a]);

    const topGenres = sortedGenres.slice(0, 3).map(Number);

    res.json({
      genres: topGenres,
      message: topGenres.length > 0
        ? "Personalized recommendations"
        : "No data yet"
    });

  } catch (err) {
    console.error("RECOMMEND ERROR:", err);
    res.status(500).json({ message: "Error generating recommendations" });
  }
});


module.exports = router;
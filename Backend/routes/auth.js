const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");


// REGISTER
router.post("/register", async (req, res) => {

  try {

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      genres: req.body.genres
    });

    const savedUser = await newUser.save();

    res.status(200).json(savedUser);

  } catch (err) {
    res.status(500).json(err);
  }

});


// LOGIN
router.post("/login", async (req, res) => {

  try {

    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(404).json("User not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(400).json("Wrong password");

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json(err);
  }

});

router.post("/watchlist/add", async (req, res) => {
  try {
    const { email, movie } = req.body;

    const user = await User.findOne({ email });

    // ❌ prevent duplicates
    const exists = user.watchlist.find(m => m.movieId === movie.movieId);

    if (exists) {
      return res.json({ message: "Already added" });
    }

    user.watchlist.push(movie);
    await user.save();

    res.json({ message: "Added to watchlist" });

  } catch (err) {
    res.status(500).json({ message: "Error adding" });
  }
});

module.exports = router;
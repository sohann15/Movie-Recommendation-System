const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const movieRoutes = require("./routes/movies");
const authRoutes = require("./routes/auth");
const tmdbRoutes = require("./routes/tmdb");

const app = express();   // ✅ create app first


// Middleware
app.use(cors());
app.use(express.json());


// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/movierec")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// Test route
app.get("/", (req, res) => {
  res.send("Movie Recommendation API is running");
});


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/tmdb", tmdbRoutes);   // TMDB API route


// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const movieRoutes = require("./routes/movies");
// Import auth routes
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/movierec")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Movie Recommendation API is running");
});

// Use auth routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

// Start server
app.listen(3000, ()=>{
  console.log("Server running on port 3000");
});
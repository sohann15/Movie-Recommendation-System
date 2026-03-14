const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");

const app = express();


app.use(cors());
app.use(express.json());


mongoose.connect("mongodb://127.0.0.1:27017/movierec")
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log("MongoDB connection error:", err);
});


app.get("/", (req, res) => {
  res.json({
    message: "Movie Recommendation API is running"
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

const PORT = 3000;

app.listen(3000, ()=>{
  console.log("Server running on port 3000");
});
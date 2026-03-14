const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");

const Movie = require("./models/Movies");

mongoose.connect("mongodb://127.0.0.1:27017/movierec")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const movies = [];

fs.createReadStream("movies.csv")
.pipe(csv())
.on("data", (row) => {

  if (!row.title || row.title.trim() === "") return;

  let title = row.title.trim();
  let year = null;

  const match = title.match(/\((\d{4})\)/);

  if (match) {
    year = parseInt(match[1]);
    title = title.replace(match[0], "").trim();
  }

  const genres = row.genres && row.genres !== "(no genres listed)"
    ? row.genres.split("|")
    : [];

  if (!title) return;

  movies.push({
    title: title,
    genre: genres,
    year: year,
    description: "Description not available",
    rating: (Math.random() * 2 + 3).toFixed(1),

    // Random movie-style poster
    poster: `https://picsum.photos/300/450?random=${Math.floor(Math.random()*10000)}`
  });

})
.on("end", async () => {

  try {

    await Movie.deleteMany({}); // clear existing movies

    await Movie.insertMany(movies);

    console.log(`Movies imported successfully: ${movies.length}`);

    mongoose.connection.close();

  } catch (err) {

    console.log(err);

  }

});
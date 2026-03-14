console.log("MovieRec Loaded");


/* -------------------------------
   GENRE SELECT BUTTONS
-------------------------------- */

document.querySelectorAll(".genre").forEach(button => {

  button.addEventListener("click", function () {
    this.classList.toggle("selected");
  });

});


/* -------------------------------
   REGISTER USER
-------------------------------- */

async function registerUser() {

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const genres = [];

  document.querySelectorAll(".genre.selected").forEach(btn => {
    genres.push(btn.innerText);
  });

  if (genres.length === 0) {
    alert("Select at least one genre");
    return;
  }

  try {

    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password,
        genres
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Account created successfully!");
      window.location.href = "login.html";
    }
    else {
      alert(data.message || "Signup failed");
    }

  } catch (error) {

    console.error(error);
    alert("Server error");

  }

}


/* -------------------------------
   MOVIE LOADING VARIABLES
-------------------------------- */

let page = 1;
let loading = false;
let totalPages = 999; // large number initially


/* -------------------------------
   LOAD MOVIES FROM TMDB
-------------------------------- */

async function loadMovies() {

  if (loading || page > totalPages) return;

  loading = true;

  const grid = document.getElementById("movieGrid");

  if (!grid) return;

  try {

    const response = await fetch(`http://localhost:3000/api/tmdb/popular?page=${page}`);

    const data = await response.json();

    if (!data.results) {
      console.error("Invalid TMDB response");
      return;
    }

    const movies = data.results;

    totalPages = data.total_pages || totalPages;

    movies.forEach(movie => {

      const card = document.createElement("div");

      card.classList.add("movie-card");

      const poster = movie.poster_path
        ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
        : "https://via.placeholder.com/300x450";

      card.innerHTML = `
        <img src="${poster}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average.toFixed(1)}</p>
      `;

      grid.appendChild(card);

    });

    page++;

  } catch (error) {

    console.error("Error loading movies:", error);

  }

  loading = false;

}


/* -------------------------------
   INFINITE SCROLL
-------------------------------- */

window.addEventListener("scroll", () => {

  const scrollPosition = window.innerHeight + window.scrollY;
  const pageHeight = document.body.offsetHeight;

  if (scrollPosition >= pageHeight - 400) {
    loadMovies();
  }

});


/* -------------------------------
   INITIAL LOAD
-------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  const grid = document.getElementById("movieGrid");

  if (grid) {
    loadMovies();
  }

});
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
   REGISTER USER (BACKEND)
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
    } else {
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
let totalPages = 999;

/* -------------------------------
   TMDB CONFIG
-------------------------------- */

const API_KEY = "71cdad227e0b3d8a7797836bf5411a75"; // your key

let searchQuery = "";
let selectedGenre = "";
let sortBy = "popularity.desc";


const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  27: "Horror",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller"
};
const BASE_URL = "https://api.themoviedb.org/3";


/* -------------------------------
   LOAD MOVIES FROM TMDB
-------------------------------- */

async function loadMovies() {

  if (loading || page > totalPages) return;

  loading = true;

  const grid = document.getElementById("movieGrid");

  if (!grid) return;

  try {

    let url = "";

    // 🔍 SEARCH MODE
    if (searchQuery.trim() !== "") {

      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${page}`;

    } 
    
    // 🎯 FILTER MODE
    else {

      url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}`;

      if (selectedGenre) {
        url += `&with_genres=${selectedGenre}`;
      }
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results) {
      console.error("Invalid TMDB response", data);
      return;
    }

    const movies = data.results;

    totalPages = data.total_pages;

    movies.forEach(movie => {

      const card = document.createElement("div");
      card.classList.add("movie-card");

      const poster = movie.poster_path
        ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
        : "https://via.placeholder.com/300x450";

      // Extract year
      const year = movie.release_date 
        ? movie.release_date.split("-")[0] 
        : "N/A";

      // Convert genre IDs to names
      const genres = movie.genre_ids
        .map(id => GENRE_MAP[id])
        .filter(Boolean)
        .join(", ");

      card.innerHTML = `
        <img src="${poster}" alt="${movie.title}">
        
        <div class="movie-info">
          <h3>${movie.title}</h3>
          
          <p class="year">${year}</p>
          
          <p class="genre">${genres || "Unknown"}</p>
          
          <p class="rating">⭐ ${movie.vote_average.toFixed(1)}</p>
        </div>
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

  const searchInput = document.getElementById("searchInput");
  const genreFilter = document.getElementById("genreFilter");
  const sortFilter = document.getElementById("sortFilter");

  // SEARCH
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      resetMovies();
    });
  }

  // GENRE FILTER
  if (genreFilter) {
    genreFilter.addEventListener("change", (e) => {
      selectedGenre = e.target.value;
      resetMovies();
    });
  }

  // SORT FILTER
  if (sortFilter) {
    sortFilter.addEventListener("change", (e) => {
      sortBy = e.target.value;
      resetMovies();
    });
  }

});

//Reset function
function resetMovies() {
  page = 1;
  totalPages = 999;
  document.getElementById("movieGrid").innerHTML = "";
  loadMovies();
}
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
      method:"POST",
      headers:{ "Content-Type":"application/json" },
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
   MOVIE VARIABLES
-------------------------------- */

let page = 1;
let loading = false;
let totalPages = 999;

const API_KEY = "71cdad227e0b3d8a7797836bf5411a75";
const BASE_URL = "https://api.themoviedb.org/3";

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


/* -------------------------------
   LOAD MOVIES
-------------------------------- */

async function loadMovies() {

  if (loading || page > totalPages) return;

  loading = true;

  const grid = document.getElementById("movieGrid");
  if (!grid) return;

  try {

    let url = "";

    if (searchQuery.trim() !== "") {
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${page}`;
    } else {
      url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}`;
      if (selectedGenre) url += `&with_genres=${selectedGenre}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results) return;

    totalPages = data.total_pages;

    data.results.forEach(movie => {

      const card = document.createElement("div");
      card.classList.add("movie-card");

      const poster = movie.poster_path
        ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
        : "https://via.placeholder.com/300x450";

      const year = movie.release_date 
        ? movie.release_date.split("-")[0] 
        : "N/A";

      const genres = movie.genre_ids
        .map(id => GENRE_MAP[id])
        .filter(Boolean)
        .join(", ");

      card.innerHTML = `
        <div class="movie-wrapper" onclick="openMovie(${movie.id})">

          <img src="${poster}" alt="${movie.title}">

          <button class="watchlist-btn"
            onclick='event.stopPropagation(); addToWatchlist(${JSON.stringify(movie)})'>
            +
          </button>

          <div class="movie-info">
            <h3>${movie.title}</h3>
            <p class="year">${year}</p>
            <p class="genre">${genres || "Unknown"}</p>
            <p class="rating">⭐ ${movie.vote_average.toFixed(1)}</p>
          </div>

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
   OPEN MOVIE
-------------------------------- */

function openMovie(id){
  window.location.href = `movie.html?id=${id}`;
}


/* -------------------------------
   BACKGROUND GRID (🔥 NEW)
-------------------------------- */

async function loadBackgroundMovies(){

  const grid = document.getElementById("bgGrid");
  if(!grid) return;

  try{

    let allMovies = [];

    for(let p = 1; p <= 4; p++){

      const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${p}`);
      const data = await res.json();

      if(data.results){
        allMovies = allMovies.concat(data.results);
      }
    }

    allMovies = allMovies.filter(m => m.poster_path);

    // shuffle
    allMovies.sort(() => Math.random() - 0.5);

    grid.innerHTML = "";

    allMovies.forEach(movie => {
      const img = document.createElement("img");
      img.src = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
      img.classList.add("bg-movie");

      grid.appendChild(img);
    });

  }catch(err){
    console.error("Background error:", err);
  }
}



/* -------------------------------
   MOVIE DETAILS
-------------------------------- */
async function loadMovieDetails(){

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if(!id) return;

  try{

    const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    const movie = await res.json();

    const castRes = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
    const castData = await castRes.json();
    const cast = castData.cast.slice(0, 6);

    const watchRes = await fetch(`${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`);
    const watchData = await watchRes.json();
    const providers = watchData.results?.IN?.flatrate || [];

    const container = document.getElementById("movieDetails");
    if(!container) return;

    container.innerHTML = `
      <div class="backdrop"
        style="background-image:url(https://image.tmdb.org/t/p/original${movie.backdrop_path})"></div>

      <div class="overlay"></div>

      <div class="movie-detail">

        <img class="poster"
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}">

        <div class="movie-text">

          <h1>${movie.title}</h1>

          <p class="meta">
            ⭐ ${movie.vote_average} • 📅 ${movie.release_date}
          </p>

          <button class="watchlist-big"
            onclick='addToWatchlist(${JSON.stringify(movie)})'>
            ➕ Add to Watchlist
          </button>

          <!-- ⭐ RATING -->
          <div class="rating-section">
            <h3>Your Rating</h3>
            <div class="stars" id="starContainer"></div>
            <p id="ratingValue"></p>
          </div>

          <p class="overview">${movie.overview}</p>

          <h2>Cast</h2>
          <div class="cast-list">
            ${cast.map(c => `
              <div class="cast-card">
                <img src="${c.profile_path ? "https://image.tmdb.org/t/p/w200"+c.profile_path : "https://via.placeholder.com/100"}">
                <p>${c.name}</p>
              </div>
            `).join("")}
          </div>

          <h2>Available on</h2>
          <div class="ott-list">
            ${
              providers.length > 0
              ? providers.map(p => `<img src="https://image.tmdb.org/t/p/w200${p.logo_path}">`).join("")
              : "<p>No streaming info available</p>"
            }
          </div>

        </div>
      </div>
    `;

    createStars();

    // ⭐ Load saved rating
    const ratings = JSON.parse(localStorage.getItem("ratings")) || {};
    if(ratings[id]){
      highlightStars(ratings[id]);
      document.getElementById("ratingValue").innerText = `Your rating: ${ratings[id]}/10`;
    }

  }catch(err){
    console.error("Movie details error:", err);
  }
}


/* -------------------------------
   ⭐ CREATE STARS
-------------------------------- */

function createStars(){

  const container = document.getElementById("starContainer");
  if(!container) return;

  container.innerHTML = "";

  for(let i = 1; i <= 10; i++){

    const star = document.createElement("div");
    star.classList.add("star");

    star.innerHTML = `
      <div class="star-half left" data-value="${i - 0.5}"></div>
      <div class="star-half right" data-value="${i}"></div>
    `;

    container.appendChild(star);
  }

  // ⭐ CLICK
  container.addEventListener("click", (e)=>{
    if(e.target.dataset.value){
      const rating = parseFloat(e.target.dataset.value);
      highlightStars(rating);
      saveRating(rating);
    }
  });

  // ⭐ HOVER PREVIEW
  container.addEventListener("mousemove", (e)=>{
    if(e.target.dataset.value){
      const rating = parseFloat(e.target.dataset.value);
      highlightStars(rating);

      // live preview text
      document.getElementById("ratingValue").innerText = `Your rating: ${rating}/10`;
    }
  });

  // ⭐ RESET AFTER HOVER
  container.addEventListener("mouseleave", ()=>{
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get("id");

    const ratings = JSON.parse(localStorage.getItem("ratings")) || {};

    if(ratings[movieId]){
      highlightStars(ratings[movieId]);
      document.getElementById("ratingValue").innerText = `Your rating: ${ratings[movieId]}/10`;
    }else{
      highlightStars(0);
      document.getElementById("ratingValue").innerText = "";
    }
  });
}


/* -------------------------------
   ⭐ HIGHLIGHT STARS
-------------------------------- */

function highlightStars(rating){

  const stars = document.querySelectorAll(".star");

  stars.forEach((star, index)=>{

    star.classList.remove("full", "half");

    const starNumber = index + 1;

    if(rating >= starNumber){
      star.classList.add("full");
    }
    else if(rating >= starNumber - 0.5){
      star.classList.add("half");
    }
  });
}


/* -------------------------------
   ⭐ SAVE RATING
-------------------------------- */

function saveRating(rating){

  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");

  let ratings = JSON.parse(localStorage.getItem("ratings")) || {};
  ratings[movieId] = rating;

  localStorage.setItem("ratings", JSON.stringify(ratings));

  document.getElementById("ratingValue").innerText = `Your rating: ${rating}/10`;
}


/* -------------------------------
   WATCHLIST
-------------------------------- */

async function addToWatchlist(movie){

  const user = JSON.parse(localStorage.getItem("user"));
  if(!user){
    alert("Please login first");
    return;
  }

  try{
    const res = await fetch("http://localhost:3000/api/auth/watchlist/add",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        email: user.email,
        movie
      })
    });

    const data = await res.json();
    alert(data.message);

  }catch(err){
    console.error(err);
    alert("Error adding to watchlist");
  }
}


/* -------------------------------
   DOM READY
-------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  if(document.getElementById("movieGrid")) loadMovies();

  loadBackgroundMovies();
  loadMovieDetails();

  /* -------------------------------
     🔍 SEARCH + FILTER FIX
  -------------------------------- */

  const searchInput = document.getElementById("searchInput");
  const genreFilter = document.getElementById("genreFilter");
  const sortFilter = document.getElementById("sortFilter");

  // 🔍 SEARCH
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      resetMovies();
    });
  }

  // 🎯 GENRE FILTER
  if (genreFilter) {
    genreFilter.addEventListener("change", (e) => {
      selectedGenre = e.target.value;
      resetMovies();
    });
  }

  // 📊 SORT FILTER
  if (sortFilter) {
    sortFilter.addEventListener("change", (e) => {
      sortBy = e.target.value;
      resetMovies();
    });
  }

  function resetMovies() {
  page = 1;
  totalPages = 999;

  const grid = document.getElementById("movieGrid");
  if(grid) grid.innerHTML = "";

  loadMovies();
}

});
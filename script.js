console.log("MovieRec Loaded");

document.querySelectorAll(".genre").forEach(button => {

button.addEventListener("click", function(){

this.classList.toggle("selected");

});

});


// REGISTER USER

async function registerUser(){

const username = document.getElementById("username").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const confirmPassword = document.getElementById("confirmPassword").value;

if(password !== confirmPassword){

alert("Passwords do not match");
return;

}

const genres = [];

document.querySelectorAll(".genre.selected").forEach(btn => {

genres.push(btn.innerText);

});

if(genres.length === 0){

alert("Select at least one genre");
return;

}

try{

const response = await fetch("http://localhost:3000/api/auth/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
username,
email,
password,
genres
})

});

const data = await response.json();

if(response.ok){

alert("Account created successfully!");

window.location.href = "login.html";

}else{

alert(data.message || "Signup failed");

}

}catch(error){

console.log(error);
alert("Server error");

}

}
async function loadMovies(){

try{

const response = await fetch("http://localhost:3000/api/movies?page=1&limit=20");

const movies = await response.json();

const grid = document.getElementById("movieGrid");

grid.innerHTML = "";

movies.forEach(movie => {

const card = document.createElement("div");

card.classList.add("movie-card");

card.innerHTML = `
<img src="${movie.poster}" alt="${movie.title}">
<h3>${movie.title}</h3>
<p>${movie.genre.join(" • ")}</p>
<p>⭐ ${movie.rating}</p>
`;

grid.appendChild(card);

});

}catch(error){

console.error("Error loading movies:", error);

}

}

loadMovies();
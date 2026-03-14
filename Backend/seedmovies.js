const mongoose = require("mongoose");
const Movie = require("./models/Movies");

mongoose.connect("mongodb://127.0.0.1:27017/movierec");

const movies = [

{
title:"Inception",
genre:["Sci-Fi","Thriller"],
year:2010,
rating:4.8,
description:"A skilled thief enters dreams to steal secrets.",
poster:"https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SY679_.jpg"
},

{
title:"The Dark Knight",
genre:["Action","Crime"],
year:2008,
rating:4.9,
description:"Batman faces the Joker in Gotham city.",
poster:"https://m.media-amazon.com/images/I/51EbJjlLgFL.jpg"
},

{
title:"Interstellar",
genre:["Sci-Fi","Adventure"],
year:2014,
rating:4.7,
description:"A team travels through a wormhole in space.",
poster:"https://m.media-amazon.com/images/I/91kFYg4fX3L.jpg"
},

{
title:"Titanic",
genre:["Romance","Drama"],
year:1997,
rating:4.6,
description:"A love story aboard the doomed Titanic.",
poster:"https://m.media-amazon.com/images/I/71yypg6c4aL._AC_SY679_.jpg"
},

{
title:"Avengers Endgame",
genre:["Action","Adventure"],
year:2019,
rating:4.7,
description:"The Avengers attempt to reverse Thanos' actions.",
poster:"https://m.media-amazon.com/images/I/81ExhpBEbHL.jpg"
},

{
title:"Avatar",
genre:["Sci-Fi","Adventure"],
year:2009,
description:"A marine explores the alien world Pandora.",
rating:4.6,
poster:"https://upload.wikimedia.org/wikipedia/en/d/d6/Avatar_%282009_film%29_poster.jpg"
},

{
title:"The Matrix",
genre:["Sci-Fi","Action"],
year:1999,
description:"A hacker discovers reality is a simulation.",
rating:4.8,
poster:"https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg"
},

{
title:"Joker",
genre:["Crime","Drama"],
year:2019,
description:"The origin story of the Joker.",
rating:4.5,
poster:"https://upload.wikimedia.org/wikipedia/en/e/e1/Joker_%282019_film%29_poster.jpg"
},
{
    title:"Dhurandhar",
    genre:["Drama","Action"],
    year:2025,
    description:"",
    rating:5.0,
    poster:"https://en.wikipedia.org/wiki/Dhurandhar"
}

];

async function seedMovies(){

try{

await Movie.deleteMany({});   

await Movie.insertMany(movies);

console.log("Movies inserted successfully");

mongoose.connection.close();

}catch(err){

console.log(err);

}

}

seedMovies();
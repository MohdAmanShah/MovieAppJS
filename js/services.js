let PopularMoviePage = 1;
let SearchedMoviePage = 1;
let ErrorCount = 0;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMzNhYzdhYjQzMWNlN2Q4YWE0NTRhNDk4Y2IwNDVkZCIsInN1YiI6IjY1OTIyMmIwZTAwNGE2NmM5NTE3ZjJlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zj_qHJg771tfWAAkX391iqwTUqlV9d7PvIFeUia14q0",
  },
};

export function init() {
  PopularMoviePage = 1;
  SearchedMoviePage = 1;
  renderPopularMovies();
}

async function renderMovieDetail(id = 411) {
  PopularMoviePage = 1;
  SearchedMoviePage = 1;
  document.getElementById("Main").innerHTML = "Movie is loading";
  try {
    var response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
      options
    );
    var object = await response.json();
    document.title = `Movie: ${object.original_title}`;
    renderMovieDetailPage(object);
  } catch (error) {}
}

function renderMovieDetailPage(movie) {
  document.getElementById("Main").innerHTML = `
    <div class="container-fluid">
    <div class="container-fluid d-flex align-items-center justify-content-center justify-content-md-start">
        <h1 class="">${movie.original_title}</h1>
    </div>
    <div class="container-fluid d-flex flex-column flex-md-row justify-content-center justify-content-md-start gap-5 ">
        <div class="imageHolder mb-2 d-flex align-items-center justify-content-center">
        <img src="${
          movie.poster_path == null
            ? `https://placehold.co/250x375`
            : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
        }" style="width:250px; height:375px;" class="card-img-top" alt="${
    movie.original_title
  }" />
        </div>
        <div class="d-flex flex-column  gap-3">  
            <div class="d-flex gap-2 p-3">
                <div class="links">
                    ${
                      movie.homepage != ""
                        ? `<a class="btn btn-success" href="${movie.homepage}" target="_blank">
                    Website
                </a>`
                        : ``
                    }
                    ${
                      movie.imdb_id != null
                        ? ` <a class="btn btn-warning" href="https://www.imdb.com/title/${movie.imdb_id}" target="_blank" class="linkimdb">
                    IMDB
                </a>`
                        : ``
                    }
                </div>
            </div>
            <p class="px-3">${movie.overview}</p>
          
                <div class="px-3">
                    <strong>Release Date: </strong>
                    <span>${movie.release_date}</span>
                </div>
            <div class="px-3">
                <strong>Runtime: </strong> <span class="">${parseInt(
                  movie.runtime / 60
                )}hours ${movie.runtime % 60}minutes</span>
            </div>
            <div class="px-3">
                <strong>Rating: </strong> <strong style="color:red" class="">${
                  movie.vote_average * 10
                }%</strong>
            </div>
        </div>
    </div>
</div>`;
}

async function renderPopularMovies() {
  document.getElementById("Main").innerHTML = `
  <div
  class="row row-cols-2 row-cols-lg-5 gap-1 justify-content-center  mb-4"
  id="MoviesContainer"
></div>
`;
  SearchedMoviePage = 1;
  if (PopularMoviePage < 1) PopularMoviePage = 1;
  if (PopularMoviePage > 500) PopularMoviePage = 500;
  try {
    var response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${PopularMoviePage}`,
      options
    );
    var Object = await response.json();
  } catch (error) {
    if (ErrorCount < 5) renderPopularMovies();
    else {
      document.getElementById("MoviesContainer").innerHTML = "Server Donw :-)";
    }
  }

  let movieContainer = document.getElementById("MoviesContainer");
  movieContainer.innerHTML = "";
  let movies = Array.from(Object.results);
  movies.forEach((movie) => {
    var m = document.createElement("div");
    m.className = "card";
    m.style.width = "250px";
    m.style.height = "375px";
    m.style.padding = "0px";
    m.style.cursor = "pointer";
    m.innerHTML = `
    <a class="movieLink">
    <img src="${
      movie.poster_path == null
        ? `https://placehold.co/250x375`
        : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    }" style="width:250px; height:375px;" class="card-img-top" alt="${
      movie.original_title
    }" />
    </a>
    `;
    m.children[0].addEventListener("click", () => {
      renderMovieDetail(movie.id);
    });
    movieContainer.appendChild(m);
  });
  renderPopularMovieButtons();
}

async function renderPopularMovieButtons() {
  let body = document.getElementById("Main");
  let button_container = document.createElement("div");
  button_container.classList =
    "d-flex flex-row justify-content-center align-items-center";
  let left_button = document.createElement("button");
  left_button.classList = "btn btn-primary w-25 me-2";
  left_button.type = "button";
  left_button.title = "prev page";
  left_button.disabled = PopularMoviePage == 1;
  left_button.innerHTML = `  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
  <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
</svg>`;
  let right_button = document.createElement("button");
  right_button.classList = "btn btn-primary w-25 me-2";
  right_button.type = "button";
  right_button.title = "next page";
  right_button.disabled = PopularMoviePage == 500;
  right_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
  <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
</svg>`;

  left_button.addEventListener("click", prevPage);
  right_button.addEventListener("click", nextPage);

  button_container.appendChild(left_button);
  button_container.appendChild(right_button);
  body.appendChild(button_container);

  function prevPage(e) {
    e.preventDefault();
    PopularMoviePage -= 1;
    button_container.removeChild(left_button);
    button_container.removeChild(right_button);
    body.removeChild(button_container);
    renderPopularMovies();
  }
  function nextPage(e) {
    e.preventDefault();
    PopularMoviePage += 1;
    button_container.removeChild(left_button);
    button_container.removeChild(right_button);
    body.removeChild(button_container);
    renderPopularMovies();
  }
}

export async function renderSearchedMovies(query = "") {
  document.getElementById("Main").innerHTML = `
  <div
  class="row row-cols-2 row-cols-lg-5 gap-1 justify-content-center  mb-4"
  id="MoviesContainer"
></div>
`;
  PopularMoviePage = 1;
  try {
    // &include_adult=false
    var response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=true  &language=en-US&page=${SearchedMoviePage}`,
      options
    );
    var Object = await response.json();
    let movieContainer = document.getElementById("MoviesContainer");
    movieContainer.innerHTML = "";
    let movies = Array.from(Object.results);
    movies.forEach((movie) => {
      var m = document.createElement("div");
      m.className = "card";
      m.style.width = "250px";
      m.style.height = "375px";
      m.style.padding = "0px";
      m.style.cursor = "pointer";
      m.innerHTML = `
    <a class="movieLink">
    <img src="${
      movie.poster_path == null
        ? `https://placehold.co/250x375`
        : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    }" style="width:250px; height:375px;" class="card-img-top" alt="${
        movie.original_title
      }" />
    </a>
    `;
      m.children[0].addEventListener("click", () => {
        renderMovieDetail(movie.id);
      });
      movieContainer.appendChild(m);
    });
    renderSearchedMovieButtons(query, Object);
  } catch (error) {
    if (ErrorCount++ < 5) renderSearchedMovies(query);
    else {
      document.getElementById("MoviesContainer").innerHTML = "Server Down :-)";
      return;
    }
  }
}

function renderSearchedMovieButtons(query, movies) {
  let body = document.getElementById("Main");
  let button_container = document.createElement("div");
  button_container.classList =
    "d-flex flex-row justify-content-center align-items-center";
  let left_button = document.createElement("button");
  left_button.classList = "btn btn-primary w-25 me-2";
  left_button.type = "button";
  left_button.title = "prev page";
  left_button.disabled = SearchedMoviePage == 1;
  left_button.innerHTML = `  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
  <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
</svg>`;
  let right_button = document.createElement("button");
  right_button.classList = "btn btn-primary w-25 me-2";
  right_button.type = "button";
  right_button.title = "next page";
  right_button.disabled = SearchedMoviePage == movies.total_pages;
  right_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
  <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
</svg>`;

  left_button.addEventListener("click", prevPage);
  right_button.addEventListener("click", nextPage);

  button_container.appendChild(left_button);
  button_container.appendChild(right_button);
  body.appendChild(button_container);

  function prevPage(e) {
    e.preventDefault();
    SearchedMoviePage -= 1;
    button_container.removeChild(left_button);
    button_container.removeChild(right_button);
    body.removeChild(button_container);
    renderSearchedMovies(query);
  }
  function nextPage(e) {
    e.preventDefault();
    SearchedMoviePage += 1;
    button_container.removeChild(left_button);
    button_container.removeChild(right_button);
    body.removeChild(button_container);
    renderSearchedMovies(query);
  }
}

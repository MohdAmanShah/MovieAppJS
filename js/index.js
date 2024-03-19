import { init } from "./services.js";
import { renderSearchedMovies } from "./services.js";
init();
let homeicon = document.getElementById("homebutton");
homeicon.addEventListener("click", (e) => {
  init();
});

let Form = document.getElementById("searchForm");
Form.addEventListener("submit", (e) => {
  e.preventDefault();
  renderSearchedMovies(e.target[0].value);
  e.target.reset();
});

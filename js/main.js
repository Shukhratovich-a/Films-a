// TEMPLATES
const elMovieTemplate = document.querySelector("#movie-template").content;

// ELEMENTS
// Add New Film
const elMoviesList = document.querySelector(".dashboard__list");
const elDashboardForm = document.querySelector(".dashboard__form");
const elDashboardInputs = document.querySelectorAll(".dashboard__input:not([name='date'])");
const elMovieInputName = document.querySelector('.dashboard__input[name="name"]');
const elMovieInputOverview = document.querySelector('.dashboard__input[name="overview"]');
const elMovieInputGenres = document.querySelector('.dashboard__input[name="genres"]');
const elMovieInputPoster = document.querySelector('.dashboard__input[name="poster"]');
const elMovieInputDate = document.querySelector('.dashboard__input[name="date"]');
// Filter
const elFilterSelect = document.querySelector(".dashboard__input[name='select-genre']");

// COLLECT GENRES
const collectGenres = (filmsArray) => {
  const genres = [];

  filmsArray.forEach((film) => {
    film.genres.forEach((genre) => {
      if (!genres.includes(genre)) genres.push(genre);
    });
  });

  genres.unshift("All");

  return genres;
};

// RENDER SELECT
const renderGenres = (genresArray, select) => {
  // Clear List
  select.innerHTML = null;

  genresArray.forEach((genre) => {
    const selectOption = document.createElement("option");

    selectOption.textContent = genre;
    selectOption.value = genre;

    select.appendChild(selectOption);
  });
};

// COLLECT MOVIES BY GENRES
const collectMoviesByGenres = (moviesArray, moviesList, select) => {
  moviesList.innerHTML = null;

  let moviesByGenres = moviesArray.filter((movie) => movie.genres.includes(select.value));

  if (select.value === "All") moviesByGenres = moviesArray;

  return moviesByGenres;
};

// RENDER MOVIES BY GENRES
const renderMoviesByGenres = (evt) => {
  evt.preventDefault();

  renderMovies(collectMoviesByGenres(films, elMoviesList, elFilterSelect), elMoviesList);
};

// FUNCTION NORMALZIE DATE
const normalizeDate = (setDate, fomrat = "") => {
  const date = new Date(setDate);

  const day = String(date.getDate()).padStart(2, 0);
  const month = String(date.getMonth() + 1).padStart(2, 0);
  const year = date.getFullYear();

  if (fomrat === "yyyy") {
    return year;
  } else if (fomrat === "yyyy-mm-dd") {
    return year + "-" + month + "-" + day;
  }
};

// FUNCTION RENDER MOVIE GENRES
const renderMovieGenres = (array, list) => {
  // Clear List
  list.innerHTML = null;

  // Add Genre
  array.forEach((genre) => {
    const movieGenre = document.createElement("li");

    movieGenre.classList.add("genre");
    movieGenre.textContent = genre;

    list.appendChild(movieGenre);
  });
};

// Render All Movies
const renderMovies = (array, list) => {
  // CLear List
  list.innerHTML = null;

  array.forEach((movie) => {
    const movieTemplate = elMovieTemplate.cloneNode(true);

    // Movie Title
    movieTemplate.querySelector(".movie__title").textContent = movie.title;
    movieTemplate.querySelector(".movie__title").title = movie.title;

    // Movie Date
    movieTemplate.querySelector(".movie__data").textContent =
      "(" + normalizeDate(movie.release_date, "yyyy") + ")";
    movieTemplate.querySelector(".movie__data").title = normalizeDate(
      movie.release_date,
      "yyyy-mm-dd"
    );
    movieTemplate
      .querySelector(".movie__data")
      .setAttribute("datatime", normalizeDate(movie.release_date, "yyyy-mm-dd"));

    // Movie Overview
    movieTemplate.querySelector(".movie__overview").textContent = movie.overview;

    // Movie Poster
    movieTemplate.querySelector(".movie__poster").src = movie.poster;
    movieTemplate.querySelector(".movie__poster").alt = movie.title + "'s poster";

    const movieGenresList = movieTemplate.querySelector(".movie__genres");
    renderMovieGenres(movie.genres, movieGenresList);

    // Appending
    list.appendChild(movieTemplate);
  });
};

// ADD NEW MOVIE
const addNewMovie = (
  movieName,
  movieOverview,
  movieGenres,
  moviePoster,
  movieDate,
  moviesArray
) => {
  const newMovie = {
    title: movieName.value.trim(),
    overview: movieOverview.value.trim(),
    genres: movieGenres.value.split(" "),
    poster: moviePoster.value.trim(),
    release_date: movieDate.value,
  };

  moviesArray.unshift(newMovie);
};

// EARLY RETURN
const earlyReturn = (inputsArray = []) => {
  let inputsValueSumm = 0;
  inputsArray.forEach((input) => {
    if (input.value === "") input.classList.add("dashboard__input--disabled"), inputsValueSumm++;
    else input.classList.remove("dashboard__input--disabled");
  });

  return inputsValueSumm;
};

// RENDER NEW MOVIE
const renderNewMovie = (evt) => {
  evt.preventDefault();

  // Earlt Return
  earlyReturn(elDashboardInputs);
  if (earlyReturn(elDashboardInputs)) return;

  addNewMovie(
    elMovieInputName,
    elMovieInputOverview,
    elMovieInputGenres,
    elMovieInputPoster,
    elMovieInputDate,
    films
  );

  elDashboardInputs.forEach((input) => {
    input.value = null;
  });

  renderMovies(films, elMoviesList);
};

elFilterSelect.addEventListener("change", renderMoviesByGenres);

renderGenres(collectGenres(films), elFilterSelect);

elDashboardForm.addEventListener("submit", renderNewMovie);

renderMovies(films, elMoviesList);

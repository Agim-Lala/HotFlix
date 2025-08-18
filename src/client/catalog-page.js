const API_URL = "http://localhost:5219/api/movies";
const MOVIES_PER_PAGE = 18;

let movies = [];
let currentPage = 1;
let totalPages = 1;

// ===== Utility Functions ===== //

const getRatingClass = (rating) => {
  if (rating >= 8) return "green-rating";
  if (rating >= 6) return "yellow-rating";
  return "red-rating";
};

const getQueryParams = () => {
  const genreId = document.getElementById("genre-select")?.value;
  const year = document.getElementById("year-input")?.value.trim();
  const qualityId = document.getElementById("quality-select")?.value;

  let startYear = null,
    endYear = null;
  if (year.includes("-")) {
    [startYear, endYear] = year.split("-").map((y) => y.trim());
  }

  const params = new URLSearchParams();
  if (genreId && genreId !== "all") params.append("genreId", genreId);
  if (startYear) params.append("startYear", startYear);
  if (endYear) params.append("endYear", endYear);
  if (qualityId && qualityId !== "all") params.append("qualityId", qualityId);

  return params;
};

// ===== UI Rendering ===== //

const renderSkeleton = (container, count) => {
  container.innerHTML = Array(count)
    .fill(
      `
      <div class="movie-card-medium skeleton-loading">
        <div class="movie-card-medium-image skeleton"></div>
        <h2 class="movie-card-medium-title skeleton"></h2>
        <p class="movie-card-medium-genre skeleton"></p>
      </div>
    `
    )
    .join("");
};

const renderMovies = () => {
  const container = document.getElementById("movies-container");
  container.innerHTML = "";

  const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
  const pageMovies = movies.slice(startIndex, startIndex + MOVIES_PER_PAGE);

  const cardsHTML = pageMovies
    .map((movie, index) => {
      const imageUrl = `http://localhost:5219${movie.imagePath}`;
      const genres = movie.genres
        .map((genre) => `<span class="movie-genre">${genre}</span>`)
        .join(", ");

      return `
        <div class="movie-card-medium movie-card-animate" style="animation-delay:${
          index * 0.05
        }s">
          <div class="movie-card-medium-image" style="background-image: url('${imageUrl}')">
            <div class="rating ${getRatingClass(movie.averageRating)}">${
        movie.averageRating
      }</div>
          </div>
          <h2 class="movie-card-medium-title">${movie.title}</h2>
          <p class="movie-card-medium-genre">${genres}</p>
        </div>
      `;
    })
    .join("");

  container.innerHTML = cardsHTML;

  // Attach click listeners
  container.querySelectorAll(".movie-card-medium").forEach((card, i) => {
    card.addEventListener("click", () => {
      window.location.href = `MovieDetail.html?id=${pageMovies[i].movieId}`;
    });
  });
};

const renderPagination = () => {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  const createButton = (label, onClick, isActive = false) => {
    const a = document.createElement("a");
    a.innerHTML = label;
    if (isActive) a.classList.add("active");
    a.addEventListener("click", onClick);
    return a;
  };

  paginationContainer.appendChild(
    createButton("«", () => {
      if (currentPage > 1) updatePage(currentPage - 1);
    })
  );

  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.appendChild(
      createButton(i, () => updatePage(i), i === currentPage)
    );
  }

  paginationContainer.appendChild(
    createButton("»", () => {
      if (currentPage < totalPages) updatePage(currentPage + 1);
    })
  );
};

// ===== Fetching & Data Flow ===== //

const fetchMovies = async (page = 1, params = null) => {
  const container = document.getElementById("movies-container");
  renderSkeleton(container, MOVIES_PER_PAGE);

  const url =
    params && params.toString()
      ? `${API_URL}/filter?${params.toString()}&page=${page}&pageSize=${MOVIES_PER_PAGE}`
      : `${API_URL}?page=${page}&pageSize=${MOVIES_PER_PAGE}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    movies = Array.isArray(data) ? data : [];

    // If backend sends totalPages, use it; else calculate
    totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);
    currentPage = page;

    renderMovies();
    renderPagination();
  } catch (err) {
    console.error("Error fetching movies:", err);
    container.innerHTML = "<p>Error loading movies.</p>";
  }
};

const updatePage = (page) => {
  fetchMovies(page, getQueryParams());
};

// ===== Filters ===== //

const applyFilter = () => {
  fetchMovies(1, getQueryParams());
};

// ===== Init ===== //

document.addEventListener("DOMContentLoaded", () => {
  fetchMovies();

  document
    .getElementById("filter-button")
    ?.addEventListener("click", applyFilter);

  document
    .getElementById("scrollToTopButton")
    ?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

// EXPECTED PREMIERE

const updatePremiereButtonsVisibility = () => {
  const prevBtn = document.getElementById("prevPremiereButton");
  const nextBtn = document.getElementById("nextPremiereButton");

  if (premiereMovies.length <= PREMIERE_PER_PAGE) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  } else {
    prevBtn.style.display = "flex";
    nextBtn.style.display = "flex";
  }
};

let premiereMovies = [];
let premiereIndex = 0;
const PREMIERE_PER_PAGE = 6;

const fetchNonPremieredMovies = async () => {
  try {
    renderSkeleton(
      "#expectedPremiereContainer",
      "movie-card-medium",
      PREMIERE_PER_PAGE
    );

    const res = await fetch(API_URL + "/non-premiered");
    if (!res.ok) throw new Error("Failed to fetch non-premiered movies");

    premiereMovies = await res.json();
    updatePremiereButtonsVisibility();
    renderPremiereMovies();
  } catch (err) {
    console.error("Error fetching non-premiered movies:", err);
  }
};

const renderPremiereMovies = () => {
  const container = document.getElementById("expectedPremiereContainer");
  if (!container) return;
  container.innerHTML = "";

  const visibleMovies = premiereMovies.slice(
    premiereIndex,
    premiereIndex + PREMIERE_PER_PAGE
  );

  visibleMovies.forEach((movie, index) => {
    const imageUrl = `http://localhost:5219${movie.imagePath}`;
    const genreSpans = movie.genres
      .map((g) => `<span class="movie-genre">${g}</span>`)
      .join(",");

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card-medium", "movie-card-animate");
    movieCard.style.animationDelay = `${index * 0.1}s`;

    movieCard.innerHTML = `
      <div class="movie-card-medium-image" style="background-image: url('${imageUrl}')">
      </div>
      <h2 class="movie-card-medium-title">${movie.title}</h2>
      <p class="movie-card-medium-genre">${genreSpans}</p>
    `;

    movieCard.addEventListener("click", () => {
      window.location.href = `MovieDetail.html?id=${movie.movieId}`;
    });

    container.appendChild(movieCard);
  });
};
const nextPremiere = () => {
  premiereIndex += PREMIERE_PER_PAGE;
  if (premiereIndex >= premiereMovies.length) premiereIndex = 0;
  renderPremiereMovies();
};

const prevPremiere = () => {
  premiereIndex -= PREMIERE_PER_PAGE;
  if (premiereIndex < 0)
    premiereIndex = Math.max(0, premiereMovies.length - PREMIERE_PER_PAGE);
  renderPremiereMovies();
};

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("nextPremiereButton")
    ?.addEventListener("click", nextPremiere);
  document
    .getElementById("prevPremiereButton")
    ?.addEventListener("click", prevPremiere);

  fetchNonPremieredMovies();
});

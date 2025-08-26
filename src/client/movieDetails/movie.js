import { API_URL, setCurrentMovieId, token } from "./shared.js";
import { getCurrentUserId, getRatingClass } from "./utils.js";

export async function fetchMovieData(movieId) {
  try {
    const response = await fetch(`${API_URL}/movies/${movieId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const movie = await response.json();

    if (movie.isVisible === false) {
      alert("This movie is not available.");
      window.location.href = "/index.html";
      return;
    }

    setCurrentMovieId(movieId);
    populateMovieDetails(movie);
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
    alert("Movie not found or unavailable.");
    window.location.href = "/index.html";
  }
}

// Helper to extract YouTube video ID from full URL
function getYouTubeVideoId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
}

export function populateMovieDetails(movie) {
  document.getElementById("movieTitle").textContent = movie.title;
  document.getElementById(
    "movieCover"
  ).style.backgroundImage = `url(http://localhost:5219${movie.imagePath})`;
  if (movie.rating !== undefined && typeof movie.rating === "number") {
    document.getElementById("movieRating").textContent = movie.rating;
    document
      .getElementById("movieRating")
      .classList.add(getRatingClass(movie.rating));
  } else {
    document.getElementById("movieRating").textContent = movie.averageRating;
    document
      .getElementById("movieRating")
      .classList.add(getRatingClass(movie.averageRating));
  }
  document.getElementById("movieDirector").textContent = movie.director?.name;
  document.getElementById("movieCast").textContent = movie.actors
    ?.map((actor) => actor.name)
    .join(", ");
  document.getElementById("movieGenres").textContent = movie.genres
    .map((genre) => genre.name)
    .join(", ");
  document.getElementById("movieReleaseYear").textContent = movie.releaseYear;
  document.getElementById("movieRunningTime").textContent = movie.runningTime;
  document.getElementById("movieCountry").textContent = movie.country;
  document.getElementById("movieDescription").textContent = movie.description;
  const videoContainer = document.getElementById("movieVideoContainer");
  videoContainer.innerHTML = "";
  if (movie.link) {
    const videoId = getYouTubeVideoId(movie.link);
    if (videoId) {
      const iframe = document.createElement("iframe");
      iframe.width = "700";
      iframe.height = "400";
      iframe.style.borderRadius = "3%";
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      videoContainer.appendChild(iframe);
    }
  }

  const trailerButton = document.getElementById("trailerButton");
  const modal = document.getElementById("trailerModal");
  const modalVideoContainer = document.getElementById("modalVideoContainer");
  const closeBtn = document.getElementById("closeTrailer");

  trailerButton.onclick = () => {
    if (movie.link) {
      const videoId = getYouTubeVideoId(movie.link);
      if (videoId) {
        modalVideoContainer.innerHTML = `
          <iframe width="100%" height="450" 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        `;
        modal.style.display = "block";
      }
    }
  };

  // Close modal
  closeBtn.onclick = () => {
    modal.style.display = "none";
    modalVideoContainer.innerHTML = ""; // remove video to stop audio
  };

  // Close if clicked outside modal
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      modalVideoContainer.innerHTML = "";
    }
  };
}

export async function recordMovieView(movieId) {
  const viewApiUrl = `${API_URL}/Movies/recordView`;

  const userId = getCurrentUserId();

  if (userId === null) {
    console.warn(
      "User not logged in. View will not be recorded for a specific user."
    );

    return;
  }

  const sessionViewKey = `movie_${movieId}_user_${userId}_viewed_details_session`;
  const isViewRecordedForSession =
    sessionStorage.getItem(sessionViewKey) === "true";

  if (isViewRecordedForSession) {
    console.debug(
      `View already recorded for movie ${movieId} in this session.`
    );
    return;
  }

  if (!movieId) {
    console.error("Cannot record view: Movie ID is missing.");
    return;
  }

  console.debug(
    `Attempting to record view for movie ${movieId} by user ${userId}...`
  );

  try {
    const response = await fetch(viewApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(parseInt(movieId)),
    });

    if (response.ok) {
      console.debug(`View recorded successfully for movie ${movieId}`);
      sessionStorage.setItem(sessionViewKey, "true");
    } else {
      const errorDetail = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : await response.text();
      console.error(
        `Failed to record view for movie ${movieId}. Status: ${response.status}. Details:`,
        errorDetail
      );
    }
  } catch (error) {
    console.error(
      `Network or unexpected error recording view for movie ${movieId}:`,
      error
    );
  }
}

export async function fetchRelatedMovies(movieId) {
  try {
    const response = await fetch(`${API_URL}/Movies/${movieId}/related`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const relatedMovies = await response.json();
    renderRelatedMovies(relatedMovies);
  } catch (error) {
    console.error("Failed to fetch related movies:", error);
  }
}

function renderRelatedMovies(movies) {
  const container = document.getElementById("relatedMoviesContainer");
  if (!container) return;

  container.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card-medium");
    const genreSpans = movie.genres
      .map((g) => `<span class="movie-genre">${g}</span>`)
      .join(",");
    const ratingClass = getRatingClass(movie.averageRating || 0);

    movieCard.innerHTML = `
            <div class="movie-card-medium-image" style="background-image: url(${
              movie.imagePath
                ? `http://localhost:5219${movie.imagePath}`
                : "Images/covers/default.jpg"
            })">
                <div class="rating ${ratingClass}">${
      movie.averageRating?.toFixed(1) || "N/A"
    }</div>
            </div>
            <h2 class="movie-card-medium-title">${movie.title}</h2>
            <p class="movie-card-medium-genre">${genreSpans}</p>
        `;

    movieCard.addEventListener("click", () => {
      window.location.href = `MovieDetail.html?id=${movie.movieId}`;
    });

    container.appendChild(movieCard);
  });
}

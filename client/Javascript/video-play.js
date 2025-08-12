const movieVideo = document.getElementById("movieVideo");
const playButton = document.querySelector(".play");
const trailerButton = document.getElementById("trailerButton");

function handleVideoPlay() {
  if (movieVideo.paused) {
    movieVideo.play();
    playButton.style.display = "none";
  }
}

playButton.addEventListener("click", handleVideoPlay);
movieVideo.addEventListener("click", handleVideoPlay);

movieVideo.addEventListener("pause", () => {
  if (movieVideo.paused) {
    playButton.style.display = "flex";
  }
});

movieVideo.addEventListener("ended", () => {
  playButton.style.display = "flex";
});

movieVideo.addEventListener("play", () => {
  playButton.style.display = "none";
});

trailerButton.addEventListener("click", () => {
  if (movieVideo.requestFullscreen) {
    movieVideo.requestFullscreen();
  } else if (movieVideo.mozRequestFullScreen) {
    movieVideo.mozRequestFullScreen();
  } else if (movieVideo.webkitRequestFullscreen) {
    movieVideo.webkitRequestFullscreen();
  } else if (movieVideo.msRequestFullscreen) {
    movieVideo.msRequestFullscreen();
  }
});

movieVideo.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    trailerButton.style.display = "block";
  } else {
    trailerButton.style.display = "none";
  }
});

movieVideo.addEventListener("mozfullscreenchange", () => {
  if (!document.mozFullScreenElement) {
    trailerButton.style.display = "block";
  } else {
    trailerButton.style.display = "none";
  }
});

movieVideo.addEventListener("webkitfullscreenchange", () => {
  if (!document.webkitFullscreenElement) {
    trailerButton.style.display = "block";
  } else {
    trailerButton.style.display = "none";
  }
});

movieVideo.addEventListener("msfullscreenchange", () => {
  if (!document.msFullscreenElement) {
    trailerButton.style.display = "block";
  } else {
    trailerButton.style.display = "none";
  }
});

const scrollToTopButton = document.getElementById("scrollToTopButton");

if (scrollToTopButton) {
  scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: Adds smooth scrolling
    });
  });
}

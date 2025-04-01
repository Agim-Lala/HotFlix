const API_URL = "http://localhost:5219/api/movies";

function getRatingClass(rating) {
    if (rating >= 8) return "green-rating";
    if (rating >= 6) return "yellow-rating";
    return "red-rating";
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (movieId) {
        fetchMovieData(movieId);
    } else {
        console.error('Movie ID not found in URL.');
    }
});

async function fetchMovieData(movieId) {
    try {
        const response = await fetch(`${API_URL}/${movieId}`); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const movie = await response.json();
        populateMovieDetails(movie);
    } catch (error) {
        console.error('Failed to fetch movie details:', error);
    }
}

function populateMovieDetails(movie) {
    document.getElementById('movieTitle').textContent = movie.title;
    document.getElementById('movieCover').style.backgroundImage = `url(${movie.imagePath})`;
    if (movie.rating !== undefined && typeof movie.rating === 'number') {
        document.getElementById('movieRating').textContent = movie.rating;
        document.getElementById('movieRating').classList.add(getRatingClass(movie.rating)); 
    } else {
        document.getElementById('movieRating').textContent = '8'; 
        document.getElementById('movieRating').classList.add(getRatingClass(8)); 
    }
   
    document.getElementById('movieDirector').textContent = movie.directorName;
    document.getElementById('movieCast').textContent = movie.actors.join(', ');
    document.getElementById('movieGenres').textContent = movie.genres.join(', ');
    document.getElementById('movieReleaseYear').textContent = movie.releaseYear;
    document.getElementById('movieRunningTime').textContent = '130 min'; 
    document.getElementById('movieCountry').textContent = 'USA'; 
    document.getElementById('movieDescription').textContent = movie.description;
    document.getElementById('movieVideo').querySelector('source[type="video/mp4"]').src = 'Images/Videos/Movie.mp4' 
    document.getElementById('movieVideo').querySelector('source[type="video/ogg"]').src = 'Images/Videos/Movie.mp4' 

}

// Play video // 

const movieVideo = document.getElementById('movieVideo');
const playButton = document.querySelector('.play');
const trailerButton = document.getElementById('trailerButton'); 

function handleVideoPlay() {
    if (movieVideo.paused) {
        movieVideo.play();
        playButton.style.display = 'none';
    }
}

playButton.addEventListener('click', handleVideoPlay);
movieVideo.addEventListener('click', handleVideoPlay);

movieVideo.addEventListener('pause', () => {
    if (movieVideo.paused) {
        playButton.style.display = 'flex';
    }
});

movieVideo.addEventListener('ended', () => {
    playButton.style.display = 'flex';
});

movieVideo.addEventListener('play', () => {
    playButton.style.display = 'none';
});

trailerButton.addEventListener('click', () => {
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

movieVideo.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        trailerButton.style.display = 'block';
    } else {
        trailerButton.style.display = 'none';
    }
});

movieVideo.addEventListener('mozfullscreenchange', () => {
    if (!document.mozFullScreenElement) {
        trailerButton.style.display = 'block';
    } else {
        trailerButton.style.display = 'none';
    }
});

movieVideo.addEventListener('webkitfullscreenchange', () => {
    if (!document.webkitFullscreenElement) {
        trailerButton.style.display = 'block';
    } else {
        trailerButton.style.display = 'none';
    }
});

movieVideo.addEventListener('msfullscreenchange', () => {
    if (!document.msFullscreenElement) {
        trailerButton.style.display = 'block';
    } else {
        trailerButton.style.display = 'none';
    }
});

const scrollToTopButton = document.getElementById('scrollToTopButton');

if (scrollToTopButton) {
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Optional: Adds smooth scrolling
        });
    });
}
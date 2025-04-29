const API_URL = "http://localhost:5219/api/movies";



// Rating Class //

function getRatingClass(rating) {
    if (rating >= 8) return "green-rating";
    if (rating >= 6) return "yellow-rating";
    return "red-rating";
}

// Skeleton Loading //

function renderSkeleton(containerId, cardClass, cardCount) {
    const container = document.querySelector(containerId);
    if (!container) return;
    container.innerHTML = "";

    for (let i = 0; i < cardCount; i++) {
        container.innerHTML += `
            <div class="${cardClass} skeleton-loading">
                <div class="movie-card-medium-image skeleton"></div>
                <h2 class="movie-card-medium-title skeleton"></h2>
                <p class="movie-card-medium-genre skeleton"></p>
            </div>
        `;
        
    }
}

let movies = [];
let currentPage = 1;
const MOVIES_PER_PAGE = 18;
let totalPages = 1;

// Fetch Movies //

async function fetchMovies(url = API_URL, queryParams = null, page = 1, pageSize = MOVIES_PER_PAGE) {
    try {
        renderSkeleton("#movies-container", "movie-card-medium", MOVIES_PER_PAGE);
        let fetchUrl = url;
        const fetchParams = new URLSearchParams();

        if (queryParams) {
            queryParams.forEach((value, key) => {
                fetchParams.append(key, value);
            });
        }
        fetchParams.append("page", page);
        fetchParams.append("pageSize", pageSize);
        fetchUrl += `?${fetchParams.toString()}`;

        const response = await fetch(fetchUrl);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch movies: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) { 
            throw new Error("Unexpected response format. Expected an array.");
        }
        movies = data;
        totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE); 
        currentPage = page;
        console.log("Fetched Movies:", movies);
        console.log("totalPages", totalPages);
        renderMovies();
        renderPagination();
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

function renderMovies() {
    const container = document.getElementById("movies-container");
    if (!container) {
        console.error("Container not found");
        return;
    }
    container.innerHTML = "";

    const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
    const endIndex = startIndex + MOVIES_PER_PAGE;
    const pageMovies = movies.slice(startIndex, endIndex);
    
    pageMovies.forEach((movie, index) => {
        const imageUrl = `http://localhost:5219${movie.imagePath}`;
        
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card-medium', 'movie-card-animate'); 
        movieCard.style.animationDelay = `${index * 0.05}s`;

        const genreSpans = movie.genres.map(genre => `<span class="movie-genre">${genre} </span>`).join(",");

        movieCard.innerHTML = `
            <div class="movie-card-medium">
                <div class="movie-card-medium-image" style="background-image: url('${imageUrl}')">
                    <div class="rating ${getRatingClass(movie.rating)}">${8}</div>
                </div>
                <h2 class="movie-card-medium-title">${movie.title}</h2>
                <p class="movie-card-medium-genre">${genreSpans}</p>
            </div>
        `;
        
        movieCard.addEventListener('click', () => {
            window.location.href = `MovieDetail.html?id=${movie.movieId}`;
        });

        container.appendChild(movieCard);
    });
}

// Filter //

function applyFilter() {
    const genreId = document.getElementById("genre-select").value;
    const year = document.getElementById("year-input").value.trim();
    const qualityId = document.getElementById("quality-select").value;


    let startYear = null, endYear = null;
    if (year.includes("-")) {
        [startYear, endYear] = year.split("-").map(y => y.trim());
    }

    const queryParams = new URLSearchParams();
    if (genreId && genreId !== "all") queryParams.append("genreId", genreId);
    if (startYear) queryParams.append("startYear", startYear);
    if (endYear) queryParams.append("endYear", endYear);
    if (qualityId && qualityId !== "all") queryParams.append("qualityId", qualityId); 
    fetchMovies(API_URL + "/filter", queryParams);
}

document.addEventListener("DOMContentLoaded", () => {
    fetchMovies();

    const filterButton = document.getElementById("filter-button");
    if (filterButton) {
        filterButton.addEventListener("click", applyFilter);
    }
});

function getQueryParams(){
    const genreId = document.getElementById("genre-select").value;
    const year = document.getElementById("year-input").value.trim();
    const qualityId = document.getElementById("quality-select").value;


    let startYear = null, endYear = null;
    if (year.includes("-")) {
        [startYear, endYear] = year.split("-").map(y => y.trim());
    }

    const queryParams = new URLSearchParams();
    if (genreId && genreId !== "all") queryParams.append("genreId", genreId);
    if (startYear) queryParams.append("startYear", startYear);
    if (endYear) queryParams.append("endYear", endYear);
    if (qualityId && qualityId !== "all") queryParams.append("qualityId", qualityId); 

    return queryParams;
}


// Pagination //
function renderPagination() {
    const paginationContainer = document.querySelector(".pagination");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = ""; 

    const prevArrow = document.createElement("a");
    prevArrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>`;
    prevArrow.addEventListener("click", () => {
        if (currentPage > 1) {
            fetchMovies(currentPage === 1 ? API_URL: API_URL + "/filter", currentPage ===1 ? null: getQueryParams(), currentPage - 1);
        }
    });
    paginationContainer.appendChild(prevArrow);

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement("a");
        pageLink.textContent = i;
        pageLink.addEventListener("click", () => fetchMovies(currentPage === 1 ? API_URL: API_URL + "/filter", currentPage ===1 ? null: getQueryParams(), i));
        if (i === currentPage) {
            pageLink.classList.add("active");
        }
        paginationContainer.appendChild(pageLink);
    }
    const nextArrow = document.createElement("a");
    nextArrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>`;
    nextArrow.addEventListener("click", () => {
        if (currentPage < totalPages) {
            fetchMovies(currentPage === 1 ? API_URL: API_URL + "/filter", currentPage ===1 ? null: getQueryParams(), currentPage + 1);
        }
    });
    paginationContainer.appendChild(nextArrow);
}


const scrollToTopButton = document.getElementById('scrollToTopButton');

if (scrollToTopButton) {
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Optional: Adds smooth scrolling
        });
    });
}
const API_URL = "http://localhost:5219/api/movies";

function getRatingClass(rating) {
    if (rating >= 8) return "green-rating";
    if (rating >= 6) return "yellow-rating";
    return "red-rating";
}

const renderSkeleton = (containerSelector, type, count=6) => {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error("Container not found");
        return;
    }

    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
        container.innerHTML += `
            <div class="${type} skeleton">
                <div class="${type}-image"></div>
                <h2 class="${type}-title skeleton-text"></h2>
                <p class="${type}-genre skeleton-text"></p>
            </div>
        `;
    }
};

let movies = [];
let currentIndex = 0;
const MOVIES_PER_PAGE = 5;
const MAX_MOVIES = 30;

const fetchMovies = async (page = 1, pageSize = 30) => {
    try {
        renderSkeleton("#newItemsContainer", "movie-card-big" , 5);
        const response = await fetch(`${API_URL}/new?page=${page}&pageSize=${pageSize}`);
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch movies: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();        
        if (!Array.isArray(data)) {
            throw new Error("Unexpected response format. Expected an array.");
        }

        movies = data.slice(0, MAX_MOVIES); 
        console.log("Fetched Movies:", movies); 

        renderMovies();
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
};


function renderMovies() {
    const container = document.getElementById("newItemsContainer");
    if (!container) {
        console.error("Container not found");
        return;
    }
    container.innerHTML = "";  

    const visibleMovies = movies.slice(currentIndex, currentIndex + MOVIES_PER_PAGE);


    visibleMovies.forEach(movie => {
        const imageUrl = `http://localhost:5219${movie.imagePath}`;
        
        
        const movieCard = `
            <div class="movie-card-big">
                <div class="movie-card-big-image" style="background-image: url('${imageUrl}')">
                    <div class="rating ${getRatingClass(movie.rating)}">${5}</div> 
                </div>
                <h2 class="movie-card-big-title">${movie.title}</h2>
                <p class="movie-card-big-genre">${movie.genres.join(", ")}</p>
            </div>
        `;
        container.innerHTML += movieCard;
    });
}
function nextMovies() {
    currentIndex += MOVIES_PER_PAGE;
    if (currentIndex >= movies.length) currentIndex = 0; 
    renderMovies();
}
function prevMovies() {
    currentIndex -= MOVIES_PER_PAGE;
    if (currentIndex < 0) currentIndex = Math.max(0, movies.length - MOVIES_PER_PAGE);
    renderMovies();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("nextButton")?.addEventListener("click", nextMovies);
    document.getElementById("prevButton")?.addEventListener("click", prevMovies);

    fetchMovies(1, 20);
});


// -------------------------------------- // 

let categoryMovies = [];
const DEFAULT_CATEGORY = null; // For default (new releases)
const CATEGORY_IDS = {
    MOVIES: 1,
    TV_SERIES: 2,
    CARTOONS: 3,
};

const fetchCategoryMovies = async (categoryId = DEFAULT_CATEGORY) => {
    try {
        renderSkeleton(".new-items-cards-container", "movie-card-medium");
        const endpoint = categoryId
            ? `${API_URL}/by-category?categoryId=${categoryId}`
            : `${API_URL}`;

        const response = await fetch(endpoint);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch movies: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Unexpected response format. Expected an array.");
        }

        categoryMovies = data.slice(0, 18); 
        renderCategoryMovies();
    } catch (error) {
        console.error("Error fetching category movies:", error);
    }
};

const renderCategoryMovies = () => {
    const container = document.querySelector(".new-items-cards-container");
    if (!container) {
        console.error("Category container not found");
        return;
    }

    container.innerHTML = ""; 

    categoryMovies.forEach((movie) => {
        const imageUrl = `http://localhost:5219${movie.imagePath}`;

        const movieCard = `
            <div class="movie-card-medium">
                <div class="movie-card-medium-image" style="background-image: url('${imageUrl}')">
                    <div class="rating ${getRatingClass(movie.rating)}">${8}</div>
                </div>
                <h2 class="movie-card-medium-title">${movie.title}</h2>
                <p class="movie-card-medium-genre">${movie.genres.join(", ")}</p>
            </div>
        `;
        container.innerHTML += movieCard;
    });
};

const setupCategoryListeners = () => {
    const categoryItems = document.querySelectorAll(".new-items-list-item");
    
    categoryItems.forEach((item) => {
        item.addEventListener("click", () => {
            categoryItems.forEach((el) => el.classList.remove("active"));
            item.classList.add("active");
            const categoryText = item.textContent.trim().toUpperCase();

            switch (categoryText) {
                case "MOVIES":
                    fetchCategoryMovies(CATEGORY_IDS.MOVIES);
                    break;
                case "TV SERIES":
                    fetchCategoryMovies(CATEGORY_IDS.TV_SERIES);
                    break;
                case "CARTOONS":
                    fetchCategoryMovies(CATEGORY_IDS.CARTOONS);
                    break;
                default:
                    fetchCategoryMovies(); // Default to new releases
            }
        });
    });
    if (categoryItems.length > 0) {
        categoryItems[0].classList.add("active");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    fetchCategoryMovies();
    setupCategoryListeners();
});
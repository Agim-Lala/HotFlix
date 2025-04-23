const API_URL = "http://localhost:5219/api";
const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

document.addEventListener("DOMContentLoaded", () => {
    const movieId = new URLSearchParams(window.location.search).get("id");
    if (movieId) {
        fetchMovieData(movieId); // Assuming this function exists and fetches movie details
        fetchComments(movieId);
    } else {
        console.error("Movie ID not found in URL.");
    }

    const commentBox = document.querySelector(".comment-box textarea");
    const sendButton = document.querySelector(".comment-box .send-btn");
    const commentsContainer = document.getElementById("commentsContainer"); 

    sendButton.addEventListener("click", async () => {
        const text = commentBox.value.trim(); // Changed 'content' to 'text' to match backend DTO
        if (!text) return;

        const movieId = new URLSearchParams(window.location.search).get("id");
        if (!movieId) {
            console.error("Movie ID not found in URL for comment submission.");
            return;
        }

        const payload = {
            movieId,
            text, 
        };

        const quotedId = sendButton.getAttribute("data-quote-id");
        const repliedId = sendButton.getAttribute("data-reply-id");

        if (quotedId) payload.quotedCommentId = parseInt(quotedId);
        if (repliedId) payload.parentCommentId = parseInt(repliedId);

        try {
            const response = await fetch(`${API_URL}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.json(); 
                console.error("Failed to post comment:", error);
                throw new Error("Failed to post comment");
            }

            commentBox.value = "";
            sendButton.removeAttribute("data-reply-id"); 
            sendButton.removeAttribute("data-quote-id");

            fetchComments(movieId); // Re-fetch comments after successful post
        } catch (error) {
            console.error("Comment error:", error);
            // Optionally display an error message to the user
        }
    });
});

async function fetchMovieData(movieId) {
    try {
        const response = await fetch(`${API_URL}/movies/${movieId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const movie = await response.json();
        populateMovieDetails(movie);
    } catch (error) {
        console.error("Failed to fetch movie details:", error);
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

function getRatingClass(rating) {
    if (rating >= 8) return "green-rating";
    if (rating >= 6) return "yellow-rating";
    return "red-rating";
}

async function fetchComments(movieId) {
    try {
        const response = await fetch(`${API_URL}/comments/movie/${movieId}`);
        if (!response.ok) {
            const error = await response.json();
            console.error("Failed to load comments:", error);
            throw new Error("Failed to load comments");
        }
        const comments = await response.json();
        renderComments(comments);
    } catch (error) {
        console.error("Comment fetch error:", error);
        // Optionally display an error message to the user
    }
}

function renderComments(comments) {
    const container = document.getElementById("commentsContainer");
    if (!container) {
        console.error("Comments container element not found.");
        return;
    }
    container.innerHTML = "";

    function render(comment, level = 0) {
        const div = document.createElement("div");
        div.className = "comment";
        if (level > 0) div.classList.add("replied-comment");
    
        // Quote HTML
        let quoteHTML = "";
        if (comment.quotedComment) {
            quoteHTML = `
            <div class="quoted-comment">
                <div class="user-info">
                    <div class="avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>
                    <div>
                        <span class="username">${comment.quotedComment.username}</span>
                        <span class="timestamp">${new Date(comment.quotedComment.createdAt).toLocaleString()}</span>
                    </div>
                </div>
                <div class="quoted-text">
                    <svg class="quote-icon" viewBox="0 0 16 16" fill="#ff9933" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 10.4142L2.70711 14.7071L1.29289 13.2929L5 9.58579V9L1 9V2H7V10.4142Z" fill="#ff9933"></path>
                        <path d="M9 9L13 9V9.58579L9.29289 13.2929L10.7071 14.7071L15 10.4142L15 2H9L9 9Z" fill="#ff9933"></path>
                    </svg>
                    ${comment.quotedComment.text}
                </div>
            </div>
            `;
        }
    
        div.innerHTML = `
            <div class="user-info">
                <div class="avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                </div>
                <div>
                    <strong>${comment.username}</strong>
                    <span class="timestamp">${new Date(comment.createdAt).toLocaleString()}</span>
                </div>
            </div>
    
            <div class="comment-content">
                ${quoteHTML}
    
                <p class="comment-text">${comment.text}</p>
    
                <div class="comment-actions">
                    <div class="like-dislike">
                        <span class="like-button" data-comment-id="${comment.commentId}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green" class="size-5">
                                <path d="M1 8.25a1.25 1.25 0 1 1 2.5 0v7.5a1.25 1.25 0 1 1-2.5 0v-7.5ZM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0 1 14 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 0 1-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 0 1-1.341-.317l-2.734-1.366A3 3 0 0 0 6.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 0 1 2.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388Z" />
                            </svg>
                            ${comment.likesCount}
                        </span>
                        <span class="dislike-button" data-comment-id="${comment.commentId}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="red" class="size-5">
                                <path d="M18.905 12.75a1.25 1.25 0 1 1-2.5 0v-7.5a1.25 1.25 0 0 1 2.5 0v7.5ZM8.905 17v1.3c0 .268-.14.526-.395.607A2 2 0 0 1 5.905 17c0-.995.182-1.948.514-2.826.204-.54-.166-1.174-.744-1.174h-2.52c-1.243 0-2.261-1.01-2.146-2.247.193-2.08.651-4.082 1.341-5.974C2.752 3.678 3.833 3 5.005 3h3.192a3 3 0 0 1 1.341.317l2.734 1.366A3 3 0 0 0 13.613 5h1.292v7h-.963c-.685 0-1.258.482-1.612 1.068a4.01 4.01 0 0 1-2.166 1.73c-.432.143-.853.386-1.011.814-.16.432-.248.9-.248 1.388Z" />
                            </svg>
                            ${comment.dislikesCount}
                        </span>
                    </div>
                    <div class="reply-quote">
                        <span onclick="replyToComment(${comment.commentId})">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="white" class="size-4">
                                <path fill-rule="evenodd" d="M3.5 9.75A2.75 2.75 0 0 1 6.25 7h5.19L9.22 9.22a.75.75 0 1 0 1.06 1.06l3.5-3.5a.75.75 0 0 0 0-1.06l-3.5-3.5a.75.75 0 1 0-1.06 1.06l2.22 2.22H6.25a4.25 4.25 0 0 0 0 8.5h1a.75.75 0 0 0 0-1.5h-1A2.75 2.75 0 0 1 3.5 9.75Z" clip-rule="evenodd" />
                            </svg>
                            Reply
                        </span>
                        <span onclick="quoteComment(${comment.commentId})">
                            <svg viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 10.4142L2.70711 14.7071L1.29289 13.2929L5 9.58579V9L1 9V2H7V10.4142Z" fill="000000"></path>
                                <path d="M9 9L13 9V9.58579L9.29289 13.2929L10.7071 14.7071L15 10.4142L15 2H9L9 9Z" fill="#e4e4e7"></path>
                            </svg>
                            Quote
                        </span>
                    </div>
                </div>
            </div>
        `;
    
        container.appendChild(div);
    
        if (comment.replies && comment.replies.length > 0) {
            comment.replies.forEach((child) => render(child, level + 1));
        }
    }
    

    comments.forEach((c) => render(c));

    // Add event listeners for like and dislike buttons after rendering
    const likeButtons = container.querySelectorAll(".like-button");
    likeButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const commentId = button.getAttribute("data-comment-id");
            await likeComment(commentId);
        });
    });

    const dislikeButtons = container.querySelectorAll(".dislike-button");
    dislikeButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const commentId = button.getAttribute("data-comment-id");
            await dislikeComment(commentId);
        });
    });
}

function replyToComment(commentId) {
    const sendButton = document.querySelector(".comment-box .send-btn");
    sendButton.setAttribute("data-reply-id", commentId);
    sendButton.removeAttribute("data-quote-id");
    document.querySelector(".comment-box textarea").focus();
}

function quoteComment(commentId) {
    const sendButton = document.querySelector(".comment-box .send-btn");
    sendButton.setAttribute("data-quote-id", commentId);
    sendButton.removeAttribute("data-reply-id");
    document.querySelector(".comment-box textarea").focus();
}

async function likeComment(commentId) {
    if (!token) {
        console.error("Authentication token not found. User must be logged in to like.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/comments/${commentId}/like`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.text();
            console.error(`Failed to like comment ${commentId}:`, error);
            return;
        }

        // Re-fetch comments to update the counts and potentially handle if the user already liked/disliked
        const movieId = new URLSearchParams(window.location.search).get("id");
        if (movieId) {
            fetchComments(movieId);
        }

    } catch (error) {
        console.error(`Error liking comment ${commentId}:`, error);
        // Optionally display an error message to the user
    }
}

async function dislikeComment(commentId) {
    if (!token) {
        console.error("Authentication token not found. User must be logged in to dislike.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/comments/${commentId}/dislike`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.text();
            console.error(`Failed to dislike comment ${commentId}:`, error);
            return;
        }

        // Re-fetch comments to update the counts and potentially handle if the user already liked/disliked
        const movieId = new URLSearchParams(window.location.search).get("id");
        if (movieId) {
            fetchComments(movieId);
        }

    } catch (error) {
        console.error(`Error disliking comment ${commentId}:`, error);
        // Optionally display an error message to the user
    }
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
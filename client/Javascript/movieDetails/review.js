import { API_URL, token, dataLoaded, getReviewsContainer } from "./shared.js";

export async function fetchReviews(movieId) {
  const reviewsContainer = getReviewsContainer();
  if (!reviewsContainer) return;
  reviewsContainer.innerHTML = "<p>Loading reviews...</p>";
  try {
    const response = await fetch(`${API_URL}/reviews/movie/${movieId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      reviewsContainer.innerHTML =
        '<p class="error-message">Could not load reviews.</p>';
      throw new Error("Failed to load reviews");
    }
    const reviews = await response.json();
    renderReviews(reviews);
    dataLoaded.reviews = true;
  } catch (error) {
    reviewsContainer.innerHTML =
      '<p class="error-message">Could not load reviews.</p>';
  }
}

export function renderReviews(reviews) {
  const reviewsContainer = getReviewsContainer();
  if (!reviewsContainer) return;
  reviewsContainer.innerHTML = "";
  if (reviews && reviews.length > 0) {
    reviews.forEach((review) => {
      reviewsContainer.appendChild(createReviewElement(review));
    });
  }
}

export function createReviewElement(review) {
  const div = document.createElement("div");
  div.className = "review-item";
  const formattedDate = new Date(review.createdAt).toLocaleString();
  const displayRating = Math.round(review.rating * 10) / 10;
  div.innerHTML = `
    <div class="user-info">
      <div class="avatar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      </div>
      <div>
        <strong>${review.username || "Anonymous"}</strong>
      </div>
      <span class="review-rating">Rating: ${displayRating}/10</span>
    </div>
    <p class="review-text">${review.text}</p>
    <div class="review-timestamp">${formattedDate}</div>
  `;
  return div;
}

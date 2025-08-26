import { API_URL, token, dataLoaded, getReviewsContainer } from "./shared.js";
import { getCurrentUserId } from "./utils.js";

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

    if (token) {
      const currentUserId = getCurrentUserId();
      const myReview = reviews.find((r) => r.userId === currentUserId);
      if (myReview) {
        showOwnReviewInsteadOfForm(myReview);
      }
    }

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
    const currentUserId = token ? getCurrentUserId() : null;

    reviews
      .filter((r) => r.userId !== currentUserId)
      .forEach((review) => {
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

export function updateReviewUIForAuth() {
  const reviewText = document.getElementById("reviewText");
  const reviewRating = document.getElementById("reviewRating");
  const submitReviewBtn = document.getElementById("submitReviewBtn");
  const ratingValueDisplay = document.getElementById("ratingValue");

  if (!token) {
    if (reviewText) {
      reviewText.disabled = true;
      reviewText.placeholder = "You need to be logged in to write a review";
    }
    if (reviewRating) reviewRating.disabled = true;
    if (submitReviewBtn) submitReviewBtn.disabled = true;
  } else {
    if (reviewText) {
      reviewText.disabled = false;
      reviewText.placeholder = "Write your review here...";
    }
    if (reviewRating) reviewRating.disabled = false;
    if (submitReviewBtn) submitReviewBtn.disabled = false;
    if (reviewRating && ratingValueDisplay) {
      ratingValueDisplay.textContent = reviewRating.value;
      reviewRating.addEventListener("input", () => {
        ratingValueDisplay.textContent = reviewRating.value;
      });
    }
  }
}

export function showOwnReviewInsteadOfForm(myReview) {
  const addReviewSection = document.getElementById("addReviewSection");
  if (!addReviewSection) return;

  const formattedDate = new Date(
    myReview.updatedAt || myReview.createdAt
  ).toLocaleString();

  addReviewSection.innerHTML = `
    <div class="review-item my-review" id="myReviewDisplay">
      <div class="user-info">
        <strong>You</strong>
        <span class="review-rating">Rating: ${myReview.rating}/10</span>
      </div>
      <p class="review-text">${myReview.text}</p>
      <div class="review-timestamp">Last updated: ${formattedDate}</div>
      <div id="editReviewBtn" class="btn btn-primary">Edit Review</div>
    </div>
  `;

  document.getElementById("editReviewBtn")?.addEventListener("click", () => {
    switchToEditMode(myReview);
  });
}
function switchToEditMode(myReview) {
  const addReviewSection = document.getElementById("addReviewSection");
  if (!addReviewSection) return;

  addReviewSection.innerHTML = `
    <textarea id="reviewText">${myReview.text}</textarea>
    <label class="rating-label" for="reviewRating">Rating:</label>
    <input type="range" min="1" max="10" step="0.1" id="reviewRating" value="${myReview.rating}" />
    <div class="rating-value">Current rating: <span id="ratingValue">${myReview.rating}</span></div>
    <div id="submitReviewBtn" class="btn btn-primary send-btn" data-review-id="${myReview.reviewId}">
      Update Review
    </div>
  `;

  const ratingSlider = document.getElementById("reviewRating");
  const ratingValueDisplay = document.getElementById("ratingValue");
  ratingSlider?.addEventListener("input", () => {
    ratingValueDisplay.textContent = ratingSlider.value;
  });
}

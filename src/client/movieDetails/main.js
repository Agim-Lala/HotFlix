import {
  fetchMovieData,
  populateMovieDetails,
  recordMovieView,
} from "./movie.js";
import {
  fetchComments,
  renderComments,
  likeComment,
  dislikeComment,
  replyToComment,
  quoteComment,
} from "./comments.js";
import { fetchReviews, renderReviews, createReviewElement } from "./review.js";
import { getCurrentUserId, getRatingClass } from "./utils.js";
import {
  API_URL,
  token,
  setCurrentMovieId,
  getCurrentMovieId,
  dataLoaded,
  getTabContainer,
  getContentContainers,
  getCommentsContainer,
  getReviewsContainer,
  getPhotosContainer,
} from "./shared.js";

// Attach global functions for inline event handlers
window.replyToComment = replyToComment;
window.quoteComment = quoteComment;

// --- DOMContentLoaded ENTRY POINT ---
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");
  if (movieId) {
    setCurrentMovieId(movieId);
    setupTabs();
    fetchMovieData(movieId);
    loadActiveTabData();
    recordMovieView(movieId);
  } else {
    console.error("Movie ID not found in URL.");
  }

  // --- Comment submission ---
  const commentBox = document.querySelector(".comment-box textarea");
  const sendButton = document.querySelector(".comment-box .send-btn");

  sendButton?.addEventListener("click", async () => {
    const text = commentBox.value.trim();
    if (!text) return;

    const movieId = getCurrentMovieId();
    if (!movieId) {
      console.error("Movie ID not found for comment submission.");
      return;
    }

    const payload = { movieId, text };
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
      dataLoaded.comments = false;
      fetchComments(movieId); // Re-fetch comments after successful post
    } catch (error) {
      console.error("Comment error:", error);
    }
  });

  // --- Review submission ---
  document
    .getElementById("submitReviewBtn")
    ?.addEventListener("click", async () => {
      const text = document.getElementById("reviewText")?.value.trim();
      const rating = parseFloat(document.getElementById("reviewRating")?.value);

      if (!text || !rating || isNaN(rating)) {
        alert("Please enter review text and select a valid rating.");
        return;
      }

      if (!token) {
        alert("You must be logged in to post a review.");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/reviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            movieId: getCurrentMovieId(),
            text: text,
            rating: rating,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error("Failed to post review:", errText);
          alert("Error posting review.");
          return;
        }

        const newReview = await response.json();
        getReviewsContainer()?.prepend(createReviewElement(newReview));
        document.getElementById("reviewText").value = "";
        document.getElementById("reviewRating").value = "";
        dataLoaded.reviews = false;
      } catch (error) {
        console.error("Post review error:", error);
        alert("Something went wrong.");
      }
    });

  // --- Rating Slider Display ---
  const ratingSlider = document.getElementById("reviewRating");
  const ratingValueDisplay = document.getElementById("ratingValue");
  ratingSlider?.addEventListener("input", () => {
    ratingValueDisplay.textContent = ratingSlider.value;
  });
}); // End DOMContentLoaded

// --- TAB SETUP AND DATA LOADING ---
function setupTabs() {
  const tabContainer = getTabContainer();
  const contentContainers = getContentContainers();
  if (!tabContainer) return;

  tabContainer.addEventListener("click", (event) => {
    if (event.target && event.target.matches(".new-items-list-item")) {
      const clickedTab = event.target;
      const tabName = clickedTab.getAttribute("data-tab");

      // Remove active class from all tabs and content
      tabContainer
        .querySelectorAll(".new-items-list-item")
        .forEach((tab) => tab.classList.remove("active-tab"));
      contentContainers.forEach((content) =>
        content.classList.remove("active-content")
      );

      // Add active class to the clicked tab and corresponding content
      clickedTab.classList.add("active-tab");
      const activeContent = document.querySelector(
        `.tab-content[data-tab-content="${tabName}"]`
      );
      if (activeContent) {
        activeContent.classList.add("active-content");
      }

      // Load data for the activated tab if not already loaded
      loadActiveTabData();
    }
  });
}

function loadActiveTabData() {
  const tabContainer = getTabContainer();
  if (!tabContainer) return;
  const activeTab = tabContainer.querySelector(
    ".new-items-list-item.active-tab"
  );
  const movieId = getCurrentMovieId();
  if (!activeTab || !movieId) return;

  const tabName = activeTab.getAttribute("data-tab");

  switch (tabName) {
    case "comments":
      if (!dataLoaded.comments) {
        fetchComments(movieId);
      }
      break;
    case "reviews":
      if (!dataLoaded.reviews) {
        fetchReviews(movieId);
      }
      break;
    case "photos":
      if (!dataLoaded.photos) {
        // fetchPhotos(movieId); // Implement if needed
      }
      break;
  }
}

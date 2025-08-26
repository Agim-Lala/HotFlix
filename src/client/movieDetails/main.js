import {
  fetchMovieData,
  populateMovieDetails,
  recordMovieView,
  fetchRelatedMovies,
} from "./movie.js";
import {
  fetchComments,
  renderComments,
  updateCommentUIForAuth,
  likeComment,
  dislikeComment,
  replyToComment,
  quoteComment,
} from "./comments.js";
import {
  fetchReviews,
  renderReviews,
  updateReviewUIForAuth,
  createReviewElement,
  showOwnReviewInsteadOfForm,
} from "./review.js";
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
    fetchRelatedMovies(movieId);
    updateCommentUIForAuth();
    updateReviewUIForAuth();
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

  document
    .getElementById("addReviewSection")
    ?.addEventListener("click", async (e) => {
      if (e.target && e.target.id === "submitReviewBtn") {
        const reviewTextEl = document.getElementById("reviewText");
        const reviewRatingEl = document.getElementById("reviewRating");
        const submitBtn = e.target;

        const text = reviewTextEl?.value.trim();
        const rating = parseFloat(reviewRatingEl?.value);

        if (!text || !rating || isNaN(rating)) {
          alert("Please enter review text and select a valid rating.");
          return;
        }

        try {
          let response;
          if (submitBtn.dataset.reviewId) {
            // --- UPDATE REVIEW ---
            const reviewId = submitBtn.dataset.reviewId;
            response = await fetch(`${API_URL}/reviews/${reviewId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ text, rating }),
            });
          } else {
            // --- CREATE NEW REVIEW ---
            response = await fetch(`${API_URL}/reviews`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                movieId: getCurrentMovieId(),
                text,
                rating,
              }),
            });
          }

          if (!response.ok) {
            const errText = await response.text();
            console.error("Review request failed:", errText);
            alert("Error submitting review.");
            return;
          }

          const updatedOrNewReview = await response.json();

          // Back to display mode
          showOwnReviewInsteadOfForm(updatedOrNewReview);

          // Reload other reviews
          fetchReviews(getCurrentMovieId());
        } catch (error) {
          console.error("Review submit error:", error);
          alert("Something went wrong.");
        }
      }
    });

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
    }
  }

  const scrollToTopButton = document.getElementById("scrollToTopButton");

  if (scrollToTopButton) {
    scrollToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Optional: Adds smooth scrolling
      });
    });
  }
});

export const API_URL = "http://localhost:5219/api";
export const token = localStorage.getItem("token");

let currentMovieId = null;
export function setCurrentMovieId(id) {
  currentMovieId = id;
}
export function getCurrentMovieId() {
  return currentMovieId;
}

export const dataLoaded = {
  comments: false,
  reviews: false,
  photos: false,
};

export function getTabContainer() {
  return document.getElementById("discoverTabs");
}
export function getContentContainers() {
  return document.querySelectorAll(".tab-content");
}
export function getCommentsContainer() {
  return document.getElementById("commentsContainer");
}
export function getReviewsContainer() {
  return document.getElementById("reviewsContainer");
}
export function getPhotosContainer() {
  return document.getElementById("photosContainer");
}

export function getCurrentUserId() {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      const userIdClaimValue =
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      const userId = parseInt(userIdClaimValue) || null;
      return userId;
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function getRatingClass(rating) {
  if (rating >= 8) return "green-rating";
  if (rating >= 6) return "yellow-rating";
  return "red-rating";
}

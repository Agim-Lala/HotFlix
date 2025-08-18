document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // prevent form reload

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("http://localhost:5219/api/Auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token);
          window.location.href = "/index.html";
        } else {
          const error = await response.json();
          alert(
            error.message || "Login failed. Please check your credentials."
          );
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
      }
    });
  }
});

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5219/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
        }),
      });

      if (response.ok) {
        alert("Registration successful! Redirecting to login...");
        window.location.href = "signIn.html";
      } else {
        const error = await response.text();
        console.error("Registration failed:", error);
        alert("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      alert("Something went wrong.");
    }
  });

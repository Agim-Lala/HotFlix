document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const signInBtn = document.getElementById("signInBtn");
    const userInfo = document.getElementById("userInfo");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const logoutBtn = document.getElementById("logoutBtn");
    const dashboardBtn = document.getElementById("dashboardBtn");

    if (token) {
        try {
            const response = await fetch("http://localhost:5219/api/Auth/me", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const user = await response.json();
                localStorage.setItem("userInfo", JSON.stringify(user));

                signInBtn.style.display = "none";
                userInfo.style.display = "block";
                usernameDisplay.textContent = user.username;
                logoutBtn.style.display = "block";

                // Show dashboard only for Admins
                if (user.role === "Admin" || user.role === 1) {
                    dashboardBtn.style.display = "inline-block";
                } else {
                    dashboardBtn.style.display = "none";
                }

            } else {
                console.error("Failed to fetch user data.");
                localStorage.removeItem("token");
                localStorage.removeItem("userInfo");
            }
        } catch (err) {
            console.error("Error during fetching user data:", err);
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
        }
    } else {
        console.log("No token found in localStorage.");
        signInBtn.style.display = "inline-block";
        userInfo.style.display = "none";
        logoutBtn.style.display = "none";
        dashboardBtn.style.display = "none";
    }

    console.log("Token in localStorage:", token);
});

// Log out function
function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");

    document.getElementById("userInfo").style.display = "none";
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("dashboardBtn").style.display = "none";
    document.getElementById("signInBtn").style.display = "inline-block";

    window.location.href = "Signin.html";
}

// Redirect to dashboard
function goToDashboard() {
    window.location.href = "http://localhost:3000/dashboard";
}

// Check login state on page load
function checkLoginStatus() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (token && user) {
        document.getElementById("userInfo").style.display = "block";
        document.getElementById("logoutBtn").style.display = "block";
        document.getElementById("signInBtn").style.display = "none";
        document.getElementById("usernameDisplay").textContent = user.username;

        if (user.role === "Admin" || user.role === 1) {
            document.getElementById("dashboardBtn").style.display = "block";
        } else {
            document.getElementById("dashboardBtn").style.display = "none";
        }
    } else {
        document.getElementById("signInBtn").style.display = "inline-block";
        document.getElementById("userInfo").style.display = "none";
        document.getElementById("logoutBtn").style.display = "none";
        document.getElementById("dashboardBtn").style.display = "none";
    }
}

window.onload = checkLoginStatus;
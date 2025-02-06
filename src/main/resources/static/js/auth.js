document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    //  Update with your actual Render backend URL
    const API_BASE_URL = "https://springboot-jwt-auth-8aq0.onrender.com/auth"; 

    function showMessage(element, message, isSuccess) {
        element.textContent = message;
        element.className = isSuccess ? "message success" : "message error";
        element.style.display = "block";
        setTimeout(() => element.style.display = "none", 3000);
    }

    //  Login Form Submission
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;
            const messageBox = document.getElementById("login-message");

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("username", username);
                    window.location.href = "profile.html";
                } else {
                    showMessage(messageBox, data.message || "Invalid credentials!", false);
                }
            } catch (error) {
                showMessage(messageBox, "Login error! Check your internet connection.", false);
            }
        });
    }

    //  Registration Form Submission
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const username = document.getElementById("register-username").value;
            const password = document.getElementById("register-password").value;
            const role = document.getElementById("register-role").value;
            const messageBox = document.getElementById("register-message");

            try {
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password, role })
                });

                const text = await response.text();

                if (response.ok) {
                    showMessage(messageBox, "Registration successful! Redirecting...", true);
                    setTimeout(() => window.location.href = "login.html", 2000);
                } else {
                    showMessage(messageBox, text || "Registration failed!", false);
                }
            } catch (error) {
                showMessage(messageBox, "Registration error! Check your internet connection.", false);
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    function showMessage(element, message, isSuccess) {
        element.textContent = message;
        element.className = isSuccess ? "message success" : "message error";
        element.style.display = "block";
        setTimeout(() => element.style.display = "none", 3000);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;
            const messageBox = document.getElementById("login-message");

            try {
                const response = await fetch("http://localhost:8080/auth/login", {
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
                    showMessage(messageBox, "Invalid credentials!", false);
                }
            } catch (error) {
                showMessage(messageBox, "Login error!", false);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const username = document.getElementById("register-username").value;
            const password = document.getElementById("register-password").value;
            const role = document.getElementById("register-role").value;
            const messageBox = document.getElementById("register-message");

            try {
                const response = await fetch("http://localhost:8080/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password, role })
                });

                const text = await response.text();

                if (response.ok) {
                    showMessage(messageBox, "Registration successful! Redirecting...", true);
                    setTimeout(() => window.location.href = "login.html", 2000);
                } else {
                    showMessage(messageBox, text, false);
                }
            } catch (error) {
                showMessage(messageBox, "Registration error!", false);
            }
        });
    }
});

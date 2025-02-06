document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    // Redirect to login if no token
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Fetch user profile data
    fetch("http://localhost:8080/auth/profile", {
        headers: { "Authorization": "Bearer " + token }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Unauthorized");
        }
        return response.json();
    })
    .then(data => {
        if (!data.username || !data.role) {
            throw new Error("Invalid user data received");
        }

        // Update profile info
        document.getElementById("username").textContent = data.username;
        document.getElementById("role").textContent = data.role.toUpperCase();

        // If user is an admin, load the admin panel
        if (data.role.toUpperCase() === "ADMIN") {
            document.getElementById("admin-section").style.display = "block";
            loadUsers(); // Fetch user list for admin
        }
    })
    .catch(error => {
        console.error("Profile Fetch Error:", error);
        alert("Session expired or unauthorized access. Redirecting to login.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });

    // Logout functionality
    document.getElementById("logout-btn").addEventListener("click", function () {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
});

/**
 * Fetch and display users for Admin
 */
function loadUsers() {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/auth/admin/users", {
        headers: { "Authorization": "Bearer " + token }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Unauthorized");
        }
        return response.json();
    })
    .then(users => {
        const userTable = document.getElementById("user-list");
        userTable.innerHTML = ""; // Clear table before adding new data

        users.forEach(user => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>
                    <select onchange="updateUserRole(${user.id}, this.value)">
                        <option value="USER" ${user.role === "USER" ? "selected" : ""}>User</option>
                        <option value="ADMIN" ${user.role === "ADMIN" ? "selected" : ""}>Admin</option>
                    </select>
                </td>
                <td>
                    <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            `;

            userTable.appendChild(row);
        });
    })
    .catch(error => console.error("Error fetching users:", error));
}

/**
 * Delete user (Admin Only)
 */
function deleteUser(userId) {
    const token = localStorage.getItem("token");

    if (!confirm("Are you sure you want to delete this user?")) {
        return;
    }

    fetch(`http://localhost:8080/auth/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to delete user");
        }
        return response.text();
    })
    .then(() => {
        alert("User deleted successfully.");
        loadUsers(); // Refresh user list
    })
    .catch(error => console.error("Error deleting user:", error));
}

/**
 * Update user role (Admin Only)
 */
function updateUserRole(userId, newRole) {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/auth/admin/users/${userId}`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ role: newRole })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to update user role");
        }
        return response.text();
    })
    .then(() => {
        alert("User role updated successfully.");
        loadUsers(); // Refresh user list
    })
    .catch(error => console.error("Error updating role:", error));
}

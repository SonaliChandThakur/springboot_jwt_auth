# springboot_jwt_auth
# **JWT Authentication System with Role-Based Access Control**

This project is a **Spring Boot JWT Authentication System** with **role-based access control (RBAC)**. It provides secure login, registration, and profile management. Admin users have additional privileges to **view, update, and delete users**. The frontend is designed with **HTML, CSS (Glassmorphism UI), and JavaScript**, while backend security is enforced using **JWT tokens**.
---
### **Frontend**
- 🎨 **HTML, CSS (Glassmorphism UI)**
- 🎯 **JavaScript (Fetch API for API calls)**
- 📱 **Responsive UI Design**

---
### 🟢 **Authentication APIs**
| Method | Endpoint          | Description                    | Access Level |
|--------|------------------|--------------------------------|--------------|
| `POST` | `/auth/register` | Register a new user           | Public |
| `POST` | `/auth/login`    | Authenticate & get JWT token  | Public |

### 🔵 **User APIs**
| Method | Endpoint         | Description                  | Access Level |
|--------|-----------------|------------------------------|--------------|
| `GET`  | `/auth/profile` | Fetch logged-in user profile | User/Admin |

### 🔴 **Admin APIs (Restricted)**
| Method  | Endpoint             | Description                   | Access Level |
|---------|---------------------|-------------------------------|--------------|
| `GET`   | `/admin/users`       | Retrieve all users            | Admin Only |
| `PUT`   | `/admin/users/{id}`  | Update user role or password  | Admin Only |
| `DELETE`| `/admin/users/{id}`  | Delete a user                 | Admin Only |

📌 **Note:**  
- All **protected routes** require a **JWT token** in the `Authorization` header as: Authorization: Bearer <your_token_here>  - **Admin routes** are restricted to users with the `"ADMIN"` role.

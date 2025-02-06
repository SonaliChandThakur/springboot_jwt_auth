package com.example.springbootjwtauth.controller;

import com.example.springbootjwtauth.config.JwtTokenProvider;
import com.example.springbootjwtauth.dto.AuthRequest;
import com.example.springbootjwtauth.dto.AuthResponse;
import com.example.springbootjwtauth.dto.RegisterRequest;
import com.example.springbootjwtauth.model.User;
import com.example.springbootjwtauth.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:8080", allowCredentials = "true") // Enable CORS for frontend communication
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * User Registration Endpoint
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken.");
        }

        User user = new User(request.getUsername(), passwordEncoder.encode(request.getPassword()), request.getRole());
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    /**
     * User Login Endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("User not found"));
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("Invalid password"));
        }

        String token = jwtTokenProvider.generateToken(user.getUsername());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    /**
     * User Profile Endpoint (Authenticated Users Only)
     */
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "").trim();
            String username = jwtTokenProvider.getUsernameFromToken(token);

            return userRepository.findByUsername(username)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // =================== ADMIN-ONLY ENDPOINTS =================== //

    /**
     * Fetch all users (Admin Only)
     */
    @GetMapping("/admin/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "").trim();
            String username = jwtTokenProvider.getUsernameFromToken(token);

            Optional<User> adminUser = userRepository.findByUsername(username);
            if (adminUser.isEmpty() || !"ADMIN".equals(adminUser.get().getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Admins only!");
            }

            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
        }
    }

    /**
     * Delete a user (Admin Only)
     */
    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "").trim();
            String username = jwtTokenProvider.getUsernameFromToken(token);

            Optional<User> adminUser = userRepository.findByUsername(username);
            if (adminUser.isEmpty() || !"ADMIN".equals(adminUser.get().getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Admins only!");
            }

            if (!userRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
        }
    }

    /**
     * Update user role/password (Admin Only)
     */
    @PutMapping("/admin/users/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User updateRequest,
            @RequestHeader("Authorization") String authHeader) {

        try {
            String token = authHeader.replace("Bearer ", "").trim();
            String username = jwtTokenProvider.getUsernameFromToken(token);

            Optional<User> adminUser = userRepository.findByUsername(username);
            if (adminUser.isEmpty() || !"ADMIN".equals(adminUser.get().getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Admins only!");
            }

            Optional<User> userOptional = userRepository.findById(id);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            User user = userOptional.get();
            if (updateRequest.getRole() != null) {
                user.setRole(updateRequest.getRole());
            }

            if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
            }

            userRepository.save(user);
            return ResponseEntity.ok("User updated successfully.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
        }
    }
}

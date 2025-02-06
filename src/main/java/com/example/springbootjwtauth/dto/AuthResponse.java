package com.example.springbootjwtauth.dto;

public class AuthResponse {
    private String token;

    // Default Constructor
    public AuthResponse() {
    }

    // Constructor with parameter
    public AuthResponse(String token) {
        this.token = token;
    }

    // Getter and Setter
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

package com.example.springbootjwtauth.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class PingService {

    private static final String TARGET_URL = "https://google.com"; // Replace with your target website

    @Scheduled(fixedRate = 600000) // 600000 ms = 10 minutes
    public void pingWebsite() {
        try {
            URL url = new URL(TARGET_URL);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);

            int responseCode = connection.getResponseCode();
            System.out.println("Pinged " + TARGET_URL + " | Response Code: " + responseCode);

            connection.disconnect();
        } catch (IOException e) {
            System.err.println("Error pinging " + TARGET_URL + ": " + e.getMessage());
        }
    }
}

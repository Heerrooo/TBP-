package com.tbp.controller;

import com.tbp.model.User;
import com.tbp.repository.UserRepository;
import com.tbp.security.JwtUtil;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        String email = getEmailFromHeader(authHeader);
        if (email == null) return ResponseEntity.status(401).body("Invalid or missing token");
        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");
        user.setPassword(null); // Hide password
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String authHeader, @RequestBody ProfileRequest req) {
        String email = getEmailFromHeader(authHeader);
        if (email == null) return ResponseEntity.status(401).body("Invalid or missing token");
        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");
        user.setName(req.getName());
        user.setAddress(req.getAddress());
        user.setPhone(req.getPhone());
        userRepo.save(user);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    private String getEmailFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.replace("Bearer ", "");
        try {
            return jwtUtil.getEmailFromToken(token);
        } catch (Exception e) {
            return null;
        }
    }

    @Data
    public static class ProfileRequest {
        private String name;
        private String address;
        private String phone;
    }
}

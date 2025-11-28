package com.tbp.controller;

import com.tbp.model.Booking;
import com.tbp.model.User;
import com.tbp.repository.BookingRepository;
import com.tbp.repository.UserRepository;
import com.tbp.security.JwtUtil;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    @Autowired
    private BookingRepository bookingRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> getBookings(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String email = getEmailFromHeader(authHeader);
        if (email == null) {
            return ResponseEntity.status(401).body("Invalid or missing token");
        }
        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        List<Booking> bookings = bookingRepo.findByUser(user);
        return ResponseEntity.ok(bookings);
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestHeader(value = "Authorization", required = false) String authHeader, @RequestBody BookingRequest req) {
        String email = getEmailFromHeader(authHeader);
        if (email == null) {
            return ResponseEntity.status(401).body("Invalid or missing token");
        }
        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        Booking booking = new Booking();
        booking.setType(req.getType());
        booking.setDetails(req.getDetails());
        booking.setUser(user);
        Booking saved = bookingRepo.save(booking);
        return ResponseEntity.ok(saved);
    }

    private String getEmailFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.replace("Bearer ", "");
        try {
            return jwtUtil.getEmailFromToken(token);
        } catch (Exception e) {
            return null;
        }
    }

    @Data
    public static class BookingRequest {
        private String type;
        private String details;
    }
}

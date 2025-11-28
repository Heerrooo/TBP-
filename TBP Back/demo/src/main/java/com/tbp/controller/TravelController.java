package com.tbp.controller;

import com.tbp.model.Booking;
import com.tbp.model.User;
import com.tbp.repository.BookingRepository;
import com.tbp.repository.UserRepository;
import com.tbp.security.JwtUtil;
import com.tbp.service.ExternalApiService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class TravelController {
    @Autowired
    private BookingRepository bookingRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private ExternalApiService externalApiService;

    // -------------------- Flights --------------------
    @PostMapping("/flights/search")
    public ResponseEntity<?> searchFlights(@RequestBody FlightSearchRequest req) {
        try {
            List<Map<String, Object>> results = externalApiService.searchFlights(
                req.getFrom(), 
                req.getTo(), 
                req.getDepartureDate(), 
                req.getAdults() != null ? req.getAdults() : 1
            );
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to search flights: " + e.getMessage()));
        }
    }

    @PostMapping("/flights/book")
    public ResponseEntity<?> bookFlight(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                        @RequestBody FlightBookingRequest req) {
        String email = getEmailFromHeader(authHeader);
        if (email == null) return ResponseEntity.status(401).body("Invalid or missing token");
        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        Booking booking = new Booking();
        booking.setType("Flight");
        booking.setDetails("Flight " + req.getFlightNumber() + " from " + req.getFrom() + " to " + req.getTo() + " on " + req.getDepartureDate());
        booking.setUser(user);
        return ResponseEntity.ok(bookingRepo.save(booking));
    }

    // -------------------- Hotels --------------------
    @PostMapping("/hotels/search")
    public ResponseEntity<?> searchHotels(@RequestBody HotelSearchRequest req) {
        try {
            List<Map<String, Object>> results = externalApiService.searchHotels(
                req.getCity(), 
                req.getCheckIn(), 
                req.getCheckOut(), 
                req.getGuests() != null ? req.getGuests() : 1
            );
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to search hotels: " + e.getMessage()));
        }
    }

    @PostMapping("/hotels/book")
    public ResponseEntity<?> bookHotel(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                       @RequestBody HotelBookingRequest req) {
        String email = getEmailFromHeader(authHeader);
        if (email == null) return ResponseEntity.status(401).body("Invalid or missing token");
        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        Booking booking = new Booking();
        booking.setType("Hotel");
        booking.setDetails("Hotel " + req.getHotel() + " in " + req.getCity() + " from " + req.getCheckIn() + " to " + req.getCheckOut());
        booking.setUser(user);
        return ResponseEntity.ok(bookingRepo.save(booking));
    }

    // -------------------- Cabs --------------------
    @PostMapping("/cabs/search")
    public ResponseEntity<?> searchCabs(@RequestBody CabSearchRequest req) {
        try {
            List<Map<String, Object>> results = externalApiService.searchCabs(
                req.getPickup(), 
                req.getDropoff(), 
                req.getPickupTime()
            );
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to search cabs: " + e.getMessage()));
        }
    }

    @PostMapping("/cabs/book")
    public ResponseEntity<?> bookCab(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                     @RequestBody CabBookingRequest req) {
        String email = getEmailFromHeader(authHeader);
        if (email == null) return ResponseEntity.status(401).body("Invalid or missing token");
        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        Booking booking = new Booking();
        booking.setType("Cab");
        booking.setDetails("Cab from " + req.getPickup() + " to " + req.getDropoff() + " at " + req.getPickupTime());
        booking.setUser(user);
        return ResponseEntity.ok(bookingRepo.save(booking));
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

    // -------------------- DTOs --------------------
    @Data
    public static class FlightSearchRequest {
        private String from;
        private String to;
        private String departureDate;
        private String returnDate;
        private Integer adults;
        private Integer children;
        private String classType;
    }

    @Data
    public static class FlightBookingRequest {
        private String flightNumber;
        private String from;
        private String to;
        private String departureDate;
    }

    @Data
    public static class HotelSearchRequest {
        private String city;
        private String checkIn;
        private String checkOut;
        private Integer guests;
        private Integer rooms;
    }

    @Data
    public static class HotelBookingRequest {
        private String hotel;
        private String city;
        private String checkIn;
        private String checkOut;
    }

    @Data
    public static class CabSearchRequest {
        private String pickup;
        private String dropoff;
        private String pickupTime;
    }

    @Data
    public static class CabBookingRequest {
        private String pickup;
        private String dropoff;
        private String pickupTime;
    }
}




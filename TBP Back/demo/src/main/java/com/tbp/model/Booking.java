package com.tbp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Table(name = "bookings")
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // "Flight", "Hotel", "Cab"
    private String details;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

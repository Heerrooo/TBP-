package com.tbp.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    private Key signingKey;

    @PostConstruct
    public void init() {
        // Initialize signing key. Prefer provided secret; generate a dev key if too short.
        if (jwtSecret == null || jwtSecret.isBlank()) {
            log.warn("jwt.secret is empty; generating a temporary HS512 key (dev only). Set a 64+ byte secret.");
            this.signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
            return;
        }

        byte[] keyBytes;
        try {
            if (jwtSecret.startsWith("base64:")) {
                keyBytes = Base64.getDecoder().decode(jwtSecret.substring(7));
            } else {
                keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
            }
            if (keyBytes.length < 64) {
                log.warn("jwt.secret is {} bytes; HS512 requires >= 64 bytes. Generating a temporary key (dev only).",
                        keyBytes.length);
                this.signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
            } else {
                this.signingKey = Keys.hmacShaKeyFor(keyBytes);
            }
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid jwt.secret format; generating a temporary key (dev only): {}", ex.getMessage());
            this.signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        }
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(signingKey).build().parseClaimsJws(authToken);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public boolean validateToken(String token, String email) {
        try {
            String tokenEmail = getEmailFromToken(token);
            return tokenEmail.equals(email) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        try {
            Date expiration = Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}

package com.questpro.doctor_patient_system.service;

import com.questpro.doctor_patient_system.entities.Users;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secretKey;

    private SecretKey getSigningKey(){
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(Users users){

        return Jwts.builder()
                .subject(users.getEmail())
                .claim("role", users.getRole().name())
                .issuedAt(new Date())                          //milisec sec  minutes
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))   // 1hr token

                .signWith(getSigningKey())
                .compact();
    }

    public String extractUserEmailFromToken(String jwtToken){
        return Jwts.
                parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(jwtToken)
                .getPayload()
                .getSubject();

    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String userEmail = extractUserEmailFromToken(token);
        return userEmail.equals(userDetails.getUsername());
    }

    public String extractRole(String token){
        return Jwts.
                parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role",String.class);
    }



}

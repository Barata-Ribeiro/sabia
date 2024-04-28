package com.barataribeiro.sabia.service.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.barataribeiro.sabia.exceptions.others.InternalServerError;
import com.barataribeiro.sabia.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.AbstractMap.SimpleEntry;
import java.util.Map.Entry;

@Service
public class TokenService {
    @Value("${api.security.token.secret}")
    private String secret_key;

    public Entry<String, Instant> generateToken(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret_key);
            Instant expirationDate = this.generateExpirationDate();

            String token = JWT.create()
                    .withIssuer("auth0")
                    .withSubject(user.getUsername())
                    .withExpiresAt(expirationDate)
                    .sign(algorithm);

            return new SimpleEntry<>(token, expirationDate);
        } catch (JWTCreationException exception) {
            System.err.println(exception.getMessage());
            throw new InternalServerError("Error while authenticating.");
        }

    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret_key);

            return JWT.require(algorithm)
                    .withIssuer("auth0")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            System.err.println(exception.getMessage());
            return null;
        }
    }

    private Instant generateExpirationDate() {
        return LocalDateTime.now().plusDays(1).toInstant(ZoneOffset.of("-03:00"));
    }
}

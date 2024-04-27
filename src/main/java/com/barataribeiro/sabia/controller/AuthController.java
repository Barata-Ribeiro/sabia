package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.auth.LoginRequestDTO;
import com.barataribeiro.sabia.dto.auth.LoginResponseDTO;
import com.barataribeiro.sabia.model.User;
import com.barataribeiro.sabia.repository.UserRepository;
import com.barataribeiro.sabia.service.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequestDTO body) {
        User user = this.userRepository.findByUsername(body.username()).orElseThrow(
                () -> new RuntimeException("User not found.")
        );

        if (passwordEncoder.matches(user.getPassword(), body.password())) {
            Map.Entry<String, Instant> tokenAndExpiration = this.tokenService.generateToken(user);
            String token = tokenAndExpiration.getKey();
            String expirationDate = tokenAndExpiration.getValue().atZone(ZoneOffset.of("-03:00")).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

            return ResponseEntity.ok(new LoginResponseDTO(user.getUsername(), token, expirationDate));
        }

        return ResponseEntity.badRequest().build();
    }
}
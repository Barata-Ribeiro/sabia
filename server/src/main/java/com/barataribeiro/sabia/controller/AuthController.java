package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.auth.LoginRequestDTO;
import com.barataribeiro.sabia.dto.auth.LoginResponseDTO;
import com.barataribeiro.sabia.dto.auth.RegisterRequestDTO;
import com.barataribeiro.sabia.model.Roles;
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
import java.util.Optional;

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

            if (user.getRole().equals(Roles.BANNED) || user.getRole().equals(Roles.NONE)) {
                return ResponseEntity.badRequest().build();
            }

            return ResponseEntity.ok(new LoginResponseDTO(user.getUsername(), token, expirationDate));
        }

        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequestDTO body) {
        var sanitizedUsername = body.username().trim().toLowerCase();
        Optional<User> user = this.userRepository.findByUsername(sanitizedUsername);

        if(user.isEmpty()) {
            User newUser = new User();

            newUser.setPassword(passwordEncoder.encode(body.password()));
            newUser.setUsername(sanitizedUsername);
            newUser.setDisplay_name(body.display_name().trim());
            newUser.setEmail(body.email().trim());
            newUser.setRole(Roles.MEMBER);

            this.userRepository.saveAndFlush(newUser);

            return ResponseEntity.ok().build();
        }

        return ResponseEntity.badRequest().build();
    }
}

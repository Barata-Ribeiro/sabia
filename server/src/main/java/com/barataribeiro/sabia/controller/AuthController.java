package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.RestSuccessResponseDTO;
import com.barataribeiro.sabia.dto.auth.LoginRequestDTO;
import com.barataribeiro.sabia.dto.auth.LoginResponseDTO;
import com.barataribeiro.sabia.dto.auth.RegisterRequestDTO;
import com.barataribeiro.sabia.dto.auth.RegisterResponseDTO;
import com.barataribeiro.sabia.exceptions.auth.InvalidCredentials;
import com.barataribeiro.sabia.exceptions.user.UserAlreadyExists;
import com.barataribeiro.sabia.exceptions.user.UserIsBanned;
import com.barataribeiro.sabia.exceptions.user.UserNotFound;
import com.barataribeiro.sabia.model.Roles;
import com.barataribeiro.sabia.model.User;
import com.barataribeiro.sabia.repository.UserRepository;
import com.barataribeiro.sabia.service.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
        User user = this.userRepository.findByUsername(body.username()).orElseThrow(UserNotFound::new);

        boolean passwordMatches = passwordEncoder.matches(user.getPassword(), body.password());
        boolean userBannedOrNone = user.getRole().equals(Roles.BANNED) || user.getRole().equals(Roles.NONE);

        if (userBannedOrNone) throw new UserIsBanned();

        if (!passwordMatches) throw new InvalidCredentials("Password does not match.");

        Map.Entry<String, Instant> tokenAndExpiration = this.tokenService.generateToken(user);
        String token = tokenAndExpiration.getKey();
        String expirationDate = tokenAndExpiration.getValue().atZone(ZoneOffset.of("-03:00")).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        LoginResponseDTO data = new LoginResponseDTO(user.getUsername(), token, expirationDate);
        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                            HttpStatus.OK.value(),
                                                            "User logged in successfully.",
                                                            data));
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequestDTO body) {
        var sanitizedUsername = body.username().trim().toLowerCase();
        Optional<User> user = this.userRepository.findByUsername(sanitizedUsername);

        if(user.isPresent()) throw new UserAlreadyExists();

        User newUser = null;

        try {
            newUser = User.builder()
                    .password(passwordEncoder.encode(body.password()))
                    .username(sanitizedUsername)
                    .display_name(body.display_name().trim())
                    .email(body.email().trim())
                    .role(Roles.MEMBER)
                    .build();

            this.userRepository.saveAndFlush(newUser);
        } catch (Exception e) {
            throw new RuntimeException("Error creating user." + e.getMessage());
        }

        RegisterResponseDTO data = new RegisterResponseDTO(newUser.getId(), newUser.getUsername(), newUser.getDisplay_name());
        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.CREATED,
                                                            HttpStatus.CREATED.value(),
                                                            "User created successfully.",
                                                            data));
    }
}

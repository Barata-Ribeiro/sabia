package com.barataribeiro.sabia.service.auth;

import com.barataribeiro.sabia.dto.auth.LoginResponseDTO;
import com.barataribeiro.sabia.dto.auth.RegisterRequestDTO;
import com.barataribeiro.sabia.dto.auth.RegisterResponseDTO;
import com.barataribeiro.sabia.exceptions.auth.InvalidCredentials;
import com.barataribeiro.sabia.exceptions.others.InternalServerError;
import com.barataribeiro.sabia.exceptions.user.UserAlreadyExists;
import com.barataribeiro.sabia.exceptions.user.UserIsBanned;
import com.barataribeiro.sabia.exceptions.user.UserNotFound;
import com.barataribeiro.sabia.model.Roles;
import com.barataribeiro.sabia.model.User;
import com.barataribeiro.sabia.repository.UserRepository;
import com.barataribeiro.sabia.service.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public LoginResponseDTO login(String username, String password) {
        User user = this.userRepository.findByUsername(username).orElseThrow(UserNotFound::new);

        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
        boolean userBannedOrNone = user.getRole().equals(Roles.BANNED) || user.getRole().equals(Roles.NONE);

        if (userBannedOrNone) throw new UserIsBanned();

        if (!passwordMatches) throw new InvalidCredentials("Password does not match.");

        Map.Entry<String, Instant> tokenAndExpiration = this.tokenService.generateToken(user);
        String token = tokenAndExpiration.getKey();
        String expirationDate = tokenAndExpiration.getValue().atZone(ZoneOffset.of("-03:00")).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        return new LoginResponseDTO(user.getUsername(), token, expirationDate);
    }

    public RegisterResponseDTO register(RegisterRequestDTO body) {
        var sanitizedUsername = body.username().trim().toLowerCase();
        var sanitizedDisplayName = body.display_name().trim();
        var sanitizedPassword = body.password().trim();

        if (!isEmailValid(body.email())) throw new InvalidCredentials("Invalid Email.");

        Optional<User> userByUsername = this.userRepository.findByUsername(sanitizedUsername);
        Optional<User> userByEmail = this.userRepository.findByEmail(body.email());

        if(userByUsername.isPresent() || userByEmail.isPresent()) throw new UserAlreadyExists();

        User newUser;

        try {
            newUser = User.builder()
                    .username(sanitizedUsername)
                    .display_name(sanitizedDisplayName)
                    .email(body.email())
                    .password(passwordEncoder.encode(sanitizedPassword))
                    .role(Roles.NONE)
                    .build();

            this.userRepository.save(newUser);
        } catch (Exception error) {
            System.err.println("Error creating account: " + error.getMessage());
            throw new InternalServerError("Error creating account. Please try again.");
        }

        return new RegisterResponseDTO(newUser.getUsername(), newUser.getDisplay_name(), newUser.getEmail());
    }

    private boolean isEmailValid(String email) {
        String emailToValidate = email.trim();
        String regexPattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@"
                + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";

        return emailToValidate.matches(regexPattern);
    }
}

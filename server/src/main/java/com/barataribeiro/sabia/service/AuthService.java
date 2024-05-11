package com.barataribeiro.sabia.service;

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
import com.barataribeiro.sabia.util.Validation;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private Validation validation;

    public LoginResponseDTO login(String username, String password, Boolean rememberMe) {
        User user = userRepository.findByUsername(username).orElseThrow(UserNotFound::new);

        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
        boolean userBannedOrNone = user.getRole().equals(Roles.BANNED) || user.getRole().equals(Roles.NONE);

        if (userBannedOrNone) throw new UserIsBanned();

        if (!passwordMatches) throw new InvalidCredentials("You entered the wrong password. Please try again.");

        Map.Entry<String, Instant> tokenAndExpiration = tokenService.generateToken(user, rememberMe);
        String token = tokenAndExpiration.getKey();
        String expirationDate = tokenAndExpiration.getValue().atZone(ZoneOffset.of("-03:00")).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        return new LoginResponseDTO(user.getId(), user.getUsername(), expirationDate, token);
    }

    @Transactional
    public RegisterResponseDTO register(RegisterRequestDTO body) {
        var sanitizedUsername = StringEscapeUtils.escapeHtml4(body.username().toLowerCase().strip());
        var sanitizedDisplayName = StringEscapeUtils.escapeHtml4(body.display_name().strip());
        var sanitizedFullName = StringEscapeUtils.escapeHtml4(body.full_name().strip());
        var sanitizedEmail = StringEscapeUtils.escapeHtml4(body.email().strip());
        var sanitizedPassword = StringEscapeUtils.escapeHtml4(body.password().strip());
        var birthDate = StringEscapeUtils.escapeHtml4(body.birth_date());

        if (validation.isEmailValid(sanitizedEmail)) throw new InvalidCredentials("Invalid Email address.");
        if (validation.isPasswordValid(sanitizedPassword))
            throw new InvalidCredentials("Password must contain at least 8 characters, " +
                                                 "one uppercase letter, " +
                                                 "one lowercase letter, " +
                                                 "one number and one special character.");

        Boolean userByUsername = userRepository.existsByUsername(sanitizedUsername);
        Boolean userByEmail = userRepository.existsByUsername(sanitizedEmail);

        if (userByUsername || userByEmail) throw new UserAlreadyExists();

        Period period = Period.between(LocalDate.parse(birthDate), LocalDate.now());
        if (period.getYears() < 18) {
            throw new InvalidCredentials("You must be at least 18 years old to register.");
        }

        User newUser;

        try {
            newUser = User.builder()
                    .username(sanitizedUsername)
                    .display_name(sanitizedDisplayName)
                    .full_name(sanitizedFullName)
                    .birth_date(birthDate)
                    .email(sanitizedEmail)
                    .password(passwordEncoder.encode(sanitizedPassword))
                    .build();

            userRepository.save(newUser);

            return new RegisterResponseDTO(newUser.getUsername(), newUser.getDisplay_name(), newUser.getEmail());
        } catch (ConstraintViolationException error) {
            System.err.println(error.getMessage());
            throw new InvalidCredentials(error.getMessage());
        } catch (Exception error) {
            System.err.println("Error creating account: " + error.getMessage());
            throw new InternalServerError("Error creating account. Please try again.");
        }
    }
}

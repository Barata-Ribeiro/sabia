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
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public LoginResponseDTO login(String username, String password) {
        User user = this.userRepository.findByUsername(username).orElseThrow(UserNotFound::new);

        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
        boolean userBannedOrNone = user.getRole().equals(Roles.BANNED) || user.getRole().equals(Roles.NONE);

        if (userBannedOrNone) throw new UserIsBanned();

        if (!passwordMatches) throw new InvalidCredentials("You entered the wrong password. Please try again.");

        Map.Entry<String, Instant> tokenAndExpiration = this.tokenService.generateToken(user);
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

        if (!isEmailValid(sanitizedEmail)) throw new InvalidCredentials("Invalid Email address.");

        Boolean userByUsername = this.userRepository.existsByUsername(sanitizedUsername);
        Boolean userByEmail = this.userRepository.existsByUsername(sanitizedEmail);

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

            this.userRepository.save(newUser);

            return new RegisterResponseDTO(newUser.getUsername(), newUser.getDisplay_name(), newUser.getEmail());
        } catch (ConstraintViolationException error) {
            System.err.println(error.getMessage());
            throw new InvalidCredentials(error.getMessage());
        } catch (Exception error) {
            System.err.println("Error creating account: " + error.getMessage());
            throw new InternalServerError("Error creating account. Please try again.");
        }
    }

    private boolean isEmailValid(String emailToValidate) {
        String regexPattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@"
                + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";

        return emailToValidate.matches(regexPattern);
    }
}
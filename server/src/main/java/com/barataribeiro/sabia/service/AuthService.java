package com.barataribeiro.sabia.service;

import com.barataribeiro.sabia.dto.auth.LoginResponseDTO;
import com.barataribeiro.sabia.dto.auth.RegisterRequestDTO;
import com.barataribeiro.sabia.dto.auth.RegisterResponseDTO;
import com.barataribeiro.sabia.exceptions.auth.InvalidCredentials;
import com.barataribeiro.sabia.exceptions.user.UserAlreadyExists;
import com.barataribeiro.sabia.exceptions.user.UserIsBanned;
import com.barataribeiro.sabia.exceptions.user.UserNotFound;
import com.barataribeiro.sabia.model.entities.User;
import com.barataribeiro.sabia.model.enums.Roles;
import com.barataribeiro.sabia.repository.UserRepository;
import com.barataribeiro.sabia.service.security.TokenService;
import com.barataribeiro.sabia.util.Validation;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.StringEscapeUtils;
import org.jetbrains.annotations.NotNull;
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
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final Validation validation;

    public LoginResponseDTO login(String username, String password, Boolean rememberMe, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        String invalidCredentialsMessage = isEnglishLang
                                           ? "You entered the wrong password. Please try again."
                                           : "Você digitou a senha errada. Por favor, tente novamente.";

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFound(language));

        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
        boolean userBannedOrNone = user.getRole().equals(Roles.BANNED) || user.getRole().equals(Roles.NONE);

        if (userBannedOrNone) {
            throw new UserIsBanned(language);
        }

        if (!passwordMatches) {
            throw new InvalidCredentials(invalidCredentialsMessage);
        }

        Map.Entry<String, Instant> tokenAndExpiration = tokenService.generateToken(user, rememberMe);
        String token = tokenAndExpiration.getKey();
        String expirationDate = tokenAndExpiration.getValue()
                .atOffset(ZoneOffset.UTC)
                .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);

        return new LoginResponseDTO(user.getId(),
                                    user.getUsername(),
                                    expirationDate,
                                    token);
    }

    @Transactional
    public RegisterResponseDTO register(@NotNull RegisterRequestDTO body, String language) {
        var sanitizedUsername = StringEscapeUtils.escapeHtml4(body.username().toLowerCase().strip());
        var sanitizedDisplayName = StringEscapeUtils.escapeHtml4(body.display_name().strip());
        var sanitizedFullName = StringEscapeUtils.escapeHtml4(body.full_name().strip());
        var sanitizedEmail = StringEscapeUtils.escapeHtml4(body.email().strip());
        var sanitizedPassword = StringEscapeUtils.escapeHtml4(body.password().strip());
        var birthDate = StringEscapeUtils.escapeHtml4(body.birth_date());

        String invalidEmailMessage = language == null || language.equals("en")
                                     ? "Invalid Email address."
                                     : "Endereço de Email inválido.";

        String invalidPasswordMessage = language == null || language.equals("en")
                                        ? "Password must contain at least 8 characters, " +
                                                "one uppercase letter, " +
                                                "one lowercase letter, " +
                                                "one number and one special character."
                                        : "A senha deve conter pelo menos 8 caracteres, " +
                                                "uma letra maiúscula, " +
                                                "uma letra minúscula, " +
                                                "um número e um caractere especial.";

        String invalidBirthday = language == null || language.equals("en")
                                 ? "You must be at least 18 years old to register."
                                 : "Você deve ter pelo menos 18 anos para se registrar.";

        if (validation.isEmailValid(sanitizedEmail)) {
            throw new InvalidCredentials(invalidEmailMessage);
        }

        if (validation.isPasswordValid(sanitizedPassword)) {
            throw new InvalidCredentials(invalidPasswordMessage);
        }

        Boolean userByUsername = userRepository.existsByUsername(sanitizedUsername);
        Boolean userByEmail = userRepository.existsByUsername(sanitizedEmail);
        if (userByUsername || userByEmail) {
            throw new UserAlreadyExists(language);
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate birthDateLocal = LocalDate.parse(birthDate, formatter);
        Period period = Period.between(birthDateLocal, LocalDate.now());
        if (period.getYears() < 18) {
            throw new InvalidCredentials(invalidBirthday);
        }

        User newUser = User.builder()
                .username(sanitizedUsername)
                .display_name(sanitizedDisplayName)
                .full_name(sanitizedFullName)
                .birth_date(birthDate)
                .email(sanitizedEmail)
                .password(passwordEncoder.encode(sanitizedPassword))
                .build();

        userRepository.save(newUser);

        return new RegisterResponseDTO(newUser.getUsername(),
                                       newUser.getDisplay_name(),
                                       newUser.getEmail());
    }
}

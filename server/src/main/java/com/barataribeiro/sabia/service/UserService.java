package com.barataribeiro.sabia.service;

import com.barataribeiro.sabia.dto.user.ContextResponseDTO;
import com.barataribeiro.sabia.dto.user.ProfileRequestDTO;
import com.barataribeiro.sabia.exceptions.others.ForbiddenRequest;
import com.barataribeiro.sabia.exceptions.others.InternalServerError;
import com.barataribeiro.sabia.exceptions.user.InvalidInput;
import com.barataribeiro.sabia.exceptions.user.UserNotFound;
import com.barataribeiro.sabia.model.User;
import com.barataribeiro.sabia.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ContextResponseDTO getUserContext(String userId, String requesting_user) {
        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFound::new);

        if (!user.getUsername().equals(requesting_user)) {
            throw new ForbiddenRequest("You are not allowed to access this user's information.");
        }

        return getContextResponseDTO(user);
    }

    @Transactional
    public ContextResponseDTO updateOwnAccount(String userId, String requesting_user, ProfileRequestDTO body) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(UserNotFound::new);


            if (!user.getUsername().equals(requesting_user)) {
                throw new ForbiddenRequest("You are not allowed to edit this user's information.");
            }

            Map<String, Object> validatedInputData = validateInputData(body, user);


            user.setUsername(validatedInputData.get("username").toString());
            user.setDisplay_name(validatedInputData.get("display_name").toString());
            user.setFull_name(validatedInputData.get("full_name").toString());
            user.setBirth_date(body.birth_date());
            user.setGender(body.gender());
            user.setEmail(validatedInputData.get("email").toString());
            user.setPassword(passwordEncoder.encode(body.new_password()));
            user.setAvatar_image_url(validatedInputData.get("avatar_image_url").toString());
            user.setCover_image_url(validatedInputData.get("cover_image_url").toString());
            user.setBiography(validatedInputData.get("biography").toString());
            user.setWebsite(validatedInputData.get("website").toString());
            user.setLocation(body.location());

            userRepository.save(user);

            return getContextResponseDTO(user);
        } catch (Exception error) {
            System.err.println("An error occurred while updating the user's account: " + error.getMessage());
            throw new InternalServerError("An error occurred while updating your account. Please try again.");
        }
    }

    @Transactional
    public void deleteOwnAccount(String userId, String requesting_user) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(UserNotFound::new);

            if (!user.getUsername().equals(requesting_user)) {
                throw new ForbiddenRequest("You are not allowed to delete this user's information.");
            }

            userRepository.deleteById(userId);
        } catch (Exception error) {
            System.err.println("An error occurred while deleting the user's account: " + error.getMessage());
            throw new InternalServerError("An error occurred while deleting your account. Please try again.");
        }
    }

    private boolean isEmailValid(String emailToValidate) {
        String regexPattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@"
                + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";

        return emailToValidate.matches(regexPattern);
    }

    private Map<String, Object> validateInputData(ProfileRequestDTO body, User user) {
        if (body.password() != null && !body.password().isEmpty()) {
            if (!passwordEncoder.matches(body.password(), user.getPassword())) {
                throw new InvalidInput("The provided password is incorrect.");
            }

            Map<String, Object> sanitizedBody = sanitizeBody(body);

            if (userRepository.existsByUsername(sanitizedBody.get("username").toString())) {
                throw new InvalidInput("The provided username is already in use.");
            }

            if (userRepository.existsByEmail(sanitizedBody.get("email").toString())) {
                throw new InvalidInput("The provided email is already in use.");
            }

            if (!isEmailValid(sanitizedBody.get("email").toString())) {
                throw new InvalidInput("The provided email is invalid.");
            }

            if (sanitizedBody.get("username").toString().length() < 3 || sanitizedBody.get("username").toString().length() > 20) {
                throw new InvalidInput("The username must be between 3 and 20 characters.");
            }

            if (sanitizedBody.get("display_name").toString().length() < 3 || sanitizedBody.get("display_name").toString().length() > 20) {
                throw new InvalidInput("The display name must be between 3 and 20 characters.");
            }

            if (sanitizedBody.get("full_name").toString().length() < 3 || sanitizedBody.get("full_name").toString().length() > 50) {
                throw new InvalidInput("The full name must be between 3 and 50 characters.");
            }

            if (sanitizedBody.get("biography").toString().length() > 160) {
                throw new InvalidInput("The biography must be less than 160 characters.");
            }

            if (!sanitizedBody.get("avatar_image_url").toString().startsWith("http://") &&
                    !sanitizedBody.get("avatar_image_url").toString().startsWith("https://")) {
                throw new InvalidInput("The avatar image URL must start with 'http://' or 'https://'.");
            }

            if (!sanitizedBody.get("cover_image_url").toString().startsWith("http://") &&
                    !sanitizedBody.get("cover_image_url").toString().startsWith("https://")) {
                throw new InvalidInput("The cover image URL must start with 'http://' or 'https://'.");
            }

            if (!sanitizedBody.get("website").toString().startsWith("http://") &&
                    !sanitizedBody.get("website").toString().startsWith("https://")) {
                throw new InvalidInput("The website must start with 'http://' or 'https://'.");
            }

            if (!body.new_password().isEmpty()) {
                if (passwordEncoder.matches(body.new_password(), user.getPassword())) {
                    throw new InvalidInput("The new password must be different from the current password.");
                }

                if (body.new_password().length() < 8 || body.new_password().length() > 100) {
                    throw new InvalidInput("The new password must be between 8 and 100 characters.");
                }
            }

            return sanitizedBody;
        } else {
            throw new InvalidInput("You must provide your current password to update your account.");
        }
    }

    private static ContextResponseDTO getContextResponseDTO(User user) {
        return new ContextResponseDTO(user.getId(),
                                      user.getUsername(),
                                      user.getDisplay_name(),
                                      user.getFull_name(),
                                      user.getBirth_date(),
                                      user.getGender(),
                                      user.getEmail(),
                                      user.getAvatar_image_url(),
                                      user.getCover_image_url(),
                                      user.getBiography(),
                                      user.getWebsite(),
                                      user.getLocation(),
                                      user.getRole(),
                                      user.getIs_verified(),
                                      user.getIs_private(),
                                      user.getFollower_count(),
                                      user.getFollowing_count(),
                                      user.getCreated_at().toString(),
                                      user.getUpdated_at().toString());
    }

    private static Map<String, Object> sanitizeBody(ProfileRequestDTO body) {
        var sanitizedUsername = StringEscapeUtils.escapeHtml4(body.username().toLowerCase().strip());
        var sanitizedDisplayName = StringEscapeUtils.escapeHtml4(body.display_name().strip());
        var sanitizedFullName = StringEscapeUtils.escapeHtml4(body.full_name().strip());
        var sanitizedEmail = StringEscapeUtils.escapeHtml4(body.email().strip());
        var sanitizedBiography = StringEscapeUtils.escapeHtml4(body.biography().strip());
        var sanitizedWebsite = StringEscapeUtils.escapeHtml4(body.website().strip());

        return Map.of("username", sanitizedUsername,
                      "display_name", sanitizedDisplayName,
                      "full_name", sanitizedFullName,
                      "email", sanitizedEmail,
                      "biography", sanitizedBiography,
                      "website", sanitizedWebsite);
    }
}



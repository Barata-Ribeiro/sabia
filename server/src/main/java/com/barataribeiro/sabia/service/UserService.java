package com.barataribeiro.sabia.service;

import com.barataribeiro.sabia.builder.UserMapper;
import com.barataribeiro.sabia.config.AppConstants;
import com.barataribeiro.sabia.dto.post.PostResponseDTO;
import com.barataribeiro.sabia.dto.user.ProfileRequestDTO;
import com.barataribeiro.sabia.dto.user.PublicProfileResponseDTO;
import com.barataribeiro.sabia.dto.user.UserDTO;
import com.barataribeiro.sabia.exceptions.others.BadRequest;
import com.barataribeiro.sabia.exceptions.others.ForbiddenRequest;
import com.barataribeiro.sabia.exceptions.others.InternalServerError;
import com.barataribeiro.sabia.exceptions.user.InvalidInput;
import com.barataribeiro.sabia.exceptions.user.SameUser;
import com.barataribeiro.sabia.exceptions.user.UserNotFound;
import com.barataribeiro.sabia.model.entities.Follow;
import com.barataribeiro.sabia.model.entities.Post;
import com.barataribeiro.sabia.model.entities.User;
import com.barataribeiro.sabia.repository.FollowRepository;
import com.barataribeiro.sabia.repository.PostRepository;
import com.barataribeiro.sabia.repository.UserRepository;
import com.barataribeiro.sabia.util.EntityMapper;
import com.barataribeiro.sabia.util.Validation;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.StringEscapeUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Unmodifiable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserService {
    private final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final FollowRepository followRepository;
    private final PasswordEncoder passwordEncoder;
    private final Validation validation;
    private final EntityMapper entityMapper;
    private final UserMapper userMapper;

    public Map<String, Object> getUserRecommendations(String requestingUser) {
        List<User> users = userRepository.findAll();

        Map<String, Integer> userScores = getUserScores(users);

        users.sort(Comparator.comparingInt(user -> userScores.get(user.getId())));
        Collections.reverse(users);

        List<PublicProfileResponseDTO> recommendations = new ArrayList<>();

        for (User user : users) {
            if (recommendations.size() >= 5) {
                break;
            }

            if (!user.getUsername().equals(requestingUser)) {
                recommendations.add(entityMapper.getPublicProfileResponseDTO(user, requestingUser));
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("recommendations", recommendations);

        return response;
    }

    public Map<String, Object> getFollowers(String username, int page, int perPage, String requestingUser) {
        Pageable paging = PageRequest.of(page, perPage);

        Page<Follow> followersPage = followRepository.findByFollowed_UsernameOrderByFollowedAtDesc(username, paging);

        List<Follow> followers = new ArrayList<>(followersPage.getContent());

        List<PublicProfileResponseDTO> followersDTOs = followers.stream()
                .map(follow -> entityMapper.getPublicProfileResponseDTO(follow.getFollower(), requestingUser))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("followers", followersDTOs);
        response.put(AppConstants.CURRENT_PAGE, followersPage.getNumber());
        response.put(AppConstants.TOTAL_ITEMS, followersPage.getTotalElements());
        response.put(AppConstants.TOTAL_PAGES, followersPage.getTotalPages());

        return response;
    }

    public PublicProfileResponseDTO getPublicProfile(String username, String requestingUser, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFound(language));

        String privateProfileMessage = isEnglishLang ? "This user's profile is private." : "O perfil deste usuário é privado.";

        if (Boolean.TRUE.equals(user.getIsPrivate())) {
            throw new ForbiddenRequest(privateProfileMessage);
        }

        return entityMapper.getPublicProfileResponseDTO(user, requestingUser);
    }

    public Map<String, Object> searchUser(@NotNull String query, int page, int perPage, String requestingUser, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Pageable paging = PageRequest.of(page, perPage, Sort.by("createdAt").descending());

        String searchParams = query.startsWith("@") ? query.substring(1) : query;

        String invalidParamsMessage = isEnglishLang
                                      ? "The number of items per page must be between 0 and 15."
                                      : "O número de itens por página deve estar entre 0 e 15.";

        String emptyQueryMessage = isEnglishLang
                                   ? "You must provide a term to search for usuário."
                                   : "Você deve fornecer um termo para pesquisar usuários.";

        validation.validateSearchParameters(query, perPage, isEnglishLang, invalidParamsMessage, emptyQueryMessage);

        Page<User> usersPage = userRepository.searchByQuery(searchParams, paging);

        List<User> usersResult = new ArrayList<>(usersPage.getContent());

        List<PublicProfileResponseDTO> usersDTOs = usersResult.stream()
                .map(user -> entityMapper.getPublicProfileResponseDTO(user, requestingUser))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("users", usersDTOs);
        response.put(AppConstants.CURRENT_PAGE, usersPage.getNumber());
        response.put(AppConstants.TOTAL_ITEMS, usersPage.getTotalElements());
        response.put(AppConstants.TOTAL_PAGES, usersPage.getTotalPages());

        return response;
    }

    public UserDTO getUserContext(String requestingUser, String language) {
        User user = userRepository.findByUsername(requestingUser)
                .orElseThrow(() -> new UserNotFound(language));

        return userMapper.toDTO(user);
    }

    @Transactional
    public Map<String, Object> getUserFeed(String userId, int page, int perPage, String requestingUser, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Pageable paging = PageRequest.of(page, perPage);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFound(language));

        String notAllowedMessage = isEnglishLang
                                   ? "You are not allowed to access this user's feed."
                                   : "Você não tem permissão para acessar o feed deste usuário.";

        String invalidParamsMessage = isEnglishLang
                                      ? "The number of items per page must be between 1 and 20."
                                      : "O número de itens por página deve estar entre 1 e 20.";

        if (!user.getUsername().equals(requestingUser)) {
            throw new ForbiddenRequest(notAllowedMessage);
        }

        if (perPage < 0 || perPage > 20) {
            throw new BadRequest(invalidParamsMessage);
        }

        Set<Follow> followings = user.getFollowings();

        List<User> authors = followings.stream()
                .map(Follow::getFollowed)
                .collect(Collectors.toList());

        authors.add(user);

        Page<Post> postPage = postRepository.findDistinctByAuthorInOrderByCreatedAtDesc(authors, paging);

        return createResponseFromPostPage(postPage, requestingUser);
    }

    @Transactional
    public Map<String, Object> getUserPublicFeed(String userId, int page, int perPage, String requestingUser, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Pageable paging = PageRequest.of(page, perPage, Sort.by("createdAt").descending());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFound(language));

        String privateProfileMessage = isEnglishLang
                                       ? "This user's profile is private."
                                       : "O perfil deste usuário é privado.";

        if (Boolean.TRUE.equals(user.getIsPrivate())) {
            throw new ForbiddenRequest(privateProfileMessage);
        }

        Page<Post> postPage = postRepository.findDistinctAllByAuthorIdOrderByCreatedAtDesc(user.getId(), paging);

        return createResponseFromPostPage(postPage, requestingUser);
    }

    @Transactional
    public UserDTO updateOwnAccount(String userId, String requestingUser, ProfileRequestDTO body, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        String notAllowedMessage = isEnglishLang
                                   ? "You are not allowed to edit this user's information."
                                   : "Você não tem permissão para editar as informações deste usuário.";

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFound(language));

        if (!user.getUsername().equals(requestingUser)) {
            throw new ForbiddenRequest(notAllowedMessage);
        }

        Map<String, Object> validatedInputData = validateInputData(body, user, isEnglishLang);

        user.setUsername(validatedInputData.get(AppConstants.USERNAME).toString());
        user.setDisplayName(validatedInputData.get(AppConstants.DISPLAY_NAME).toString());
        user.setFullName(validatedInputData.get(AppConstants.FULL_NAME).toString());
        user.setBirthDate(body.birthDate());
        user.setGender(body.gender());
        user.setEmail(validatedInputData.get(AppConstants.EMAIL).toString());
        user.setPassword(passwordEncoder.encode(body.newPassword()));
        user.setAvatarImageUrl(validatedInputData.get(AppConstants.AVATAR_IMAGE_URL).toString());
        user.setCoverImageUrl(validatedInputData.get(AppConstants.COVER_IMAGE_URL).toString());
        user.setBiography(validatedInputData.get(AppConstants.BIOGRAPHY).toString());
        user.setWebsite(validatedInputData.get(AppConstants.WEBSITE).toString());
        user.setLocation(body.location());

        User savedUser = userRepository.save(user);

        return userMapper.toDTO(savedUser);
    }

    @Transactional
    public void deleteOwnAccount(String userId, String requestingUser, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        String genericErrorMessage = isEnglishLang
                                     ? "An error occurred while deleting your account. Please try again."
                                     : "Ocorreu um erro ao excluir sua conta. Por favor, tente novamente.";

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFound(language));

            String notAllowedMessage = isEnglishLang
                                       ? "You are not allowed to delete this user's information."
                                       : "Você não tem permissão para excluir as informações deste usuário.";

            if (!user.getUsername().equals(requestingUser)) {
                throw new ForbiddenRequest(notAllowedMessage);
            }


            userRepository.deleteById(userId);
        } catch (Exception error) {
            logger.error("An error occurred while deleting the user's account: %s".formatted(error.getMessage()));
            throw new InternalServerError(genericErrorMessage);
        }
    }

    @Transactional
    public void followUser(@NotNull String userId, String followedId, String requestingUser, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        String sameUserMessage = isEnglishLang
                                 ? "You cannot follow yourself."
                                 : "Você não pode seguir a si mesmo.";

        String notAllowedMessage = isEnglishLang
                                   ? "You are not allowed to follow this user."
                                   : "Você não tem permissão para seguir este usuário.";

        String alreadyFollowingMessage = isEnglishLang
                                         ? "You are already following this user."
                                         : "Você já está seguindo este usuário.";

        if (userId.equals(followedId)) {
            throw new SameUser(sameUserMessage);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFound(language));

        User followedUser = userRepository.findById(followedId)
                .orElseThrow(() -> new UserNotFound(language));

        if (!user.getUsername().equals(requestingUser)) {
            throw new ForbiddenRequest(notAllowedMessage);
        }

        var isAlreadyFollowing = user.getFollowings().stream().anyMatch(follow -> follow.getFollowed().getId().equals(followedId)) ||
                followRepository.existsByFollowerIdAndFollowedId(userId, followedId);

        if (isAlreadyFollowing) {
            throw new BadRequest(alreadyFollowingMessage);
        }

        if (Boolean.TRUE.equals(followedUser.getIsPrivate())) {
            throw new ForbiddenRequest(notAllowedMessage);
        }

        Follow newFollow = Follow.builder()
                .follower(user)
                .followed(followedUser)
                .build();

        followRepository.save(newFollow);

        user.getFollowings().add(newFollow);
        user.incrementFollowingCount();

        followedUser.getFollowers().add(newFollow);
        followedUser.incrementFollowerCount();

        userRepository.save(user);
        userRepository.save(followedUser);
    }

    @Transactional
    public void unfollowUser(String userId, String followedId, String requestingUser, String language) {
        boolean isEnglishLang = language == null || language.equals("en");


        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFound(language));

        User followedUser = userRepository.findById(followedId)
                .orElseThrow(() -> new UserNotFound(language));

        String notAllowedMessage = isEnglishLang
                                   ? "You are not allowed to unfollow this user."
                                   : "Você não tem permissão para deixar de seguir este usuário.";

        String notFollowingMessage = isEnglishLang
                                     ? "You are not following this user."
                                     : "Você não está seguindo este usuário.";

        if (!user.getUsername().equals(requestingUser)) {
            throw new ForbiddenRequest(notAllowedMessage);
        }

        Follow follow = followRepository.findByFollowerIdAndFollowedId(userId, followedId)
                .orElseThrow(() -> new BadRequest(notFollowingMessage));

        followRepository.delete(follow);

        user.decrementFollowingCount();
        followedUser.decrementFollowerCount();

        userRepository.save(user);
        userRepository.save(followedUser);
    }

    private @NotNull Map<String, Object> createResponseFromPostPage(@NotNull Page<Post> postPage, String requestingUser) {
        List<Post> posts = new ArrayList<>(postPage.getContent());

        List<PostResponseDTO> mappedPosts = posts.stream()
                .map(post -> entityMapper.getPostResponseDTO(post, requestingUser))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("feed", mappedPosts);
        response.put(AppConstants.CURRENT_PAGE, postPage.getNumber());
        response.put(AppConstants.TOTAL_ITEMS, postPage.getTotalElements());
        response.put(AppConstants.TOTAL_PAGES, postPage.getTotalPages());

        return response;
    }

    private @NotNull @Unmodifiable Map<String, Object> validateInputData(@NotNull ProfileRequestDTO body, User user, boolean isEnglishLang) {
        validatePassword(body, user, isEnglishLang);
        Map<String, Object> sanitizedBody = sanitizeBody(body);
        validateSanitizedBody(sanitizedBody, isEnglishLang);
        validateNewPassword(body, user, isEnglishLang);
        return sanitizedBody;
    }

    private void validatePassword(@NotNull ProfileRequestDTO body, User user, boolean isEnglishLang) {
        if (body.password() == null || body.password().isEmpty()) {
            throw new InvalidInput(isEnglishLang
                                   ? "You must provide your current password to update your account."
                                   : "Você deve fornecer sua senha atual para atualizar sua conta.");
        }

        if (!passwordEncoder.matches(body.password(), user.getPassword())) {
            throw new InvalidInput(isEnglishLang
                                   ? "The provided password is incorrect."
                                   : "A senha fornecida está incorreta.");
        }
    }

    private void validateSanitizedBody(@NotNull Map<String, Object> sanitizedBody, boolean isEnglishLang) {
        validateUsername(sanitizedBody.get(AppConstants.USERNAME).toString(), isEnglishLang);
        validateEmail(sanitizedBody.get(AppConstants.EMAIL).toString(), isEnglishLang);
        validateDisplayName(sanitizedBody.get(AppConstants.DISPLAY_NAME).toString(), isEnglishLang);
        validateFullName(sanitizedBody.get(AppConstants.FULL_NAME).toString(), isEnglishLang);
        validateBiography(sanitizedBody.get(AppConstants.BIOGRAPHY).toString(), isEnglishLang);
        validateHttpsUrl(sanitizedBody.get(AppConstants.AVATAR_IMAGE_URL).toString(), isEnglishLang);
        validateHttpsUrl(sanitizedBody.get(AppConstants.COVER_IMAGE_URL).toString(), isEnglishLang);
        validateHttpsUrl(sanitizedBody.get(AppConstants.WEBSITE).toString(), isEnglishLang);
    }

    private void validateUsername(@NotNull String username, boolean isEnglishLang) {
        if (username.length() < 3 || username.length() > 20) {
            throw new InvalidInput(isEnglishLang
                                   ? "The username must be between 3 and 20 characters."
                                   : "O nome de usuário deve ter entre 3 e 20 caracteres.");
        }

        if (Boolean.TRUE.equals(userRepository.existsByUsername(username))) {
            throw new InvalidInput(isEnglishLang
                                   ? "The provided username is already in use."
                                   : "O nome de usuário fornecido já está em uso.");
        }
    }

    private void validateEmail(String email, boolean isEnglishLang) {
        if (Boolean.TRUE.equals(userRepository.existsByEmail(email))) {
            throw new InvalidInput(isEnglishLang
                                   ? "The provided email is already in use."
                                   : "O e-mail fornecido já está em uso.");
        }

        if (validation.isEmailValid(email)) {
            throw new InvalidInput(isEnglishLang
                                   ? "The provided email is invalid."
                                   : "O e-mail fornecido é inválido.");
        }
    }

    private void validateDisplayName(@NotNull String displayName, boolean isEnglishLang) {
        if (displayName.length() < 3 || displayName.length() > 20) {
            throw new InvalidInput(isEnglishLang
                                   ? "The display name must be between 3 and 20 characters."
                                   : "O nome de exibição deve ter entre 3 e 20 caracteres.");
        }
    }

    private void validateFullName(@NotNull String fullName, boolean isEnglishLang) {
        if (fullName.length() < 3 || fullName.length() > 50) {
            throw new InvalidInput(isEnglishLang
                                   ? "The full name must be between 3 and 50 characters."
                                   : "O nome completo deve ter entre 3 e 50 caracteres.");
        }
    }

    private void validateBiography(@NotNull String biography, boolean isEnglishLang) {
        if (biography.length() > 160) {
            throw new InvalidInput(isEnglishLang
                                   ? "The biography must be less than 160 characters."
                                   : "A biografia deve ter menos de 160 caracteres.");
        }
    }

    private void validateHttpsUrl(@NotNull String url, boolean isEnglishLang) {
        if (!url.startsWith(AppConstants.PROTOCOL_HTTPS)) {
            throw new InvalidInput(isEnglishLang
                                   ? AppConstants.WITH_HTTPS_ENG
                                   : AppConstants.WITH_HTTPS_BR);
        }
    }

    private void validateNewPassword(@NotNull ProfileRequestDTO body, User user, boolean isEnglishLang) {
        if (body.newPassword() != null && !body.newPassword().isEmpty()) {
            if (!validation.isPasswordValid(body.newPassword())) {
                throw new InvalidInput(isEnglishLang
                                       ? "The new password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long."
                                       : "A nova senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um dígito, um caractere especial, e ter pelo menos 8 caracteres.");
            }

            if (passwordEncoder.matches(body.newPassword(), user.getPassword())) {
                throw new InvalidInput(isEnglishLang
                                       ? "The new password must be different from the current password."
                                       : "A nova senha deve ser diferente da senha atual.");
            }
        }
    }


    private static @NotNull Map<String, Integer> getUserScores(@NotNull List<User> users) {
        Map<String, Integer> userScores = new HashMap<>();

        for (User user : users) {
            if (Boolean.TRUE.equals(user.getIsPrivate())) {
                userScores.put(user.getId(), 0);
                continue;
            }

            long score = user.getFollowerCount() * 2;
            for (Post post : user.getPosts()) {
                score += 1;
                score += post.getLikes().size();
                score += post.getViewsCount() * 3;
            }

            if (Boolean.TRUE.equals(user.getIsVerified())) {
                score += 1000;
            }

            userScores.put(user.getId(), (int) score);
        }

        return userScores;
    }

    private static @NotNull @Unmodifiable Map<String, Object> sanitizeBody(@NotNull ProfileRequestDTO body) {
        var sanitizedUsername = StringEscapeUtils.escapeHtml4(body.username().toLowerCase().strip());
        var sanitizedDisplayName = StringEscapeUtils.escapeHtml4(body.display_name().strip());
        var sanitizedFullName = StringEscapeUtils.escapeHtml4(body.fullName().strip());
        var sanitizedEmail = StringEscapeUtils.escapeHtml4(body.email().strip());
        var sanitizedBiography = StringEscapeUtils.escapeHtml4(body.biography().strip());
        var sanitizedWebsite = StringEscapeUtils.escapeHtml4(body.website().strip());

        return Map.of(AppConstants.USERNAME, sanitizedUsername,
                      AppConstants.DISPLAY_NAME, sanitizedDisplayName,
                      AppConstants.FULL_NAME, sanitizedFullName,
                      AppConstants.EMAIL, sanitizedEmail,
                      AppConstants.BIOGRAPHY, sanitizedBiography,
                      AppConstants.WEBSITE, sanitizedWebsite);
    }
}



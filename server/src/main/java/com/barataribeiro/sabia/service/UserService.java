package com.barataribeiro.sabia.service;

import com.barataribeiro.sabia.builder.UserMapper;
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
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final FollowRepository followRepository;
    private final PasswordEncoder passwordEncoder;
    private final Validation validation;
    private final EntityMapper entityMapper;
    private final UserMapper userMapper;

    public Map<String, Object> getUserRecommendations(String requesting_user, String language) {
        List<User> users = userRepository.findAll();

        Map<String, Integer> userScores = getUserScores(users);

        users.sort(Comparator.comparingInt(user -> userScores.get(user.getId())));
        Collections.reverse(users);

        List<PublicProfileResponseDTO> recommendations = new ArrayList<>();

        for (User user : users) {
            if (recommendations.size() >= 5) {
                break;
            }

            if (!user.getUsername().equals(requesting_user)) {
                recommendations.add(entityMapper.getPublicProfileResponseDTO(user, requesting_user));
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("recommendations", recommendations);

        return response;
    }

    public Map<String, Object> getFollowers(String username, int page, int perPage, String requesting_user, String language) {
        Pageable paging = PageRequest.of(page, perPage);

        Page<Follow> followersPage = followRepository.findByFollowed_UsernameOrderByFollowedAtDesc(username, paging);

        List<Follow> followers = new ArrayList<>(followersPage.getContent());

        List<PublicProfileResponseDTO> followersDTOs = followers.stream()
                .map(follow -> entityMapper.getPublicProfileResponseDTO(follow.getFollower(), requesting_user))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("followers", followersDTOs);
        response.put("current_page", followersPage.getNumber());
        response.put("total_items", followersPage.getTotalElements());
        response.put("total_pages", followersPage.getTotalPages());

        return response;
    }

    public PublicProfileResponseDTO getPublicProfile(String username, String requesting_user, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFound(language));

        String privateProfileMessage = isEnglishLang ? "This user's profile is private." : "O perfil deste usuário é privado.";

        if (user.getIs_private()) {
            throw new ForbiddenRequest(privateProfileMessage);
        }

        return entityMapper.getPublicProfileResponseDTO(user, requesting_user);
    }

    public Map<String, Object> searchUser(@NotNull String query, int page, int perPage, String requesting_user, String language) {
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
                .map(user -> entityMapper.getPublicProfileResponseDTO(user, requesting_user))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("users", usersDTOs);
        response.put("current_page", usersPage.getNumber());
        response.put("total_items", usersPage.getTotalElements());
        response.put("total_pages", usersPage.getTotalPages());

        return response;
    }

    public UserDTO getUserContext(String requesting_user, String language) {
        User user = userRepository.findByUsername(requesting_user)
                .orElseThrow(() -> new UserNotFound(language));

        return userMapper.toDTO(user);
    }

    @Transactional
    public Map<String, Object> getUserFeed(String userId, int page, int perPage, String requesting_user, String language) {
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

        if (!user.getUsername().equals(requesting_user)) {
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

        return createResponseFromPostPage(postPage, requesting_user);
    }

    @Transactional
    public Map<String, Object> getUserPublicFeed(String userId, int page, int perPage, String requesting_user, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Pageable paging = PageRequest.of(page, perPage, Sort.by("createdAt").descending());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFound(language));

        String privateProfileMessage = isEnglishLang
                                       ? "This user's profile is private."
                                       : "O perfil deste usuário é privado.";

        if (user.getIs_private()) {
            throw new ForbiddenRequest(privateProfileMessage);
        }

        Page<Post> postPage = postRepository.findDistinctAllByAuthorId(user.getId(), paging);

        return createResponseFromPostPage(postPage, requesting_user);
    }

    @Transactional
    public UserDTO updateOwnAccount(String userId, String requesting_user, ProfileRequestDTO body, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        String genericErrorMessage = isEnglishLang
                                     ? "An error occurred while updating your account. Please try again."
                                     : "Ocorreu um erro ao atualizar sua conta. Por favor, tente novamente.";

        String notAllowedMessage = isEnglishLang
                                   ? "You are not allowed to edit this user's information."
                                   : "Você não tem permissão para editar as informações deste usuário.";

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFound(language));

        if (!user.getUsername().equals(requesting_user)) {
            throw new ForbiddenRequest(notAllowedMessage);
        }

        Map<String, Object> validatedInputData = validateInputData(body, user, isEnglishLang);

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

        User savedUser = userRepository.save(user);

        return userMapper.toDTO(savedUser);
    }

    @Transactional
    public void deleteOwnAccount(String userId, String requesting_user, String language) {
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

            if (!user.getUsername().equals(requesting_user)) {
                throw new ForbiddenRequest(notAllowedMessage);
            }


            userRepository.deleteById(userId);
        } catch (Exception error) {
            System.err.println("An error occurred while deleting the user's account: " + error.getMessage());
            throw new InternalServerError(genericErrorMessage);
        }
    }

    @Transactional
    public void followUser(@NotNull String userId, String followedId, String requesting_user, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        String genericErrorMessage = isEnglishLang
                                     ? "An error occurred while following the user. Please try again."
                                     : "Ocorreu um erro ao seguir o usuário. Por favor, tente novamente.";


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

        if (!user.getUsername().equals(requesting_user)) {
            throw new ForbiddenRequest(notAllowedMessage);
        }

        var isAlreadyFollowing = user.getFollowings().stream().anyMatch(follow -> follow.getFollowed().getId().equals(followedId)) ||
                followRepository.existsByFollowerIdAndFollowedId(userId, followedId);

        if (isAlreadyFollowing) {
            throw new BadRequest(alreadyFollowingMessage);
        }

        if (followedUser.getIs_private()) {
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
    public void unfollowUser(String userId, String followedId, String requesting_user, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        String genericErrorMessage = isEnglishLang
                                     ? "An error occurred while unfollowing the user. Please try again."
                                     : "Ocorreu um erro ao deixar de seguir o usuário. Por favor, tente novamente.";


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

        if (!user.getUsername().equals(requesting_user)) {
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

    private @NotNull Map<String, Object> createResponseFromPostPage(@NotNull Page<Post> postPage, String requesting_user) {
        List<Post> posts = new ArrayList<>(postPage.getContent());

        List<PostResponseDTO> mappedPosts = posts.stream()
                .map(post -> entityMapper.getPostResponseDTO(post, requesting_user))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("feed", mappedPosts);
        response.put("current_page", postPage.getNumber());
        response.put("total_items", postPage.getTotalElements());
        response.put("total_pages", postPage.getTotalPages());

        return response;
    }

    private @NotNull Map<String, Object> validateInputData(@NotNull ProfileRequestDTO body, User user, boolean isEnglishLang) {
        if (body.password() != null && !body.password().isEmpty()) {
            if (!passwordEncoder.matches(body.password(), user.getPassword())) {
                throw new InvalidInput(isEnglishLang
                                       ? "The provided password is incorrect."
                                       : "A senha fornecida está incorreta.");
            }

            if (body.new_password() != null && !body.new_password().isEmpty()) {
                if (validation.isPasswordValid(body.new_password())) {
                    throw new InvalidInput(isEnglishLang
                                           ? "The new password must contain at least one uppercase " +
                                                   "letter, " +
                                                   "one lowercase letter, one digit, " +
                                                   "one special character, " +
                                                   "and be at least 8 characters long."
                                           : "A nova senha deve conter pelo menos uma letra maiúscula, " +
                                                   "uma letra minúscula, um dígito, " +
                                                   "um caractere especial, " +
                                                   "e ter pelo menos 8 caracteres.");
                }
            }

            Map<String, Object> sanitizedBody = sanitizeBody(body);

            if (userRepository.existsByUsername(sanitizedBody.get("username").toString())) {
                throw new InvalidInput(isEnglishLang
                                       ? "The provided username is already in use."
                                       : "O nome de usuário fornecido já está em uso.");
            }

            if (userRepository.existsByEmail(sanitizedBody.get("email").toString())) {
                throw new InvalidInput(isEnglishLang
                                       ? "The provided email is already in use." : "O e-mail fornecido já está em uso.");
            }

            if (validation.isEmailValid(sanitizedBody.get("email").toString())) {
                throw new InvalidInput(isEnglishLang
                                       ? "The provided email is invalid."
                                       : "O e-mail fornecido é inválido.");
            }

            if (sanitizedBody.get("username").toString().length() < 3 || sanitizedBody.get("username").toString().length() > 20) {
                throw new InvalidInput(isEnglishLang
                                       ? "The username must be between 3 and 20 characters."
                                       : "O nome de usuário deve ter entre 3 e 20 caracteres.");
            }

            if (sanitizedBody.get("display_name").toString().length() < 3 || sanitizedBody.get("display_name").toString().length() > 20) {
                throw new InvalidInput(isEnglishLang
                                       ? "The display name must be between 3 and 20 characters."
                                       : "O nome de exibição deve ter entre 3 e 20 caracteres.");
            }

            if (sanitizedBody.get("full_name").toString().length() < 3 || sanitizedBody.get("full_name").toString().length() > 50) {
                throw new InvalidInput(isEnglishLang
                                       ? "The full name must be between 3 and 50 characters."
                                       : "O nome completo deve ter entre 3 e 50 caracteres.");
            }

            if (sanitizedBody.get("biography").toString().length() > 160) {
                throw new InvalidInput(isEnglishLang
                                       ? "The biography must be less than 160 characters."
                                       : "A biografia deve ter menos de 160 caracteres.");
            }

            if (!sanitizedBody.get("avatar_image_url").toString().startsWith("https://")) {
                throw new InvalidInput(isEnglishLang
                                       ? "The avatar image URL must start with 'https://'."
                                       : "A URL da imagem do avatar deve começar com 'https://'.");
            }

            if (!sanitizedBody.get("cover_image_url").toString().startsWith("https://")) {
                throw new InvalidInput(isEnglishLang
                                       ? "The avatar image URL must start with 'https://'."
                                       : "A URL da imagem de capa deve começar com 'https://'.");
            }

            if (!sanitizedBody.get("website").toString().startsWith("https://")) {
                throw new InvalidInput(isEnglishLang
                                       ? "The avatar image URL must start with 'https://'."
                                       : "A URL do site deve começar com 'https://'.");
            }

            if (body.new_password() != null && !body.new_password().isEmpty()) {
                if (passwordEncoder.matches(body.new_password(), user.getPassword())) {
                    throw new InvalidInput(isEnglishLang
                                           ? "The new password must be different from the current password."
                                           : "A nova senha deve ser diferente da senha atual.");
                }

                if (body.new_password().length() < 8 || body.new_password().length() > 100) {
                    throw new InvalidInput(isEnglishLang
                                           ? "The new password must be between 8 and 100 characters."
                                           : "A nova senha deve ter entre 8 e 100 caracteres.");
                }
            }

            return sanitizedBody;
        } else {
            throw new InvalidInput(isEnglishLang
                                   ? "You must provide your current password to update your account."
                                   : "Você deve fornecer sua senha atual para atualizar sua conta.");
        }
    }

    private static @NotNull Map<String, Integer> getUserScores(@NotNull List<User> users) {
        Map<String, Integer> userScores = new HashMap<>();

        for (User user : users) {
            if (user.getIs_private()) {
                userScores.put(user.getId(), 0);
                continue;
            }

            long score = user.getFollower_count() * 2;
            for (Post post : user.getPosts()) {
                score += 1;
                score += post.getLikes().size();
                score += post.getViews_count() * 3;
            }

            if (user.getIs_verified()) {
                score += 1000;
            }

            userScores.put(user.getId(), (int) score);
        }

        return userScores;
    }

    private static @NotNull @Unmodifiable Map<String, Object> sanitizeBody(@NotNull ProfileRequestDTO body) {
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



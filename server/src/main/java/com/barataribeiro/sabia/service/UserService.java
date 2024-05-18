package com.barataribeiro.sabia.service;

import com.barataribeiro.sabia.dto.post.PostResponseDTO;
import com.barataribeiro.sabia.dto.user.AuthorResponseDTO;
import com.barataribeiro.sabia.dto.user.ContextResponseDTO;
import com.barataribeiro.sabia.dto.user.ProfileRequestDTO;
import com.barataribeiro.sabia.dto.user.PublicProfileResponseDTO;
import com.barataribeiro.sabia.exceptions.others.BadRequest;
import com.barataribeiro.sabia.exceptions.others.ForbiddenRequest;
import com.barataribeiro.sabia.exceptions.others.InternalServerError;
import com.barataribeiro.sabia.exceptions.user.InvalidInput;
import com.barataribeiro.sabia.exceptions.user.SameUser;
import com.barataribeiro.sabia.exceptions.user.UserNotFound;
import com.barataribeiro.sabia.model.Follow;
import com.barataribeiro.sabia.model.Post;
import com.barataribeiro.sabia.model.User;
import com.barataribeiro.sabia.repository.FollowRepository;
import com.barataribeiro.sabia.repository.PostRepository;
import com.barataribeiro.sabia.repository.UserRepository;
import com.barataribeiro.sabia.util.Validation;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private Validation validation;


    @CacheEvict(value = "users", key = "#userId")
    public PublicProfileResponseDTO getPublicProfile(String userId, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFound(language));

        String privateProfileMessage = isEnglishLang ? "This user's profile is private." : "O perfil deste usuário é privado.";

        if (user.getIs_private()) {
            throw new ForbiddenRequest(privateProfileMessage);
        }

        return getPublicProfileResponseDTO(user);
    }

    @CacheEvict(value = "users", key = "#userId")
    public Map<String, Object> getFollowers(String userId, int page, int perPage, String language) {
        Pageable paging = PageRequest.of(page, perPage);

        Page<Follow> followersPage = followRepository.findByFollowedIdOrderByFollowedAtDesc(userId, paging);

        List<Follow> followers = new ArrayList<>(followersPage.getContent());

        List<PublicProfileResponseDTO> followersDTOs = followers.stream()
                .map(follow -> getPublicProfileResponseDTO(follow.getFollower()))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("followers", followersDTOs);
        response.put("current_page", followersPage.getNumber());
        response.put("total_items", followersPage.getTotalElements());
        response.put("total_pages", followersPage.getTotalPages());

        return response;
    }

    @Cacheable(value = "users", key = "{#query, #page, #perPage, #language}")
    public Map<String, Object> searchUser(String query, int page, int perPage, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        Pageable paging = PageRequest.of(page, perPage, Sort.by("createdAt").descending());

        String searchParams = query.startsWith("@") ? query.substring(1) : query;

        String invalidParamsMessage = isEnglishLang
                                      ? "The number of items per page must be between 0 and 15."
                                      : "O número de itens por página deve estar entre 0 e 15.";

        String emptyQueryMessage = isEnglishLang
                                   ? "You must provide a term to search for usuário."
                                   : "Você deve fornecer um termo para pesquisar usuários.";

        String shortQueryMessage = isEnglishLang
                                   ? "The search term must be at least 3 characters long."
                                   : "O termo de pesquisa deve ter pelo menos 3 caracteres.";

        if (perPage < 0 || perPage > 15) {
            throw new BadRequest(invalidParamsMessage);
        }

        if (query.isEmpty()) {
            throw new BadRequest(emptyQueryMessage);
        }

        if (query.length() < 3) {
            throw new BadRequest(shortQueryMessage);
        }

        Page<User> usersPage = userRepository.searchByQuery(searchParams, paging);

        List<User> usersResult = new ArrayList<>(usersPage.getContent());

        List<PublicProfileResponseDTO> usersDTOs = usersResult.stream()
                .map(UserService::getPublicProfileResponseDTO)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("users", usersDTOs);
        response.put("current_page", usersPage.getNumber());
        response.put("total_items", usersPage.getTotalElements());
        response.put("total_pages", usersPage.getTotalPages());

        return response;
    }

    @CacheEvict(value = "users", key = "#requesting_user")
    public ContextResponseDTO getUserContext(String requesting_user, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        User user = userRepository.findByUsername(requesting_user)
                .orElseThrow(() -> new UserNotFound(language));

        return getContextResponseDTO(user);
    }

    @Cacheable(value = "users", key = "{#userId, #page, #perPage, #requesting_user, #language}")
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

        List<User> followings = user.getFollowings().stream()
                .map(Follow::getFollowed)
                .collect(Collectors.toList());

        followings.add(user);

        Page<Post> postPage = postRepository.findByAuthorInOrderByCreatedAtDesc(followings, paging);

        List<Post> posts = new ArrayList<>(postPage.getContent());

        List<PostResponseDTO> mappedPosts = posts.stream()
                .map(UserService::getPostResponseDTO)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("feed", mappedPosts);
        response.put("current_page", postPage.getNumber());
        response.put("total_items", postPage.getTotalElements());
        response.put("total_pages", postPage.getTotalPages());

        return response;
    }

    @Transactional
    @CacheEvict(value = "users", key = "#userId")
    public ContextResponseDTO updateOwnAccount(String userId, String requesting_user, ProfileRequestDTO body, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        String genericErrorMessage = isEnglishLang
                                     ? "An error occurred while updating your account. Please try again."
                                     : "Ocorreu um erro ao atualizar sua conta. Por favor, tente novamente.";

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFound(language));

            String notAllowedMessage = isEnglishLang
                                       ? "You are not allowed to edit this user's information."
                                       : "Você não tem permissão para editar as informações deste usuário.";

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

            user = userRepository.saveAndFlush(user);

            return getContextResponseDTO(user);
        } catch (Exception error) {
            System.err.println("An error occurred while updating the user's account: " + error.getMessage());
            throw new InternalServerError(genericErrorMessage);
        }
    }

    @Transactional
    @CacheEvict(value = "users", key = "#userId")
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
    public void followUser(String userId, String followedId, String requesting_user, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        String genericErrorMessage = isEnglishLang
                                     ? "An error occurred while following the user. Please try again."
                                     : "Ocorreu um erro ao seguir o usuário. Por favor, tente novamente.";

        try {
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

            user.getFollowers().add(newFollow);
            user.incrementFollowerCount();

            followedUser.getFollowings().add(newFollow);
            followedUser.incrementFollowingCount();

            userRepository.save(user);
            userRepository.save(followedUser);
        } catch (Exception error) {
            System.err.println("An error occurred while following the user: " + error.getMessage());
            throw new InternalServerError(genericErrorMessage);
        }
    }

    @Transactional
    public void unfollowUser(String userId, String followedId, String requesting_user, String language) {
        boolean isEnglishLang = language == null || language.equals("en");

        String genericErrorMessage = isEnglishLang
                                     ? "An error occurred while unfollowing the user. Please try again."
                                     : "Ocorreu um erro ao deixar de seguir o usuário. Por favor, tente novamente.";

        try {
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

            var follow = user.getFollowings().stream()
                    .filter(f -> f.getFollowed().getId().equals(followedId))
                    .findFirst()
                    .orElseThrow(() -> new BadRequest(notFollowingMessage));

            user.getFollowings().remove(follow);
            user.decrementFollowingCount();

            followedUser.getFollowers().remove(follow);
            followedUser.decrementFollowerCount();

            userRepository.save(user);
            userRepository.save(followedUser);
        } catch (Exception error) {
            System.err.println("An error occurred while unfollowing the user: " + error.getMessage());
            throw new InternalServerError(genericErrorMessage);
        }
    }

    private Map<String, Object> validateInputData(ProfileRequestDTO body, User user, boolean isEnglishLang) {
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

    private static PublicProfileResponseDTO getPublicProfileResponseDTO(User user) {
        return new PublicProfileResponseDTO(user.getId(),
                                            user.getUsername(),
                                            user.getDisplay_name(),
                                            user.getRole().toString(),
                                            user.getAvatar_image_url(),
                                            user.getCover_image_url(),
                                            user.getBiography(),
                                            user.getWebsite(),
                                            user.getLocation(),
                                            user.getIs_verified(),
                                            user.getIs_private(),
                                            Math.toIntExact(user.getFollower_count()),
                                            Math.toIntExact(user.getFollowing_count()),
                                            user.getPosts().size(),
                                            user.getLiked_posts().size(),
                                            user.getCreatedAt().toString(),
                                            user.getUpdatedAt().toString());
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
                                      user.getCreatedAt().toString(),
                                      user.getUpdatedAt().toString());
    }

    private static PostResponseDTO getPostResponseDTO(Post post) {
        return new PostResponseDTO(
                post.getId(),
                new AuthorResponseDTO(
                        post.getAuthor().getId(),
                        post.getAuthor().getUsername(),
                        post.getAuthor().getDisplay_name(),
                        post.getAuthor().getAvatar_image_url(),
                        post.getAuthor().getIs_verified(),
                        post.getAuthor().getRole()
                ),
                post.getText(),
                post.getPostHashtags().stream()
                        .map(hashtagPost -> hashtagPost.getHashtags().getTag())
                        .collect(Collectors.toList()),
                post.getViews_count(),
                post.getRepost_count(),
                post.getLike_count(),
                post.getReply_count(),
                post.getCreatedAt().toString(),
                post.getUpdatedAt().toString());
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



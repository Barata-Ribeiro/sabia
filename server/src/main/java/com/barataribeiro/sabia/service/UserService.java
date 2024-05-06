package com.barataribeiro.sabia.service;

import com.barataribeiro.sabia.dto.post.PostResponseDTO;
import com.barataribeiro.sabia.dto.user.AuthorResponseDTO;
import com.barataribeiro.sabia.dto.user.ContextResponseDTO;
import com.barataribeiro.sabia.dto.user.ProfileRequestDTO;
import com.barataribeiro.sabia.dto.user.PublicProfileResponseDTO;
import com.barataribeiro.sabia.exceptions.others.BadRequest;
import com.barataribeiro.sabia.exceptions.others.ForbiddenRequest;
import com.barataribeiro.sabia.exceptions.others.InternalServerError;
import com.barataribeiro.sabia.exceptions.post.PostNotFound;
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
    public PublicProfileResponseDTO getPublicProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFound::new);

        return getPublicProfileResponseDTO(user);
    }

    @Cacheable(value = "users", key = "#userId")
    public Map<String, Object> searchUser(String query, int page, int perPage) {
        Pageable paging = PageRequest.of(page, perPage, Sort.by("createdAt").descending());

        String searchParams = query.startsWith("@") ? query.substring(1) : query;

        if (perPage < 1 || perPage > 15) throw new BadRequest("The number of items per page must be between 1 and 15.");
        if (query.isEmpty()) throw new BadRequest("You must provide a term to search for users.");
        if (query.length() < 3) throw new BadRequest("The search term must be at least 3 characters long.");

        Page<User> usersPage = userRepository.searchByQuery(searchParams, paging);

        if (usersPage.isEmpty()) throw new UserNotFound();

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

    @CacheEvict(value = "users", key = "#userId")
    public ContextResponseDTO getUserContext(String userId, String requesting_user) {
        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFound::new);

        if (!user.getUsername().equals(requesting_user)) {
            throw new ForbiddenRequest("You are not allowed to access this user's information.");
        }

        return getContextResponseDTO(user);
    }

    @Cacheable(value = "users", key = "#userId")
    public Map<String, Object> getUserFeed(String userId, int page, int perPage, String requesting_user) {
        Pageable paging = PageRequest.of(page, perPage);

        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFound::new);

        if (!user.getUsername().equals(requesting_user)) {
            throw new ForbiddenRequest("You are not allowed to access this user's feed.");
        }

        if (perPage < 1 || perPage > 20) throw new BadRequest("The number of items per page must be between 1 and 20.");

        List<User> followings = user.getFollowings().stream()
                .map(Follow::getFollowed)
                .collect(Collectors.toList());

        followings.add(user);

        Page<Post> postPage = postRepository.findByAuthorInOrderByCreatedAtDesc(followings, paging);
        if (postPage.isEmpty()) throw new PostNotFound();

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
    @CacheEvict(value = "users", key = "#userId")
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

    @Transactional
    public void followUser(String userId, String followedId, String requesting_user) {
        try {
            if (userId.equals(followedId)) {
                throw new SameUser("You cannot follow yourself.");
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(UserNotFound::new);

            User followedUser = userRepository.findById(followedId)
                    .orElseThrow(UserNotFound::new);

            if (!user.getUsername().equals(requesting_user)) {
                throw new ForbiddenRequest("You are not allowed to follow this user.");
            }

            var isAlreadyFollowing = user.getFollowings().stream().anyMatch(follow -> follow.getFollowed().getId().equals(followedId)) ||
                    followRepository.existsByFollowerIdAndFollowedId(userId, followedId);

            if (isAlreadyFollowing) {
                throw new BadRequest("You are already following this user.");
            }

            if (followedUser.getIs_private()) {
                throw new ForbiddenRequest("You are not allowed to follow this user.");
            }

            Follow newFollow = Follow.builder()
                    .follower(user)
                    .followed(followedUser)
                    .build();

            user.getFollowers().add(newFollow);
            user.incrementFollowerCount();

            followedUser.getFollowings().add(newFollow);
            followedUser.incrementFollowingCount();

            userRepository.save(user);
            userRepository.save(followedUser);
        } catch (Exception error) {
            System.err.println("An error occurred while following the user: " + error.getMessage());
            throw new InternalServerError("An error occurred while following the user. Please try again.");
        }
    }

    @Transactional
    public void unfollowUser(String userId, String followedId, String requesting_user) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(UserNotFound::new);

            User followedUser = userRepository.findById(followedId)
                    .orElseThrow(UserNotFound::new);

            if (!user.getUsername().equals(requesting_user)) {
                throw new ForbiddenRequest("You are not allowed to unfollow this user.");
            }

            var follow = user.getFollowings().stream()
                    .filter(f -> f.getFollowed().getId().equals(followedId))
                    .findFirst()
                    .orElseThrow(() -> new BadRequest("You are not following this user."));

            user.getFollowings().remove(follow);
            user.decrementFollowingCount();

            followedUser.getFollowers().remove(follow);
            followedUser.decrementFollowerCount();

            userRepository.save(user);
            userRepository.save(followedUser);
        } catch (Exception error) {
            System.err.println("An error occurred while unfollowing the user: " + error.getMessage());
            throw new InternalServerError("An error occurred while unfollowing the user. Please try again.");
        }
    }

    private Map<String, Object> validateInputData(ProfileRequestDTO body, User user) {
        if (body.password() != null && !body.password().isEmpty()) {
            if (!passwordEncoder.matches(body.password(), user.getPassword())) {
                throw new InvalidInput("The provided password is incorrect.");
            }

            if (body.new_password() != null && !body.new_password().isEmpty()) {
                if (validation.isPasswordValid(body.new_password())) {
                    throw new InvalidInput("The new password must contain at least one uppercase letter, " +
                                                   "one lowercase letter, one digit, " +
                                                   "one special character, " +
                                                   "and be at least 8 characters long.");
                }
            }

            Map<String, Object> sanitizedBody = sanitizeBody(body);

            if (userRepository.existsByUsername(sanitizedBody.get("username").toString())) {
                throw new InvalidInput("The provided username is already in use.");
            }

            if (userRepository.existsByEmail(sanitizedBody.get("email").toString())) {
                throw new InvalidInput("The provided email is already in use.");
            }

            if (validation.isEmailValid(sanitizedBody.get("email").toString())) {
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

            if (body.new_password() != null && !body.new_password().isEmpty()) {
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
                post.getViews(),
                post.getRepost_count(),
                post.getLike_count(),
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



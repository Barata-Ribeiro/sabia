package com.barataribeiro.sabia.service;

import com.barataribeiro.sabia.dto.post.PostRequestDTO;
import com.barataribeiro.sabia.dto.post.PostResponseDTO;
import com.barataribeiro.sabia.dto.user.AuthorResponseDTO;
import com.barataribeiro.sabia.exceptions.others.BadRequest;
import com.barataribeiro.sabia.exceptions.others.ForbiddenRequest;
import com.barataribeiro.sabia.exceptions.post.PostInvalidBody;
import com.barataribeiro.sabia.exceptions.post.PostNotFound;
import com.barataribeiro.sabia.exceptions.user.UserNotFound;
import com.barataribeiro.sabia.model.*;
import com.barataribeiro.sabia.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private HashtagRepository hashtagRepository;

    @Autowired
    private HashtagPostsRepository hashtagPostsRepository;

    @Cacheable(value = "posts", key = "{#userId, #page, #perPage}")
    public Map<String, Object> getAllPosts(String userId, int page, int perPage) {
        Pageable paging = PageRequest.of(page, perPage, Sort.by("createdAt").descending());

        if (perPage < 1 || perPage > 15) throw new BadRequest("The number of items per page must be between 1 and 15.");

        Page<Post> postPage = postRepository.findAllByAuthorId(userId, paging);
        if (postPage.isEmpty()) throw new PostNotFound();

        List<Post> posts = new ArrayList<>(postPage.getContent());

        List<PostResponseDTO> postsDTOs = posts.stream()
                .map(PostService::getPostResponseDTO)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("posts", postsDTOs);
        response.put("current_page", postPage.getNumber());
        response.put("total_items", postPage.getTotalElements());
        response.put("total_pages", postPage.getTotalPages());

        return response;
    }

    @Cacheable(value = "posts", key = "#postId")
    public PostResponseDTO getPostById(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(PostNotFound::new);

        return getPostResponseDTO(post);
    }

    @Cacheable(value = "posts", key = "{#query, #page, #perPage}")
    public Map<String, Object> searchPosts(String query, int page, int perPage) {
        Pageable paging = PageRequest.of(page, perPage, Sort.by("createdAt").descending());
        String queryParams = query.startsWith("#") ? query.substring(1) : query;

        if (perPage < 1 || perPage > 15) throw new BadRequest("The number of items per page must be between 1 and 15.");
        if (query.isEmpty()) throw new BadRequest("You must provide a term to search for users.");
        if (query.length() < 3) throw new BadRequest("The search term must be at least 3 characters long.");

        Page<Post> postPage = query.startsWith("#") ?
                              postRepository.findAllByHashtag(queryParams, paging) :
                              postRepository.findAllByTextContaining(queryParams, paging);

        if (postPage.isEmpty()) throw new PostNotFound();

        List<Post> postsResult = new ArrayList<>(postPage.getContent());

        List<PostResponseDTO> postsDTOs = postsResult.stream()
                .map(PostService::getPostResponseDTO)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("posts", postsDTOs);
        response.put("current_page", postPage.getNumber());
        response.put("total_items", postPage.getTotalElements());
        response.put("total_pages", postPage.getTotalPages());

        return response;
    }

    @Transactional
    @CacheEvict(value = "posts", allEntries = true)
    public PostResponseDTO createPost(PostRequestDTO body, String requesting_user) {
        User author = userRepository.findByUsername(requesting_user)
                .orElseThrow(UserNotFound::new);

        var text = body.text().trim();

        if (text.isEmpty()) throw new PostInvalidBody("Text cannot be empty.");
        if (text.length() > 280) throw new PostInvalidBody("Text cannot exceed 280 characters.");

        Pattern pattern = Pattern.compile("#\\w+");
        Matcher matcher = pattern.matcher(text);

        Post post = Post.builder()
                .author(author)
                .text(text)
                .build();

        postRepository.save(post);

        while (matcher.find()) {
            String hashtagText = matcher.group().substring(1);
            Hashtag hashtag = hashtagRepository.findByTag(hashtagText)
                    .orElseGet(() -> {
                        Hashtag newHashtag = Hashtag.builder()
                                .tag(hashtagText)
                                .build();

                        return hashtagRepository.save(newHashtag);
                    });

            HashtagPosts hashtagPost = HashtagPosts.builder()
                    .hashtags(hashtag)
                    .posts(post)
                    .build();

            hashtagPostsRepository.save(hashtagPost);

            post.setPostHashtags(List.of(hashtagPost));
        }

        postRepository.save(post);

        return getPostResponseDTO(post);
    }

    @Transactional
    @CacheEvict(value = "posts", allEntries = true)
    public void deletePost(String postId, String requesting_user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(PostNotFound::new);

        if (!post.getAuthor().getUsername().equals(requesting_user)) {
            throw new ForbiddenRequest("You are not the author of this post.");
        }

        postRepository.delete(post);
    }

    @Transactional
    public Boolean toggleLike(String postId, String requesting_user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(PostNotFound::new);

        User user = userRepository.findByUsername(requesting_user)
                .orElseThrow(UserNotFound::new);

        if (post.getAuthor().getUsername().equals(user.getUsername())) {
            throw new ForbiddenRequest("You cannot like your own post.");
        }

        Like like = likeRepository.findByUserIdAndPostId(user.getId(), post.getId()).orElse(null);
        if (like != null) {
            likeRepository.delete(like);
            post.decrementLikeCount();
            postRepository.save(post);

            return false;
        } else {
            Like newLike = Like.builder()
                    .user(user)
                    .post(post)
                    .build();

            likeRepository.save(newLike);
            post.incrementLikeCount();
            postRepository.save(post);

            return true;
        }
    }

    private static PostResponseDTO getPostResponseDTO(Post post) {
        User author = post.getAuthor();
        AuthorResponseDTO authorDTO = new AuthorResponseDTO(
                author.getId(),
                author.getUsername(),
                author.getDisplay_name(),
                author.getAvatar_image_url(),
                author.getIs_verified(),
                author.getRole()
        );

        List<String> hashtags = post.getPostHashtags().stream()
                .map(hashtagPost -> hashtagPost.getHashtags().getTag())
                .collect(Collectors.toList());

        return new PostResponseDTO(
                post.getId(),
                authorDTO,
                post.getText(),
                hashtags,
                post.getViews(),
                post.getRepost_count(),
                post.getLike_count(),
                post.getCreatedAt().toString(),
                post.getUpdatedAt().toString()
        );
    }
}

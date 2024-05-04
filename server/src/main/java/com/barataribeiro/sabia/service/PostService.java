package com.barataribeiro.sabia.service;

import com.barataribeiro.sabia.dto.post.PostRequestDTO;
import com.barataribeiro.sabia.dto.post.PostResponseDTO;
import com.barataribeiro.sabia.dto.user.AuthorResponseDTO;
import com.barataribeiro.sabia.exceptions.others.ForbiddenRequest;
import com.barataribeiro.sabia.exceptions.post.PostInvalidBody;
import com.barataribeiro.sabia.exceptions.post.PostNotFound;
import com.barataribeiro.sabia.exceptions.user.UserNotFound;
import com.barataribeiro.sabia.model.Hashtag;
import com.barataribeiro.sabia.model.Like;
import com.barataribeiro.sabia.model.Post;
import com.barataribeiro.sabia.model.User;
import com.barataribeiro.sabia.repository.HashtagRepository;
import com.barataribeiro.sabia.repository.LikeRepository;
import com.barataribeiro.sabia.repository.PostRepository;
import com.barataribeiro.sabia.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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


    public Map<String, Object> getAllPosts(String userId, int page, int perPage) {
        Pageable paging = PageRequest.of(page, perPage);

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

    public PostResponseDTO getPostById(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(PostNotFound::new);

        return getPostResponseDTO(post);
    }

    public Map<String, Object> searchPostsByHashtag(String hashtag, int page, int perPage) {
        Pageable paging = PageRequest.of(page, perPage);
        String tag = hashtag.startsWith("#") ? hashtag.substring(1) : hashtag;

        Page<Post> postPage = postRepository.findAllByHashtag(tag, paging);
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

    @Transactional
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

        while (matcher.find()) {
            String tag = matcher.group().substring(1);

            Hashtag hashtag = hashtagRepository.findByTag(tag).orElseGet(() -> {
                Hashtag newHashtag = Hashtag.builder()
                        .tag(tag)
                        .build();

                return hashtagRepository.save(newHashtag);
            });

            post.getPost_hashtags().add(hashtag);
        }

        postRepository.save(post);

        return getPostResponseDTO(post);
    }

    @Transactional
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

        return new PostResponseDTO(
                post.getId(),
                authorDTO,
                post.getText(),
                post.getViews(),
                post.getRepost_count(),
                post.getLike_count(),
                post.getCreated_at().toString(),
                post.getUpdated_at().toString()
        );
    }
}

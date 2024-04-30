package com.barataribeiro.sabia.service.post;

import com.barataribeiro.sabia.dto.post.PostRequestDTO;
import com.barataribeiro.sabia.dto.post.PostResponseDTO;
import com.barataribeiro.sabia.dto.user.AuthorResponseDTO;
import com.barataribeiro.sabia.exceptions.post.PostInvalidBody;
import com.barataribeiro.sabia.exceptions.post.PostNotFound;
import com.barataribeiro.sabia.exceptions.user.UserNotFound;
import com.barataribeiro.sabia.model.Post;
import com.barataribeiro.sabia.model.User;
import com.barataribeiro.sabia.repository.PostRepository;
import com.barataribeiro.sabia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public Map<String, Object> getAllPosts(String userId, int page, int perPage) {
        Pageable paging = PageRequest.of(page, perPage);

        Page<Post> postPage = postRepository.findAllByAuthorId(userId, paging);
        if (postPage.isEmpty()) throw new PostNotFound("No posts found.");

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
                .orElseThrow(() -> new PostNotFound("Post not found."));

        return getPostResponseDTO(post);
    }

    public PostResponseDTO createPost(PostRequestDTO body, String requesting_user) {
        User author = userRepository.findByUsername(requesting_user)
                .orElseThrow(UserNotFound::new);

        var text = body.text().trim();

        if (text.isEmpty()) throw new PostInvalidBody("Text cannot be empty.");
        if (text.length() > 280) throw new PostInvalidBody("Text cannot exceed 280 characters.");

        Post post = Post.builder()
                .author(author)
                .text(text)
                .build();

        postRepository.save(post);

        return getPostResponseDTO(post);
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

package com.barataribeiro.sabia.service.post;

import com.barataribeiro.sabia.dto.post.PostResponseDTO;
import com.barataribeiro.sabia.dto.user.AuthorResponseDTO;
import com.barataribeiro.sabia.exceptions.post.PostNotFound;
import com.barataribeiro.sabia.model.Post;
import com.barataribeiro.sabia.model.User;
import com.barataribeiro.sabia.repository.PostRepository;
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
    private final PostRepository postRepository;

    public Map<String, Object> getAllPosts(String userId, int page, int perPage) {
        Pageable paging = PageRequest.of(page, perPage);

        Page<Post> postPage = postRepository.findAllByAuthorId(userId, paging);
        if (postPage.isEmpty()) throw new PostNotFound("No posts found.");

        List<Post> posts = new ArrayList<>(postPage.getContent());

        List<PostResponseDTO> postsDTOs = posts.stream()
                .map(post -> {
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
                })
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

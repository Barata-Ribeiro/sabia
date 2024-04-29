package com.barataribeiro.sabia.service.post;

import com.barataribeiro.sabia.exceptions.post.PostNotFound;
import com.barataribeiro.sabia.model.Post;
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

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    public Map<String, Object> getAllPosts(String userId, int page, int perPage) {
        Pageable paging = PageRequest.of(page, perPage);

        Page<Post> postPage = postRepository.findAllByAuthorId(userId, paging);
        if(postPage.isEmpty()) throw new PostNotFound("No posts found.");

        List<Post> posts = new ArrayList<>(postPage.getContent());

        Map<String, Object> response = new HashMap<>();
        response.put("posts", posts);
        response.put("current_page", postPage.getNumber());
        response.put("total_items", postPage.getTotalElements());
        response.put("total_pages", postPage.getTotalPages());

        return response;
    }

    public Post getPostById(String postId) {
        return postRepository.findById(postId).orElseThrow(() -> new PostNotFound("Post not found."));
    }
}

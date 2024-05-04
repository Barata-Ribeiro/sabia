package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.RestSuccessResponseDTO;
import com.barataribeiro.sabia.dto.post.PostRequestDTO;
import com.barataribeiro.sabia.dto.post.PostResponseDTO;
import com.barataribeiro.sabia.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {
    @Autowired
    private PostService postService;

    @GetMapping("/public")
    public ResponseEntity getAllPostsFromUser(@RequestParam String userId,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "6") int perPage) {
        Map<String, Object> data = postService.getAllPosts(userId, page, perPage);

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "Posts retrieved successfully.",
                                                              data));
    }

    @GetMapping("/public/{postId}")
    public ResponseEntity getPostById(@PathVariable String postId) {
        PostResponseDTO data = postService.getPostById(postId);

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "Post retrieved successfully.",
                                                              data));
    }

    @GetMapping("/public/search")
    public ResponseEntity searchPostsByHashtag(@RequestParam String hashtag,
                                               @RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "10") int perPage) {
        Map<String, Object> data = postService.searchPostsByHashtag(hashtag, page, perPage);

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "Posts retrieved successfully.",
                                                              data));
    }

    @PostMapping("/me/new-post")
    public ResponseEntity createPost(@RequestBody PostRequestDTO body, Principal principal) {
        PostResponseDTO data = postService.createPost(body, principal.getName());

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.CREATED,
                                                              HttpStatus.CREATED.value(),
                                                              "Post created successfully.",
                                                              data));
    }

    @DeleteMapping("/me/{postId}")
    public ResponseEntity deletePost(@PathVariable String postId, Principal principal) {
        postService.deletePost(postId, principal.getName());

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.NO_CONTENT,
                                                              HttpStatus.NO_CONTENT.value(),
                                                              "Post deleted successfully.",
                                                              null));
    }

    @PostMapping("/me/{postId}/toggle-like")
    public ResponseEntity toggleLike(@PathVariable String postId, Principal principal) {
        Boolean response = postService.toggleLike(postId, principal.getName());

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "Post " + (response ? "liked" : "disliked") + " successfully.",
                                                              null));
    }
}

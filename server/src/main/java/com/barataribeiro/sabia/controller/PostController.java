package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.RestSuccessResponseDTO;
import com.barataribeiro.sabia.dto.post.PostRequestDTO;
import com.barataribeiro.sabia.dto.post.PostResponseDTO;
import com.barataribeiro.sabia.service.post.PostService;
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

    @GetMapping("/")
    public ResponseEntity getAllPostsFromUser(@RequestParam String userId,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "6") int perPage) {
        Map<String, Object> data = postService.getAllPosts(userId, page, perPage);

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User logged in successfully.",
                                                              data));
    }

    @GetMapping("/{postId}")
    public ResponseEntity getPostById(@PathVariable String postId) {
        PostResponseDTO data = postService.getPostById(postId);

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User logged in successfully.",
                                                              data));
    }

    @PostMapping("/")
    public ResponseEntity createPost(@RequestBody PostRequestDTO body, Principal principal) {
        String requesting_user = principal.getName();

        PostResponseDTO data = postService.createPost(body, requesting_user);

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User logged in successfully.",
                                                              data));
    }
}

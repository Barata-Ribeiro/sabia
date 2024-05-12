package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.RestSuccessResponseDTO;
import com.barataribeiro.sabia.dto.post.PostRequestDTO;
import com.barataribeiro.sabia.dto.post.PostResponseDTO;
import com.barataribeiro.sabia.model.Post;
import com.barataribeiro.sabia.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
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
                                              @RequestParam(defaultValue = "6") int perPage,
                                              @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language) {
        Map<String, Object> data = postService.getAllPosts(userId, page, perPage, language);

        String message = language == null || language.equals("en")
                         ? "Posts retrieved successfully."
                         : "Posts recuperados com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              data));
    }

    @GetMapping("/public/{postId}")
    public ResponseEntity getPostById(@PathVariable String postId,
                                      @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language) {
        PostResponseDTO data = postService.getPostById(postId, language);

        String message = language == null || language.equals("en")
                         ? "Post retrieved successfully."
                         : "Post recuperado com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              data));
    }

    @GetMapping("/public/{postId}/replies")
    public ResponseEntity getReplies(@PathVariable String postId,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int perPage,
                                     @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language) {
        Map<String, Object> data = postService.getPostReplies(postId, page, perPage, language);

        String message = language == null || language.equals("en")
                         ? "Replies retrieved successfully."
                         : "Respostas recuperadas com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              data));
    }

    @GetMapping("/public/search")
    public ResponseEntity searchPosts(@RequestParam String q,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int perPage,
                                      @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language) {
        Map<String, Object> data = postService.searchPosts(q, page, perPage, language);

        String message = language == null || language.equals("en")
                         ? "Posts retrieved successfully."
                         : "Posts recuperados com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              data));
    }

    @PostMapping("/me/new-post")
    public ResponseEntity createPost(@RequestBody PostRequestDTO body,
                                     @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                     Principal principal) {
        PostResponseDTO data = postService.createPost(body, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Post created successfully."
                         : "Post criado com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.CREATED,
                                                              HttpStatus.CREATED.value(),
                                                              message,
                                                              data));
    }

    @PostMapping("/me/{postId}/repost")
    public ResponseEntity repost(@PathVariable String postId,
                                 @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                 Principal principal) {
        Post data = postService.repost(postId, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Post reposted successfully."
                         : "Post repostado com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.CREATED,
                                                              HttpStatus.CREATED.value(),
                                                              message,
                                                              data));
    }

    @PostMapping("/me/{postId}/reply")
    public ResponseEntity reply(@PathVariable String postId,
                                @RequestBody PostRequestDTO body,
                                @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                Principal principal) {
        PostResponseDTO data = postService.replyToPost(postId, body, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Post replied successfully."
                         : "Post respondido com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.CREATED,
                                                              HttpStatus.CREATED.value(),
                                                              message,
                                                              data));
    }

    @DeleteMapping("/me/{postId}")
    public ResponseEntity deletePost(@PathVariable String postId,
                                     @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                     Principal principal) {
        postService.deletePost(postId, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Post deleted successfully."
                         : "Post deletado com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.NO_CONTENT,
                                                              HttpStatus.NO_CONTENT.value(),
                                                              message,
                                                              null));
    }

    @PostMapping("/me/{postId}/toggle-like")
    public ResponseEntity toggleLike(@PathVariable String postId,
                                     @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                     Principal principal) {
        Boolean response = postService.toggleLike(postId, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Post " + (response ? "liked" : "disliked") + " successfully."
                         : "Post " + (response ? "curtido" : "descurtido") + " com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              null));
    }
}

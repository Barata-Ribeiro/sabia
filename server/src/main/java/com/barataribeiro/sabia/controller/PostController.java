package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.RestSuccessResponseDTO;
import com.barataribeiro.sabia.dto.post.PostRequestDTO;
import com.barataribeiro.sabia.dto.post.PostResponseDTO;
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
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class PostController {
    private final PostService postService;

    @GetMapping("/public")
    public ResponseEntity<RestSuccessResponseDTO<Map<String, Object>>> getAllPostsFromUser(@RequestParam String userId,
                                                                                           @RequestParam(defaultValue = "0") int page,
                                                                                           @RequestParam(defaultValue = "6") int perPage,
                                                                                           @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                                                           Principal principal) {
        Map<String, Object> data = postService.getAllPosts(userId, page, perPage, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Posts retrieved successfully."
                         : "Posts recuperados com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              data));
    }

    @GetMapping("/public/{postId}")
    public ResponseEntity<RestSuccessResponseDTO<PostResponseDTO>> getPostById(@PathVariable String postId,
                                                                               @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                                               Principal principal) {
        PostResponseDTO data = postService.getPostById(postId, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Post retrieved successfully."
                         : "Post recuperado com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              data));
    }

    @GetMapping("/public/{postId}/replies")
    public ResponseEntity<RestSuccessResponseDTO<Map<String, Object>>> getReplies(@PathVariable String postId,
                                                                                  @RequestParam(defaultValue = "0") int page,
                                                                                  @RequestParam(defaultValue = "10") int perPage,
                                                                                  @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                                                  Principal principal) {
        Map<String, Object> data = postService.getPostReplies(postId, page, perPage, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Replies retrieved successfully."
                         : "Respostas recuperadas com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              data));
    }

    @GetMapping("/public/search")
    public ResponseEntity<RestSuccessResponseDTO<Map<String, Object>>> searchPosts(@RequestParam String q,
                                                                                   @RequestParam(defaultValue = "0") int page,
                                                                                   @RequestParam(defaultValue = "10") int perPage,
                                                                                   @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                                                   Principal principal) {
        Map<String, Object> data = postService.searchPosts(q, page, perPage, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Posts retrieved successfully."
                         : "Posts recuperados com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              data));
    }

    @GetMapping("/public/hashtag/{hashtag}")
    public ResponseEntity<RestSuccessResponseDTO<Map<String, Object>>> getPostsByHashtag(@PathVariable String hashtag,
                                                                                         @RequestParam(defaultValue = "0") int page,
                                                                                         @RequestParam(defaultValue = "10") int perPage,
                                                                                         @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                                                         Principal principal) {
        Map<String, Object> data = postService.getPostsByHashtag(hashtag, page, perPage, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Posts retrieved successfully."
                         : "Posts recuperados com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              data));
    }

    @GetMapping("/public/trending")
    public ResponseEntity<RestSuccessResponseDTO<Map<String, Object>>> getTrendingHashtags(@RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                                                           Principal principal) {
        Map<String, Object> data = postService.getTrendingHashtags();

        String message = language == null || language.equals("en")
                         ? "Trending hashtags retrieved successfully."
                         : "Hashtags em alta recuperadas com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              data));
    }

    @PostMapping("/me/new-post")
    public ResponseEntity<RestSuccessResponseDTO<PostResponseDTO>> createPost(@RequestBody PostRequestDTO body,
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

    @PostMapping("/me/{postId}/reply")
    public ResponseEntity<RestSuccessResponseDTO<PostResponseDTO>> reply(@PathVariable String postId,
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

    @PostMapping("/me/{postId}/repost")
    public ResponseEntity<RestSuccessResponseDTO<PostResponseDTO>> repost(@PathVariable String postId,
                                                                          @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                                          Principal principal) {
        PostResponseDTO data = postService.repost(postId, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Post reposted successfully."
                         : "Post repostado com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.CREATED,
                                                              HttpStatus.CREATED.value(),
                                                              message,
                                                              data));
    }

    @DeleteMapping("/me/{postId}")
    public ResponseEntity<RestSuccessResponseDTO<?>> deletePost(@PathVariable String postId,
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
    public ResponseEntity<RestSuccessResponseDTO<?>> toggleLike(@PathVariable String postId,
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

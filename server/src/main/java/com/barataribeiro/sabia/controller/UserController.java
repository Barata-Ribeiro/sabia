package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.RestSuccessResponseDTO;
import com.barataribeiro.sabia.dto.user.ContextResponseDTO;
import com.barataribeiro.sabia.dto.user.ProfileRequestDTO;
import com.barataribeiro.sabia.dto.user.PublicProfileResponseDTO;
import com.barataribeiro.sabia.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserController {
    private final UserService userService;

    @GetMapping("/public/{userId}")
    public ResponseEntity<RestSuccessResponseDTO<PublicProfileResponseDTO>> getPublicUser(@PathVariable String userId,
                                                                                          @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language) {
        PublicProfileResponseDTO user = userService.getPublicProfile(userId, language);

        String message = language == null || language.equals("en")
                         ? "User retrieved successfully."
                         : "Usuário recuperado com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              user));
    }

    @GetMapping(value = "/public/{userId}/followers", produces = {MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<RestSuccessResponseDTO<Map<String, Object>>> getFollowers(@PathVariable String userId,
                                                                                    @RequestParam(defaultValue = "0") int page,
                                                                                    @RequestParam(defaultValue = "10") int perPage,
                                                                                    @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language) {
        Map<String, Object> data = userService.getFollowers(userId, page, perPage);

        String message = language == null || language.equals("en")
                         ? "Followers retrieved successfully."
                         : "Seguidores recuperados com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              data));
    }

    @GetMapping("/public/search")
    public ResponseEntity<RestSuccessResponseDTO<Map<String, Object>>> searchUser(@RequestParam String q,
                                                                                  @RequestParam(defaultValue = "0") int page,
                                                                                  @RequestParam(defaultValue = "10") int perPage,
                                                                                  @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language) {
        Map<String, Object> data = userService.searchUser(q, page, perPage, language);

        String message = language == null || language.equals("en")
                         ? "Users retrieved successfully."
                         : "Usuários recuperados com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              data));
    }

    @GetMapping("/me")
    public ResponseEntity<RestSuccessResponseDTO<ContextResponseDTO>> getUser(@RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                                              Principal principal) {
        ContextResponseDTO user = userService.getUserContext(principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Context retrieved successfully."
                         : "Contexto recuperado com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              user));
    }

    @GetMapping("/me/{userId}/feed")
    public ResponseEntity<RestSuccessResponseDTO<Map<String, Object>>> getUserFeed(@PathVariable String userId,
                                                                                   @RequestParam(defaultValue = "0") int page,
                                                                                   @RequestParam(defaultValue = "10") int perPage,
                                                                                   @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                                                   Principal principal) {
        Map<String, Object> data = userService.getUserFeed(userId,
                                                           page,
                                                           perPage,
                                                           principal.getName(),
                                                           language);

        String message = language == null || language.equals("en")
                         ? "User feed retrieved successfully."
                         : "Feed do usuário recuperado com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              data));
    }

    @PutMapping("/me/{userId}")
    public ResponseEntity<RestSuccessResponseDTO<ContextResponseDTO>> updateUser(@PathVariable String userId,
                                                                                 @RequestBody ProfileRequestDTO body,
                                                                                 @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                                                 Principal principal) {
        ContextResponseDTO user = userService.updateOwnAccount(userId, principal.getName(), body, language);

        String message = language == null || language.equals("en")
                         ? "Account updated successfully."
                         : "Conta atualizada com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              user));
    }

    @DeleteMapping("/me/{userId}")
    public ResponseEntity<RestSuccessResponseDTO<?>> deleteUser(@PathVariable String userId,
                                                                @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                                Principal principal) {
        userService.deleteOwnAccount(userId, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Account deleted successfully."
                         : "Conta deletada com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              null));
    }

    @PostMapping("/me/{userId}/follow/{followedId}")
    public ResponseEntity<RestSuccessResponseDTO<?>> followUser(@PathVariable String userId,
                                                                @PathVariable String followedId,
                                                                @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                                Principal principal) {
        userService.followUser(userId, followedId, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "User followed successfully."
                         : "Usuário seguido com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              null));
    }

    @DeleteMapping("/me/{userId}/follow/{followedId}")
    public ResponseEntity<RestSuccessResponseDTO<?>> unfollowUser(@PathVariable String userId,
                                                                  @PathVariable String followedId,
                                                                  @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                                  Principal principal) {
        userService.unfollowUser(userId, followedId, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "User unfollowed successfully."
                         : "Deixou de seguir o usuário com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              null));
    }
}

package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.RestResponseDTO;
import com.barataribeiro.sabia.dto.user.ProfileRequestDTO;
import com.barataribeiro.sabia.dto.user.PublicProfileResponseDTO;
import com.barataribeiro.sabia.dto.user.UserDTO;
import com.barataribeiro.sabia.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserController {
    private final UserService userService;

    @GetMapping("/public/recommendations")
    public ResponseEntity<RestResponseDTO> getUserRecommendations(@RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                                  Principal principal) {
        Map<String, Object> data = userService.getUserRecommendations(principal.getName());

        String message = language == null || language.equals("en")
                         ? "Recommendations retrieved successfully."
                         : "Recomendações recuperadas com sucesso.";

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     message,
                                                     data));
    }


    @GetMapping("/public/{username}")
    public ResponseEntity<RestResponseDTO> getPublicUser(@PathVariable String username,
                                                         @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                         Principal principal) {
        PublicProfileResponseDTO user = userService.getPublicProfile(username, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "User retrieved successfully."
                         : "Usuário recuperado com sucesso.";

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     message,
                                                     user));
    }

    @GetMapping(value = "/public/{userId}/feed")
    public ResponseEntity<RestResponseDTO> getPublicFeed(@PathVariable String userId,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "20") int perPage,
                                                         @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                         Principal principal) {
        Map<String, Object> data = userService.getUserPublicFeed(userId, page, perPage, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "User feed retrieved successfully."
                         : "Feed do usuário recuperado com sucesso.";

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     message,
                                                     data));
    }

    @GetMapping(value = "/public/{username}/followers")
    public ResponseEntity<RestResponseDTO> getFollowers(@PathVariable String username,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int perPage,
                                                        @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                        Principal principal) {
        Map<String, Object> data = userService.getFollowers(username, page, perPage, principal.getName());

        String message = language == null || language.equals("en")
                         ? "Followers retrieved successfully."
                         : "Seguidores recuperados com sucesso.";

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     message,
                                                     data));
    }

    @GetMapping("/public/search")
    public ResponseEntity<RestResponseDTO> searchUser(@RequestParam String q,
                                                      @RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "15") int perPage,
                                                      @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                      Principal principal) {
        Map<String, Object> data = userService.searchUser(q, page, perPage, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Users retrieved successfully."
                         : "Usuários recuperados com sucesso.";

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     message,
                                                     data));
    }

    @GetMapping("/me")
    public ResponseEntity<RestResponseDTO> getUser(@RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                   Principal principal) {
        UserDTO user = userService.getUserContext(principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Context retrieved successfully."
                         : "Contexto recuperado com sucesso.";

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     message,
                                                     user));
    }

    @GetMapping("/me/{userId}/feed")
    public ResponseEntity<RestResponseDTO> getUserFeed(@PathVariable String userId,
                                                       @RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "20") int perPage,
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

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     message,
                                                     data));
    }

    @PutMapping("/me/{userId}")
    public ResponseEntity<RestResponseDTO> updateUser(@PathVariable String userId,
                                                      @RequestBody ProfileRequestDTO body,
                                                      @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                      Principal principal) {
        UserDTO user = userService.updateOwnAccount(userId, principal.getName(), body, language);

        String message = language == null || language.equals("en")
                         ? "Account updated successfully."
                         : "Conta atualizada com sucesso.";

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     message,
                                                     user));
    }

    @DeleteMapping("/me/{userId}")
    public ResponseEntity<RestResponseDTO> deleteUser(@PathVariable String userId,
                                                      @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                      Principal principal) {
        userService.deleteOwnAccount(userId, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Account deleted successfully."
                         : "Conta deletada com sucesso.";

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     message,
                                                     null));
    }

    @PostMapping("/me/{userId}/follow/{followedId}")
    public ResponseEntity<RestResponseDTO> followUser(@PathVariable String userId,
                                                      @PathVariable String followedId,
                                                      @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                      Principal principal) {
        userService.followUser(userId, followedId, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "User followed successfully."
                         : "Usuário seguido com sucesso.";

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     message,
                                                     null));
    }

    @DeleteMapping("/me/{userId}/follow/{followedId}")
    public ResponseEntity<RestResponseDTO> unfollowUser(@PathVariable String userId,
                                                        @PathVariable String followedId,
                                                        @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                        Principal principal) {
        userService.unfollowUser(userId, followedId, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "User unfollowed successfully."
                         : "Deixou de seguir o usuário com sucesso.";

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     message,
                                                     null));
    }
}

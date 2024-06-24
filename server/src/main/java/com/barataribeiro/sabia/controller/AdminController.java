package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.RestResponseDTO;
import com.barataribeiro.sabia.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AdminController {
    private final AdminService adminService;

    @PutMapping("/users/{userId}/toggle-verify")
    public ResponseEntity<RestResponseDTO> toggleVerifyUser(@PathVariable String userId,
                                                            @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                            Principal principal) {
        Boolean response = adminService.toggleVerifyUser(userId, principal.getName(), language);

        String isVerifiedEng = Boolean.TRUE.equals(response) ? "verified" : "unverified";
        String isVerifiedBr = Boolean.TRUE.equals(response) ? "verificado" : "não verificado";
        String message = language == null || language.equals("en")
                         ? "User " + isVerifiedEng + " successfully."
                         : "Usuário " + isVerifiedBr + " com sucesso.";

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     message,
                                                     null));
    }

    @PutMapping("/users/{userId}/toggle-ban")
    public ResponseEntity<RestResponseDTO> banUser(@PathVariable String userId,
                                                   @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                   Principal principal) {
        Boolean response = adminService.toggleUserBan(userId, principal.getName(), language);

        String isBannedEng = Boolean.TRUE.equals(response) ? "banned" : "unbanned";
        String isBannedBr = Boolean.TRUE.equals(response) ? "banido" : "desbanido";
        String message = language == null || language.equals("en")
                         ? "User " + isBannedEng + " successfully."
                         : "Usuário " + isBannedBr + " com sucesso.";

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     message,
                                                     null));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<RestResponseDTO> deleteUser(@PathVariable String userId,
                                                      @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                      Principal principal) {
        adminService.deleteUser(userId, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "User deleted successfully."
                         : "Usuário deletado com sucesso.";

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     message,
                                                     null));
    }


    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<RestResponseDTO> deletePost(@PathVariable String postId,
                                                      @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language,
                                                      Principal principal) {
        adminService.deletePost(postId, principal.getName(), language);

        String message = language == null || language.equals("en")
                         ? "Post deleted successfully."
                         : "Post deletado com sucesso.";

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     message,
                                                     null));
    }

}

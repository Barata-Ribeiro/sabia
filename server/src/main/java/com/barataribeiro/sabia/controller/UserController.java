package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.RestSuccessResponseDTO;
import com.barataribeiro.sabia.dto.user.ContextResponseDTO;
import com.barataribeiro.sabia.dto.user.ProfileRequestDTO;
import com.barataribeiro.sabia.dto.user.PublicProfileResponseDTO;
import com.barataribeiro.sabia.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/public/{userId}")
    public ResponseEntity getPublicUser(@PathVariable String userId) {
        PublicProfileResponseDTO user = userService.getPublicProfile(userId);

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User retrieved successfully.",
                                                              user));
    }

    @GetMapping("/public/{userId}/followers")
    public ResponseEntity getFollowers(@PathVariable String userId,
                                       @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int perPage) {
        Map<String, Object> data = userService.getFollowers(userId, page, perPage);

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "Followers retrieved successfully.",
                                                              data));
    }

    @GetMapping("/public/search")
    public ResponseEntity searchUser(@RequestParam String q,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int perPage) {
        Map<String, Object> data = userService.searchUser(q, page, perPage);

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "Users retrieved successfully.",
                                                              data));
    }

    @GetMapping("/me/{userId}")
    public ResponseEntity getUser(@PathVariable String userId, Principal principal) {
        ContextResponseDTO user = userService.getUserContext(userId, principal.getName());

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User retrieved successfully.",
                                                              user));
    }

    @GetMapping("/me/{userId}/feed")
    public ResponseEntity getUserFeed(@PathVariable String userId,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int perPage,
                                      Principal principal) {
        Map<String, Object> data = userService.getUserFeed(userId,
                                                           page,
                                                           perPage,
                                                           principal.getName());

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User feed retrieved successfully.",
                                                              data));
    }

    @PutMapping("/me/{userId}")
    public ResponseEntity updateUser(@PathVariable String userId, @RequestBody ProfileRequestDTO body, Principal principal) {
        ContextResponseDTO user = userService.updateOwnAccount(userId, principal.getName(), body);

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User updated successfully.",
                                                              user));
    }

    @DeleteMapping("/me/{userId}")
    public ResponseEntity deleteUser(@PathVariable String userId, Principal principal) {
        userService.deleteOwnAccount(userId, principal.getName());

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User deleted successfully.",
                                                              null));
    }

    @PostMapping("/me/{userId}/follow/{followedId}")
    public ResponseEntity followUser(@PathVariable String userId, @PathVariable String followedId, Principal principal) {
        userService.followUser(userId, followedId, principal.getName());

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User followed successfully.",
                                                              null));
    }

    @DeleteMapping("/me/{userId}/follow/{followedId}")
    public ResponseEntity unfollowUser(@PathVariable String userId, @PathVariable String followedId, Principal principal) {
        userService.unfollowUser(userId, followedId, principal.getName());

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User unfollowed successfully.",
                                                              null));
    }
}

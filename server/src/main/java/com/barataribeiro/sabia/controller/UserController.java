package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.RestSuccessResponseDTO;
import com.barataribeiro.sabia.dto.user.ContextResponseDTO;
import com.barataribeiro.sabia.dto.user.ProfileRequestDTO;
import com.barataribeiro.sabia.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/me/{userId}")
    public ResponseEntity getUser(@PathVariable String userId, Principal principal) {
        String requesting_user = principal.getName();
        ContextResponseDTO user = userService.getUserContext(userId, requesting_user);

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User retrieved successfully.",
                                                              user));
    }

    @PutMapping("/me/{userId}")
    public ResponseEntity updateUser(@PathVariable String userId, @RequestBody ProfileRequestDTO body, Principal principal) {
        String requesting_user = principal.getName();
        ContextResponseDTO user = userService.updateOwnAccount(userId, requesting_user, body);

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User updated successfully.",
                                                              user));
    }

    @DeleteMapping("/me/{userId}")
    public ResponseEntity deleteUser(@PathVariable String userId, Principal principal) {
        String requesting_user = principal.getName();
        userService.deleteOwnAccount(userId, requesting_user);

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User deleted successfully.",
                                                              null));
    }
}

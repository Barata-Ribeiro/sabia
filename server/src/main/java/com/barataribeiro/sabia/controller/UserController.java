package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.RestSuccessResponseDTO;
import com.barataribeiro.sabia.dto.user.ContextResponseDTO;
import com.barataribeiro.sabia.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

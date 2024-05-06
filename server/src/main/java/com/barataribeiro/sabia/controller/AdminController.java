package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.RestSuccessResponseDTO;
import com.barataribeiro.sabia.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {
    @Autowired
    private AdminService adminService;

    @PutMapping("/users/{userId}/toggle-verify")
    public ResponseEntity toggleVerifyUser(@PathVariable String userId, Principal principal) {
        Boolean response = adminService.toggleVerifyUser(userId, principal.getName());

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User " + (response ? "verified" : "unverified") + " successfully.",
                                                              null));
    }

    @PutMapping("/users/{userId}/toggle-ban")
    public ResponseEntity banUser(@PathVariable String userId, Principal principal) {
        Boolean response = adminService.toggleUserBan(userId, principal.getName());

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User " + (response ? "banned" : "unbanned") + " successfully.",
                                                              null));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity deleteUser(@PathVariable String userId, Principal principal) {
        adminService.deleteUser(userId, principal.getName());

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User deleted successfully.",
                                                              null));
    }

}

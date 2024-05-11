package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.RestSuccessResponseDTO;
import com.barataribeiro.sabia.dto.auth.LoginRequestDTO;
import com.barataribeiro.sabia.dto.auth.LoginResponseDTO;
import com.barataribeiro.sabia.dto.auth.RegisterRequestDTO;
import com.barataribeiro.sabia.dto.auth.RegisterResponseDTO;
import com.barataribeiro.sabia.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequestDTO body) {
        LoginResponseDTO data = authService.login(body.username(), body.password(), body.rememberMe());

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              "User logged in successfully.",
                                                              data));
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequestDTO body) {
        RegisterResponseDTO data = authService.register(body);

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.CREATED,
                                                              HttpStatus.CREATED.value(),
                                                              "Account created successfully.",
                                                              data));
    }
}

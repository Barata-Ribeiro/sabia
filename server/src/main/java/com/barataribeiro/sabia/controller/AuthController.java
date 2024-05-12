package com.barataribeiro.sabia.controller;

import com.barataribeiro.sabia.dto.RestSuccessResponseDTO;
import com.barataribeiro.sabia.dto.auth.LoginRequestDTO;
import com.barataribeiro.sabia.dto.auth.LoginResponseDTO;
import com.barataribeiro.sabia.dto.auth.RegisterRequestDTO;
import com.barataribeiro.sabia.dto.auth.RegisterResponseDTO;
import com.barataribeiro.sabia.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequestDTO body,
                                @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language) {
        LoginResponseDTO data = authService.login(body.username(),
                                                  body.password(),
                                                  body.rememberMe(),
                                                  language);

        String message = language == null || language.equals("en")
                         ? "User logged in successfully."
                         : "Usuário logado com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.OK,
                                                              HttpStatus.OK.value(),
                                                              message,
                                                              data));
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequestDTO body,
                                   @RequestHeader(HttpHeaders.CONTENT_LANGUAGE) String language) {
        RegisterResponseDTO data = authService.register(body, language);

        String message = language == null || language.equals("en")
                         ? "Account created successfully."
                         : "Conta criada com sucesso.";

        return ResponseEntity.ok(new RestSuccessResponseDTO<>(HttpStatus.CREATED,
                                                              HttpStatus.CREATED.value(),
                                                              message,
                                                              data));
    }
}

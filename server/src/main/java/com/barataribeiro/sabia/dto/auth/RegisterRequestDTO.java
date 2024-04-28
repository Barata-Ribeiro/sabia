package com.barataribeiro.sabia.dto.auth;

public record RegisterRequestDTO(String username,
        String display_name,
        String email,
        String password) {

}

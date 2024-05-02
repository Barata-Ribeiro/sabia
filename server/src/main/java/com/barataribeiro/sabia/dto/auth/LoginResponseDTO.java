package com.barataribeiro.sabia.dto.auth;

public record LoginResponseDTO(String id, String username, String expirationDate, String token) {
}

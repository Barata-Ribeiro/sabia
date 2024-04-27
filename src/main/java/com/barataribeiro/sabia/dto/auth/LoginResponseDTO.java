package com.barataribeiro.sabia.dto.auth;

public record LoginResponseDTO (String username, String expirationDate, String token) {
}

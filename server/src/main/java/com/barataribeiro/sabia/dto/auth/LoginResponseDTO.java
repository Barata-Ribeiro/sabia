package com.barataribeiro.sabia.dto.auth;

import java.io.Serializable;

public record LoginResponseDTO(String id, String username, String expirationDate,
                               String token) implements Serializable {
}

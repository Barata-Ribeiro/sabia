package com.barataribeiro.sabia.dto.auth;

import java.io.Serializable;

public record RegisterResponseDTO(String id,
                                  String username,
                                  String displayName) implements Serializable {
}

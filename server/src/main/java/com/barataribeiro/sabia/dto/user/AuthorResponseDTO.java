package com.barataribeiro.sabia.dto.user;


import com.barataribeiro.sabia.model.enums.Roles;

import java.io.Serializable;

public record AuthorResponseDTO(String id,
                                String username,
                                String displayName,
                                String avatarImageUrl,
                                Boolean isVerified,
                                Roles role) implements Serializable {
}

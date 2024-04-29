package com.barataribeiro.sabia.dto.user;


import com.barataribeiro.sabia.model.Roles;

public record AuthorResponseDTO (String id,
                                String username,
                                String display_name,
                                String avatar_image_url,
                                Boolean is_verified,
                                Roles role) {
}

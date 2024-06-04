package com.barataribeiro.sabia.dto.user;

import com.barataribeiro.sabia.model.Roles;

import java.io.Serializable;

public record ContextResponseDTO(String id,
                                 String username,
                                 String display_name,
                                 String full_name,
                                 String birth_date,
                                 String gender,
                                 String email,
                                 String avatar_image_url,
                                 String cover_image_url,
                                 String biography,
                                 String website,
                                 String location,
                                 Roles role,
                                 Boolean is_verified,
                                 Boolean is_private,
                                 Long follower_count,
                                 Long following_count,
                                 String created_at,
                                 String updated_at) implements Serializable {
}

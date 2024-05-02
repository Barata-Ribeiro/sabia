package com.barataribeiro.sabia.dto.user;

public record PublicProfileResponseDTO(String id,
                                       String username,
                                       String display_name,
                                       String role,
                                       String avatar_image_url,
                                       String cover_image_url,
                                       String biography,
                                       String website,
                                       String location,
                                       Boolean is_verified,
                                       Boolean is_private,
                                       Integer followers_count,
                                       Integer following_count,
                                       Integer posts_count,
                                       Integer likes_count,
                                       String created_at,
                                       String updated_at) {
}

package com.barataribeiro.sabia.dto.user;

import java.io.Serializable;

public record PublicProfileResponseDTO(String id,
                                       String username,
                                       String displayName,
                                       String role,
                                       String avatarImageUrl,
                                       String coverImageUrl,
                                       String biography,
                                       String website,
                                       String location,
                                       Boolean isVerified,
                                       Boolean isPrivate,
                                       Boolean isFollowing,
                                       Integer followersCount,
                                       Integer followingCount,
                                       Integer postsCount,
                                       Integer likesCount,
                                       String createdAt,
                                       String updatedAt) implements Serializable {
}

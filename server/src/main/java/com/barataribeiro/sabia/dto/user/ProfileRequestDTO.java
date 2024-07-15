package com.barataribeiro.sabia.dto.user;

import java.io.Serializable;

public record ProfileRequestDTO(String username,
                                String display_name,
                                String fullName,
                                String birthDate,
                                String gender,
                                String email,
                                String password,
                                String newPassword,
                                String avatarImageUrl,
                                String coverImageUrl,
                                String biography,
                                String website,
                                String location) implements Serializable {
}

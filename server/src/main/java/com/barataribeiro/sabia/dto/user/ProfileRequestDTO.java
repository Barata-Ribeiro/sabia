package com.barataribeiro.sabia.dto.user;

import java.io.Serializable;

public record ProfileRequestDTO(String username,
                                String display_name,
                                String full_name,
                                String birth_date,
                                String gender,
                                String email,
                                String password,
                                String new_password,
                                String avatar_image_url,
                                String cover_image_url,
                                String biography,
                                String website,
                                String location) implements Serializable {
}

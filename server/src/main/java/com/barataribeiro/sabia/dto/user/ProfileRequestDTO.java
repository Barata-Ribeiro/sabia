package com.barataribeiro.sabia.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

public record ProfileRequestDTO(@Size(min = 3, max = 20) String username,
                                @Size(min = 3, max = 20) String display_name,
                                @Size(min = 3, max = 50) String full_name,
                                String birth_date,
                                String gender,
                                @Email String email,
                                @NotNull String password,
                                @Size(min = 8, max = 100) String new_password,
                                String avatar_image_url,
                                String cover_image_url,
                                String biography,
                                String website,
                                String location) implements Serializable {
}

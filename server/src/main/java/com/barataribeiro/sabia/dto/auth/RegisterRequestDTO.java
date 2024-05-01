package com.barataribeiro.sabia.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequestDTO(@NotNull @Size(min = 3, max = 20) String username,
                                 @NotNull @Size(min = 3, max = 20) String display_name,
                                 @NotNull @Size(min = 3, max = 50) String full_name,
                                 @NotNull String birth_date,
                                 @NotNull @Email String email,
                                 @NotNull @Size(min = 8, max = 100) String password) {

}

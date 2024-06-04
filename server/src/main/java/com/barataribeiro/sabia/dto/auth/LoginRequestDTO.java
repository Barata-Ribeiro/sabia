package com.barataribeiro.sabia.dto.auth;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

public record LoginRequestDTO(@NotNull @NotEmpty String username,
                              @NotNull @NotEmpty String password,
                              Boolean rememberMe) implements Serializable {

}

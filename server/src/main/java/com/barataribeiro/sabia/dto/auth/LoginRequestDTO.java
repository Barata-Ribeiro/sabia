package com.barataribeiro.sabia.dto.auth;

import java.io.Serializable;

public record LoginRequestDTO(String username,
                              String password,
                              Boolean rememberMe) implements Serializable {

}

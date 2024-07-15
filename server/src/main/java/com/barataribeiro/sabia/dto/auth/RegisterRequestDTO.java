package com.barataribeiro.sabia.dto.auth;

import java.io.Serializable;

public record RegisterRequestDTO(String username,
                                 String displayName,
                                 String fullName,
                                 String birthDate,
                                 String email,
                                 String password) implements Serializable {

}

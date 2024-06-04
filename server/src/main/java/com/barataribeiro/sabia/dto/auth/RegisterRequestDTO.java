package com.barataribeiro.sabia.dto.auth;

import java.io.Serializable;

public record RegisterRequestDTO(String username,
                                 String display_name,
                                 String full_name,
                                 String birth_date,
                                 String email,
                                 String password) implements Serializable {

}

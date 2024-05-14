package com.barataribeiro.sabia.dto.auth;

public record RegisterRequestDTO(String username,
                                 String display_name,
                                 String full_name,
                                 String birth_date,
                                 String email,
                                 String password) {

}

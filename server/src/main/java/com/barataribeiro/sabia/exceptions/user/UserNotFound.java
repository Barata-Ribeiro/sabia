package com.barataribeiro.sabia.exceptions.user;

public class UserNotFound extends RuntimeException {
    public UserNotFound(String language) {
        super(language == null || language.equals("en")
              ? "User not found."
              : "Usuário não encontrado.");
    }
}

package com.barataribeiro.sabia.exceptions.user;

public class UserAlreadyExists extends RuntimeException {
    public UserAlreadyExists(String language) {
        super(language == null || language.equals("en")
              ? "User already exists."
              : "Usuário já existe.");
    }
}

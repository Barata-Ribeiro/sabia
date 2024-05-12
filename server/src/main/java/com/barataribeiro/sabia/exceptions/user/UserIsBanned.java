package com.barataribeiro.sabia.exceptions.user;

public class UserIsBanned extends RuntimeException {
    public UserIsBanned(String language) {
        super(language == null || language.equals("en")
              ? "User is banned."
              : "Usuário está banido.");
    }
}

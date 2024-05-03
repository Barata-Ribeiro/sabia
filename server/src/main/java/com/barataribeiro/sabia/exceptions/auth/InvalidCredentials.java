package com.barataribeiro.sabia.exceptions.auth;

public class InvalidCredentials extends RuntimeException {
    public InvalidCredentials(String message) {
        super(message != null ? message : "Invalid credentials. Please try again.");
    }

    public InvalidCredentials() {
        this(null);
    }
}

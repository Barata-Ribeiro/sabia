package com.barataribeiro.sabia.exceptions.user;

public class InvalidInput extends RuntimeException {
    public InvalidInput(String message) {
        super(message != null ? message : "Input is invalid.");
    }

    public InvalidInput() {
        this(null);
    }
}

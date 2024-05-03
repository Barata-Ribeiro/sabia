package com.barataribeiro.sabia.exceptions.others;

public class BadRequest extends RuntimeException {
    public BadRequest(String message) {
        super(message != null ? message : "Bad request.");
    }

    public BadRequest() {
        this(null);
    }
}

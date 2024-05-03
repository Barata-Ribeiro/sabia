package com.barataribeiro.sabia.exceptions.others;

public class InternalServerError extends RuntimeException {
    public InternalServerError(String message) {
        super(message != null ? message : "Something went wrong. Please try again later.");
    }

    public InternalServerError() {
        this(null);
    }
}

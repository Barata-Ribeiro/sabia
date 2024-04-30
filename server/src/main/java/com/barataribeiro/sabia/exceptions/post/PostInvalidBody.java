package com.barataribeiro.sabia.exceptions.post;

public class PostInvalidBody extends IllegalArgumentException {
    public PostInvalidBody(String message) {
        super(message != null ? message : "Invalid input format.");
    }
}

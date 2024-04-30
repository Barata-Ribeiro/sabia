package com.barataribeiro.sabia.exceptions.others;

public class ForbiddenRequest extends RuntimeException {
    public ForbiddenRequest(String message) {
        super(message);
    }
}

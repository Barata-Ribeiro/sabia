package com.barataribeiro.sabia.exceptions.others;

public class ForbiddenRequest extends RuntimeException {
    public ForbiddenRequest(String message) {
        super(message != null ? message : "You don't have permission to access this resource.");
    }

    public ForbiddenRequest() {
        this(null);
    }
}

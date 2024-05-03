package com.barataribeiro.sabia.exceptions.user;

public class SameUser extends RuntimeException {
    public SameUser(String message) {
        super(message != null ? message : "You can't perform this action on yourself.");
    }

    public SameUser() {
        this(null);
    }
}

package com.barataribeiro.sabia.exceptions.user;

public class UserNotFound extends RuntimeException {
    public UserNotFound() { super("User not found."); }
}

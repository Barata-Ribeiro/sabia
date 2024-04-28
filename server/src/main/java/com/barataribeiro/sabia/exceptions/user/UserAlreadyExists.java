package com.barataribeiro.sabia.exceptions.user;

public class UserAlreadyExists extends RuntimeException {
    public UserAlreadyExists() { super("User already exists."); }
}

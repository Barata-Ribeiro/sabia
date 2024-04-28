package com.barataribeiro.sabia.exceptions.user;

public class UserIsBanned extends RuntimeException {
    public UserIsBanned() { super("User is banned or not activated."); }
}

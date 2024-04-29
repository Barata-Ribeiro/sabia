package com.barataribeiro.sabia.exceptions.post;

public class PostNotFound extends RuntimeException {
    public PostNotFound(String message) { super(message != null ? message : "Post not found."); }
}

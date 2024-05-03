package com.barataribeiro.sabia.exceptions.post;

public class PostNotFound extends RuntimeException {
    public PostNotFound() { super("Post not found."); }
}

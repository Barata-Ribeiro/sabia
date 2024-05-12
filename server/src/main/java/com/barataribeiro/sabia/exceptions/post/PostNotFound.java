package com.barataribeiro.sabia.exceptions.post;

public class PostNotFound extends RuntimeException {
    public PostNotFound(String language) {
        super(language == null || language.equals("en")
              ? "Post not found."
              : "Post não encontrado.");
    }
}

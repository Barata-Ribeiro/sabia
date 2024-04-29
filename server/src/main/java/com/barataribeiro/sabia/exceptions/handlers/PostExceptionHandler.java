package com.barataribeiro.sabia.exceptions.handlers;

import com.barataribeiro.sabia.exceptions.RestErrorMessage;
import com.barataribeiro.sabia.exceptions.post.PostNotFound;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class PostExceptionHandler {
    @ExceptionHandler(PostNotFound.class)
    private ResponseEntity<RestErrorMessage> postNotFound(PostNotFound exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
    }
}

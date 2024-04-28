package com.barataribeiro.sabia.exceptions;

import com.barataribeiro.sabia.exceptions.user.UserAlreadyExists;
import com.barataribeiro.sabia.exceptions.user.UserNotFound;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(UserNotFound.class)
    private ResponseEntity<RestErrorMessage> userNotFound(UserNotFound exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
    }

    @ExceptionHandler(UserAlreadyExists.class)
    private ResponseEntity<RestErrorMessage> userAlreadyExists(UserAlreadyExists exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.CONFLICT, HttpStatus.CONFLICT.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorMessage);
    }
}

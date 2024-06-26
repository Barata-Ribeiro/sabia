package com.barataribeiro.sabia.exceptions.handlers;

import com.barataribeiro.sabia.exceptions.RestErrorMessage;
import com.barataribeiro.sabia.exceptions.user.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class UserExceptionHandler extends ResponseEntityExceptionHandler {

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

    @ExceptionHandler(UserIsBanned.class)
    private ResponseEntity<RestErrorMessage> userIsBanned(UserIsBanned exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.FORBIDDEN, HttpStatus.FORBIDDEN.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorMessage);
    }

    @ExceptionHandler(InvalidInput.class)
    private ResponseEntity<RestErrorMessage> invalidInput(InvalidInput exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler(SameUser.class)
    private ResponseEntity<RestErrorMessage> sameUser(SameUser exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }
}
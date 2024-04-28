package com.barataribeiro.sabia.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@AllArgsConstructor
@Getter
@Setter
public class RestErrorMessage {
    private HttpStatus status;
    private int code;
    private String message;
}

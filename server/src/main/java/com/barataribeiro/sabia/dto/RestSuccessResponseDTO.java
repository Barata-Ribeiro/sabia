package com.barataribeiro.sabia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
@Setter
public class RestSuccessResponseDTO<T> {
    private HttpStatus status;
    private int code;
    private String message;
    private T data;
}

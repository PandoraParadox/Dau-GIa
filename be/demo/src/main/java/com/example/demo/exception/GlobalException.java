package com.example.demo.exception;

import com.example.demo.dto.response.ResponseError;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;

@RestControllerAdvice
@Slf4j
public class GlobalException {
    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseError handleBadRequest(Exception e, WebRequest request) {
        log.error("-> Handle Bad Request: {}", e.getMessage());
        ResponseError error = this.handleException(e, request);
        error.setStatus(HttpStatus.BAD_REQUEST.value());
        error.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        return error;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseError handleMethodArgumentNotValid(Exception e, WebRequest request) {
        log.error("-> Handle MethodArgumentNotValid: {}", e.getMessage());
        ResponseError error = this.handleException(e, request);
        error.setStatus(HttpStatus.BAD_REQUEST.value());
        error.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        return error;
    }

    public ResponseError handleException(Exception e, WebRequest request) {
        ;
        ResponseError error = new ResponseError();
        String message = e.getMessage();
        if (e instanceof BadRequestException) {
            message = message.substring(message.indexOf(": "), message.lastIndexOf("]"));
        }
        else if (e instanceof MethodArgumentNotValidException) {
            message = message.substring(message.lastIndexOf("[") + 1 , message.lastIndexOf("]") - 1);
        }
        error.setMessage(message);
        error.setTimeStamp(new Date());
        error.setPath(request.getDescription(false).replace("uri=", ""));
        return error;
    }
}

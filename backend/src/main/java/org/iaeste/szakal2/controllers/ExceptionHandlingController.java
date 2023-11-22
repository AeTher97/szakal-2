package org.iaeste.szakal2.controllers;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.exceptions.SzakalException;
import org.iaeste.szakal2.models.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Log4j2
public class ExceptionHandlingController {

    @ExceptionHandler(value = SzakalException.class)
    private ResponseEntity<Object> handleException(SzakalException e) {
        log.error(e.getMessage());

        return ResponseEntity.status(e.getStatusCode().value()).contentType(MediaType.APPLICATION_JSON)
                .body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler(value = ConstraintViolationException.class)
    private ResponseEntity<Object> handleException(ConstraintViolationException e) {
        log.error(e.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).contentType(MediaType.APPLICATION_JSON)
                .body(new ErrorResponse(e.getMessage()));
    }

//    @ExceptionHandler(value = MethodArgumentNotValidException.class)
//    private ResponseEntity<Object> handleValidationException(MethodArgumentNotValidException e){
//        log.error(e.getMessage());
//
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).contentType(MediaType.APPLICATION_JSON)
//                .body(new ErrorResponse(e.getMessage()));
//    }

    @ExceptionHandler(value = IllegalStateException.class)
    private ResponseEntity<Object> handleIllegalStateException(IllegalStateException e) {
        log.error(e.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).contentType(MediaType.APPLICATION_JSON)
                .body(new ErrorResponse(e.getMessage()));
    }
}

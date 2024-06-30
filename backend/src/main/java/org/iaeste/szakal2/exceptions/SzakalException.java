package org.iaeste.szakal2.exceptions;

import org.springframework.http.HttpStatus;

public class SzakalException extends RuntimeException {

    public SzakalException(String message) {
        super(message);
    }

    SzakalException(String message, Throwable t) {
        super(message, t);
    }

    public HttpStatus getStatusCode() {
        return HttpStatus.BAD_REQUEST;
    }
}

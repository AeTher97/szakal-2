package org.iaeste.szakal2.exceptions;

import org.springframework.http.HttpStatus;

public abstract class SzakalException extends RuntimeException {

    SzakalException(String message) {
        super(message);
    }

    SzakalException(String message, Throwable t) {
        super(message, t);
    }

    public abstract HttpStatus getStatusCode();
}

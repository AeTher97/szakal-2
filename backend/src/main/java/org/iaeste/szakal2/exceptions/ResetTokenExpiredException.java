package org.iaeste.szakal2.exceptions;

import org.springframework.http.HttpStatus;

public class ResetTokenExpiredException extends SzakalException {

    public ResetTokenExpiredException(String message) {
        super(message);
    }

    public ResetTokenExpiredException(String message, Throwable t) {
        super(message, t);
    }

    @Override
    public HttpStatus getStatusCode() {
        return HttpStatus.BAD_REQUEST;
    }
}

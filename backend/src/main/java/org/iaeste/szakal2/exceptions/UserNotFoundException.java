package org.iaeste.szakal2.exceptions;

import org.springframework.http.HttpStatus;

public class UserNotFoundException extends SzakalException {
    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(String message, Throwable t) {
        super(message, t);
    }

    @Override
    public HttpStatus getStatusCode() {
        return HttpStatus.NOT_FOUND;
    }
}


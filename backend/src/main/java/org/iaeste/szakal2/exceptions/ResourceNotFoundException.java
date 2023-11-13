package org.iaeste.szakal2.exceptions;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends SzakalException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable t) {
        super(message, t);
    }

    @Override
    public HttpStatus getStatusCode() {
        return HttpStatus.NOT_FOUND;
    }
}

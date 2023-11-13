package org.iaeste.szakal2.exceptions;

import org.springframework.http.HttpStatus;

public class ResourceExistsException extends SzakalException {
    public ResourceExistsException(String message) {
        super(message);
    }

    public ResourceExistsException(String message, Throwable t) {
        super(message, t);
    }

    @Override
    public HttpStatus getStatusCode() {
        return HttpStatus.CONFLICT;
    }
}

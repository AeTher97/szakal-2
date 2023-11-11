package org.iaeste.szakal2.exceptions;

import org.springframework.http.HttpStatus;

public class UsernameTakenException extends SzakalException{
    public UsernameTakenException(String message) {
        super(message);
    }

    public UsernameTakenException(String message, Throwable t) {
        super(message, t);
    }

    @Override
    public HttpStatus getStatusCode() {
        return HttpStatus.BAD_REQUEST;
    }
}

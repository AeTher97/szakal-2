package org.iaeste.szakal2.exceptions;

public class UsernameTakenException extends SzakalException {
    public UsernameTakenException(String message) {
        super(message);
    }

    public UsernameTakenException(String message, Throwable t) {
        super(message, t);
    }

}

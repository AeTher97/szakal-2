package org.iaeste.szakal2.exceptions;

public class ResetTokenExpiredException extends SzakalException {

    public ResetTokenExpiredException(String message) {
        super(message);
    }

    public ResetTokenExpiredException(String message, Throwable t) {
        super(message, t);
    }

}

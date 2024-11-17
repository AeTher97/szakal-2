package org.iaeste.szakal2.security.providers;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthTokenHolder {

    private final String authToken;
    private final boolean accepted;
}

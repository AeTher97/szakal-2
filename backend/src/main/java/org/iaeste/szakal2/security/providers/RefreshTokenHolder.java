package org.iaeste.szakal2.security.providers;

import lombok.Getter;

@Getter
public class RefreshTokenHolder extends AuthTokenHolder {

    private final String refreshToken;
    private final String userFingerprint;

    public RefreshTokenHolder(String authToken, String refreshToken, String userFingerprint, boolean accepted) {
        super(authToken, accepted);
        this.refreshToken = refreshToken;
        this.userFingerprint = userFingerprint;
    }
}

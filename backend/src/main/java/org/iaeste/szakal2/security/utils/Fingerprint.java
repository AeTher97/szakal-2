package org.iaeste.szakal2.security.utils;

import org.springframework.security.crypto.codec.Hex;

import java.security.SecureRandom;

public class Fingerprint {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private Fingerprint() {
    }

    public static String generateFingerprint() {
        byte[] randomFgp = new byte[50];
        SECURE_RANDOM.nextBytes(randomFgp);
        return new String(Hex.encode(randomFgp));
    }
}

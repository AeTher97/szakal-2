package org.iaeste.szakal2.security;

import io.jsonwebtoken.Jwts;
import org.iaeste.szakal2.configuration.JwtConfiguration;
import org.springframework.security.crypto.codec.Hex;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public class TokenFactory {

    private static final String ALGORITHM = "HmacSHA512";

    private TokenFactory() {
    }

    public static String generateAuthToken(UUID id,
                                           List<String> roles,
                                           String email,
                                           String name,
                                           String surname,
                                           boolean accepted,
                                           String userFingerprint,
                                           JwtConfiguration jwtConfiguration)
            throws NoSuchAlgorithmException {
        String jwtIssuer = jwtConfiguration.getIssuer();
        String key = jwtConfiguration.getSecret();
        long authExp = Long.parseLong(jwtConfiguration.getAuthExpirationTime());
        byte[] userFingerprintDigest = MessageDigest.getInstance("SHA-256").digest(userFingerprint
                .getBytes(StandardCharsets.UTF_8));
        String userFingerprintHash = new String(Hex.encode(userFingerprintDigest));

        return Jwts.builder()
                .subject(id.toString())
                .claim("roles", roles)
                .claim("type", "auth")
                .claim("email", email)
                .claim("name", name)
                .claim("surname", surname)
                .claim("accepted", accepted)
                .issuer(jwtIssuer)
                .claim("userFingerprint", userFingerprintHash)
                .expiration(new Date(System.currentTimeMillis() + authExp))
                .signWith(new SecretKeySpec(key.getBytes(), ALGORITHM))
                .compact();
    }


    public static String generateRefreshToken(UUID id, JwtConfiguration jwtConfiguration) {

        String jwtIssuer = jwtConfiguration.getIssuer();
        String key = jwtConfiguration.getSecret();
        long refreshExp = Long.parseLong(jwtConfiguration.getRefreshExpirationTime());


        return Jwts.builder()
                .subject(id.toString())
                .issuer(jwtIssuer)
                .claim("type", "refresh")
                .expiration(new Date(System.currentTimeMillis() + refreshExp))
                .signWith(new SecretKeySpec(key.getBytes(), ALGORITHM)).compact();
    }


}

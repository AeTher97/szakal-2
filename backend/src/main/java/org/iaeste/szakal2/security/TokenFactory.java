package org.iaeste.szakal2.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.iaeste.szakal2.configuration.JwtConfiguration;
import org.springframework.security.crypto.codec.Hex;

import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public class TokenFactory {

    private TokenFactory() {
    }

    public static String generateAuthToken(UUID id,
                                           List<String> roles,
                                           String email,
                                           String name,
                                           String surname,
                                           String userFingerprint,
                                           JwtConfiguration jwtConfiguration)
            throws UnsupportedEncodingException, NoSuchAlgorithmException {
        String jwtIssuer = jwtConfiguration.getIssuer();
        String key = jwtConfiguration.getSecret();
        long authExp = Long.parseLong(jwtConfiguration.getAuthExpirationTime());
        byte[] userFingerprintDigest = MessageDigest.getInstance("SHA-256").digest(userFingerprint.getBytes("UTF-8"));
        String userFingerprintHash = new String(Hex.encode(userFingerprintDigest));

        return Jwts.builder().setSubject(id.toString()).claim("roles", roles)
                .claim("type", "auth")
                .claim("email", email)
                .claim("name", name)
                .claim("surname", surname).setIssuer(jwtIssuer)
                .claim("userFingerprint", userFingerprintHash)
                .setExpiration(new Date(System.currentTimeMillis() + authExp))
                .signWith(new SecretKeySpec(key.getBytes(), SignatureAlgorithm.HS512.getJcaName())).compact();
    }


    public static String generateRefreshToken(UUID id, JwtConfiguration jwtConfiguration) throws IOException {

        String jwtIssuer = jwtConfiguration.getIssuer();
        String key = jwtConfiguration.getSecret();
        long refreshExp = Long.parseLong(jwtConfiguration.getRefreshExpirationTime());


        return Jwts.builder().setSubject(id.toString()).setIssuer(jwtIssuer)
                .claim("type", "refresh")
                .setExpiration(new Date(System.currentTimeMillis() + refreshExp))
                .signWith(new SecretKeySpec(key.getBytes(), SignatureAlgorithm.HS512.getJcaName())).compact();
    }


}

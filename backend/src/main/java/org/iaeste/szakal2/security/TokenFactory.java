package org.iaeste.szakal2.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.iaeste.szakal2.configuration.JwtConfiguration;

import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public class TokenFactory {

    public static String generateAuthToken(UUID id,
                                           List<String> roles,
                                           String email,
                                           String name,
                                           String surname,
                                           JwtConfiguration jwtConfiguration) throws IOException {
        String jwtIssuer = jwtConfiguration.getIssuer();
        String key = jwtConfiguration.getSecret();
        long authExp = Long.parseLong(jwtConfiguration.getAuthExpirationTime());

        return Jwts.builder().setSubject(id.toString()).claim("roles", roles)
                .claim("email", email)
                .claim("name", name)
                .claim("surname", surname).setIssuer(jwtIssuer)
                .setExpiration(new Date(System.currentTimeMillis() + authExp))
                .signWith(new SecretKeySpec(key.getBytes(), SignatureAlgorithm.HS512.getJcaName())).compact();
    }


    public static String generateRefreshToken(UUID id, JwtConfiguration jwtConfiguration) throws IOException {

        String jwtIssuer = jwtConfiguration.getIssuer();
        String key = jwtConfiguration.getSecret();
        long refreshExp = Long.parseLong(jwtConfiguration.getRefreshExpirationTime());


        return Jwts.builder().setSubject(id.toString()).setIssuer(jwtIssuer)
                .setExpiration(new Date(System.currentTimeMillis() + refreshExp))
                .signWith(new SecretKeySpec(key.getBytes(), SignatureAlgorithm.HS512.getJcaName())).compact();
    }


}

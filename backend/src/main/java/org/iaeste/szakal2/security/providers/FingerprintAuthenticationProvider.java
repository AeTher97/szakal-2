package org.iaeste.szakal2.security.providers;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.codec.Hex;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Slf4j
public abstract class FingerprintAuthenticationProvider {

    protected FingerprintAuthenticationProvider() {
    }

    protected static void validateFingerprint(String fingerprint,
                                              String token,
                                              SecretKey key,
                                              String issuer) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .requireIssuer(issuer)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String userFingerprintHash = (String) claims.get("userFingerprint");
            byte[] userFingerprintDigestFromCookie = MessageDigest.getInstance("SHA-256")
                    .digest(fingerprint.getBytes(StandardCharsets.UTF_8));
            String userFingerprintHashFromCookie = new String(Hex.encode(userFingerprintDigestFromCookie));

            if (!userFingerprintHash.equals(userFingerprintHashFromCookie)) {
                throw new BadCredentialsException("User fingerprint mismatch");
            }
        } catch (JwtException | IllegalArgumentException e) {
            log.info(e.getMessage());
            throw new BadCredentialsException(e.getMessage(), e);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}

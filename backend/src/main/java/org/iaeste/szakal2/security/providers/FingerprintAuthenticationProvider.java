package org.iaeste.szakal2.security.providers;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.codec.Hex;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Slf4j
public abstract class FingerprintAuthenticationProvider {

    protected FingerprintAuthenticationProvider() {
    }

    protected static void validateFingerprint(String fingerprint,
                                              String token,
                                              SecretKeySpec key,
                                              String issuer) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .requireIssuer(issuer)
                    .build()
                    .parseClaimsJws(token).getBody();

            String userFingerprintHash = (String) claims.get("userFingerprint");
            byte[] userFingerprintDigestFromCookie = MessageDigest.getInstance("SHA-256")
                    .digest(fingerprint.getBytes(StandardCharsets.UTF_8));
            String userFingerprintHashFromCookie = new String(Hex.encode(userFingerprintDigestFromCookie));

            if (!userFingerprintHash.equals(userFingerprintHashFromCookie)) {
                throw new BadCredentialsException("User fingerprint mismatch");
            }
        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | SignatureException |
                 IllegalArgumentException e) {
            log.info(e.getMessage());
            throw new BadCredentialsException(e.getMessage(), e);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}

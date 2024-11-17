package org.iaeste.szakal2.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Getter
public class RefreshTokenAuthentication extends TokenAuthentication {

    private final String refreshToken;

    public RefreshTokenAuthentication(String principal,
                                      String refreshToken,
                                      String authToken,
                                      String userFingerprint,
                                      Collection<? extends GrantedAuthority> grantedAuthorityList) {
        super(principal, authToken, userFingerprint, grantedAuthorityList);
        this.refreshToken = refreshToken;
    }

}

package org.iaeste.szakal2.security;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class JwtTokenAuthentication extends TokenAuthentication {

    public JwtTokenAuthentication(String principal,
                                  String token,
                                  String userFingerprint,
                                  Collection<? extends GrantedAuthority> grantedAuthorityList) {
        super(principal, token, userFingerprint, grantedAuthorityList);
    }

}

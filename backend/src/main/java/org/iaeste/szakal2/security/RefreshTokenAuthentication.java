package org.iaeste.szakal2.security;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class RefreshTokenAuthentication extends TokenAuthentication {

    public RefreshTokenAuthentication(String principal, String token, Collection<? extends GrantedAuthority> grantedAuthorityList) {
        super(principal, token, grantedAuthorityList);
    }

}

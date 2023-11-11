package org.iaeste.szakal2.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.ObjectUtils;

import java.util.Collection;

public abstract class TokenAuthentication implements Authentication {

    private boolean isAuthenticated;
    private final String principal;
    private final String token;
    private final Collection<? extends GrantedAuthority> authorities;

    public TokenAuthentication(String principal, String token, Collection<? extends GrantedAuthority> grantedAuthorityList) {
        this.authorities = grantedAuthorityList;
        this.principal = principal;
        this.token = token;
        this.isAuthenticated = true;
    }

    @Override

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public Object getCredentials() {
        return token;
    }

    @Override
    public Object getDetails() {
        throw new UnsupportedOperationException();
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }

    @Override
    public boolean isAuthenticated() {
        return isAuthenticated;
    }

    @Override
    public void setAuthenticated(boolean b) throws IllegalArgumentException {
        if (b) {
            throw new IllegalArgumentException("Cannot set this token to trusted - use constructor which takes a GrantedAuthority list instead");
        } else {
            isAuthenticated = false;
        }
    }

    @Override
    public String getName() {
        return "Token authentication";
    }


    @Override
    public boolean equals(Object obj) {
        if (obj instanceof TokenAuthentication) {
            TokenAuthentication secondObj = (TokenAuthentication) obj;
            return secondObj.isAuthenticated == this.isAuthenticated && ObjectUtils.nullSafeEquals(this.getCredentials(), secondObj.getCredentials())
                    && ObjectUtils.nullSafeEquals(this.getPrincipal(), secondObj.getPrincipal()) && ObjectUtils.nullSafeEquals(this.getAuthorities(), secondObj.getAuthorities());

        } else {
            return false;
        }
    }
}

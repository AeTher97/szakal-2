package org.iaeste.szakal2.security;

import lombok.Getter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.ObjectUtils;

import java.util.Collection;
import java.util.Objects;

public abstract class TokenAuthentication implements Authentication {

    private final String principal;
    @Getter
    private final String authToken;
    @Getter
    private final String userFingerprint;
    private final Collection<? extends GrantedAuthority> authorities;
    private boolean isAuthenticated;

    protected TokenAuthentication(String principal,
                                  String authToken,
                                  String userFingerprint,
                                  Collection<? extends GrantedAuthority> grantedAuthorityList) {
        this.userFingerprint = userFingerprint;
        this.authorities = grantedAuthorityList;
        this.principal = principal;
        this.authToken = authToken;
        this.isAuthenticated = true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public Object getCredentials() {
        return authToken;
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
        if (obj instanceof TokenAuthentication secondObj) {
            return secondObj.isAuthenticated == this.isAuthenticated && ObjectUtils.nullSafeEquals(this.getCredentials(), secondObj.getCredentials())
                    && ObjectUtils.nullSafeEquals(this.getPrincipal(), secondObj.getPrincipal()) && ObjectUtils.nullSafeEquals(this.getAuthorities(), secondObj.getAuthorities());

        } else {
            return false;
        }
    }

    @Override
    public int hashCode() {
        int result = principal.hashCode();
        result = 31 * result + Objects.hashCode(authToken);
        result = 31 * result + Objects.hashCode(userFingerprint);
        result = 31 * result + Objects.hashCode(authorities);
        result = 31 * result + Boolean.hashCode(isAuthenticated);
        return result;
    }
}

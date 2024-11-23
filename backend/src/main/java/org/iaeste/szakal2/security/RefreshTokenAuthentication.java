package org.iaeste.szakal2.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Objects;

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

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        RefreshTokenAuthentication that = (RefreshTokenAuthentication) o;
        return Objects.equals(refreshToken, that.refreshToken);
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + Objects.hashCode(refreshToken);
        return result;
    }
}

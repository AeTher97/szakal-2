package org.iaeste.szakal2.security.utils;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@Log4j2
public class AccessVerificationBean {


    public AccessVerificationBean() {

    }

    public boolean hasAccessToUser(String id) {
        return SecurityUtils.getUserId().equals(UUID.fromString(id));
    }

}

package org.iaeste.szakal2.security;

import lombok.Getter;

@Getter
public enum Authority {

    USER_VIEWING("user_viewing"),
    ROLE_VIEWING("role_viewing"),
    CAMPAIGN_MODIFICATION("campaign_modification"),
    ROLE_MODIFICATION("role_modification"),
    USER_ROLE_GRANTING("user_role_granting"),
    COMPANY_MODIFICATION("company_modification"),
    CATEGORY_MODIFICATION("category_modification"),
    USER_ACCEPTANCE("user_acceptance"),
    USER_MANAGEMENT("user_management"),
    JOURNEY_CREATION("journey_creation"),
    JOURNEY_CREATION_FOR_OTHERS("journey_creation_for_others"),
    JOURNEY_MODIFICATION_FOR_OTHERS("journey_modification_for_others"),
    APP_SETTINGS("app_settings");

    private final String value;

    Authority(String value) {
        this.value = value;
    }

}

package org.iaeste.szakal2.security;

import org.springframework.stereotype.Component;

@Component
public class AuthorityBean {

    public String userViewing() {
        return Authority.USER_VIEWING.getValue();
    }

    public String roleViewing() {
        return Authority.ROLE_VIEWING.getValue();
    }

    public String campaignModification() {
        return Authority.CAMPAIGN_MODIFICATION.getValue();
    }

    public String roleModification() {
        return Authority.ROLE_MODIFICATION.getValue();
    }

    public String userRoleGranting() {
        return Authority.USER_ROLE_GRANTING.getValue();
    }

    public String companyModification() {
        return Authority.COMPANY_MODIFICATION.getValue();
    }

    public String categoryModification() {
        return Authority.CATEGORY_MODIFICATION.getValue();
    }

    public String userAcceptance() {
        return Authority.USER_ACCEPTANCE.getValue();
    }

    public String userManagement() {
        return Authority.USER_MANAGEMENT.getValue();
    }

    public String journeyCreation() {
        return Authority.JOURNEY_CREATION.getValue();
    }

    public String journeyCreationForOthers() {
        return Authority.JOURNEY_CREATION_FOR_OTHERS.getValue();
    }

    public String journeyModificationForOthers() {
        return Authority.JOURNEY_MODIFICATION_FOR_OTHERS.getValue();
    }

    public String appSettings() {
        return Authority.APP_SETTINGS.getValue();
    }
}

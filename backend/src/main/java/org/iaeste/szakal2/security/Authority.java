package org.iaeste.szakal2.security;

import lombok.Getter;

@Getter
public enum Authority {

    USER_VIEWING("user_viewing", "Przeglądanie listy użytkowników"),
    ROLE_VIEWING("role_viewing", "Przeglądanie dostępnych ról"),
    CAMPAIGN_MODIFICATION("campaign_modification", "Dodawanie akcji"),
    ROLE_MODIFICATION("role_modification", "Modyfikacja definicji roli"),
    USER_ROLE_GRANTING("user_role_granting", "Modyfikacja roli użytkownika"),
    COMPANY_MODIFICATION("company_modification", "Modyfikacja firm"),
    CATEGORY_MODIFICATION("category_modification", "Modyfikacja kategorii"),
    USER_ACCEPTANCE("user_acceptance", "Akceptowanie użytkowników"),
    USER_MANAGEMENT("user_management", "Deaktywowanie użytkowników"),
    JOURNEY_CREATION("journey_creation", "Przypisywanie firm do siebie"),
    JOURNEY_CREATION_FOR_OTHERS("journey_creation_for_others", "Przypisywanie firm do innych"),
    JOURNEY_MODIFICATION_FOR_OTHERS("journey_modification_for_others", "Edycja kontaktów innych"),
    APP_SETTINGS("app_settings", "Ustawienia aplikacji");

    private final String value;
    private final String description;

    Authority(String value, String description) {
        this.value = value;
        this.description = description;
    }

}

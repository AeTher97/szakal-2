export const contactStatusUtils = (status) => {
    switch (status) {
        case "ASSIGNED":
            return "Przypisana"
        case "WAITING_FOR_RESPONSE":
            return "Oczekiwanie na odpowiedź"
        case "CALL_LATER":
            return "Zadzwonić później"
        case "NOT_INTERESTED":
            return "Niezainteresowana"
        case "INTERNSHIP":
            return "Praktyka"
        case "BARTER":
            return "Barter"
        case "SPONSOR":
            return "Sponsor"
        case "TRAINING":
            return "Szkolenie"
        case "DIFFERENT_FORM_PARTNERSHIP":
            return "Inna forma współpracy"
        case "CALL_NEXT_YEAR":
            return "Zadzwonić w przyszłym roku"
        case "I_HAVE_TO_CONTACT_COMPANY":
            return "Mam się skontaktować z firmą"
        case "COMPANY_WILL_REACH_OUT":
            return "Firma ma się skontaktować"
        case "UNABLE_TO_CONNECT":
            return "Nie można się połączyć"
        case "NOT_PICKING_UP":
            return "Nieodebrany"
        default:
            return "Nieznany status"
    }

}
package org.iaeste.szakal2.utils;

import org.iaeste.szakal2.models.entities.ContactStatus;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

import java.util.HashSet;
import java.util.Set;

public class Utils {

    private Utils() {
    }

    public static String[] getNullPropertyNames(Object source) {
        final BeanWrapper src = new BeanWrapperImpl(source);
        java.beans.PropertyDescriptor[] pds = src.getPropertyDescriptors();

        Set<String> emptyNames = new HashSet<>();
        for (java.beans.PropertyDescriptor pd : pds) {
            Object srcValue = src.getPropertyValue(pd.getName());
            if (srcValue == null) emptyNames.add(pd.getName());
        }
        String[] result = new String[emptyNames.size()];
        return emptyNames.toArray(result);
    }

    public static String decodeContactStatus(ContactStatus status) {
        return switch (status) {
            case ASSIGNED -> "Przypisana";
            case WAITING_FOR_RESPONSE -> "Oczekiwanie na odpowiedź";
            case CALL_LATER -> "Zadzwonić później";
            case NOT_INTERESTED -> "Niezainteresowana";
            case INTERNSHIP -> "Praktyka";
            case BARTER -> "Barter";
            case SPONSOR -> "Sponsor";
            case TRAINING -> "Szkolenie";
            case DIFFERENT_FORM_PARTNERSHIP -> "Inna forma współpracy";
            case CALL_NEXT_YEAR -> "Zadzwonić w przyszłym roku";
            case I_HAVE_TO_CONTACT_COMPANY -> "Mam się skontaktować z firmą";
            case COMPANY_WILL_REACH_OUT -> "Firma ma się skontaktować";
        };
    }
}

package org.iaeste.szakal2.models.entities;

import lombok.Getter;
import org.iaeste.szakal2.utils.Utils;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

public enum ContactStatus {
    ASSIGNED, CALL_LATER, NOT_INTERESTED, INTERNSHIP, WAITING_FOR_RESPONSE, BARTER, SPONSOR, TRAINING, DIFFERENT_FORM_PARTNERSHIP,
    CALL_NEXT_YEAR, I_HAVE_TO_CONTACT_COMPANY, COMPANY_WILL_REACH_OUT, UNABLE_TO_CONNECT, NOT_PICKING_UP;

    @Getter
    private static final List<ContactStatus> inLocalOrder = Arrays.stream(values())
            .sorted(Comparator.comparing(Utils::decodeContactStatus))
            .toList();


}

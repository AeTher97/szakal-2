package org.iaeste.szakal2.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class IcsUtils {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'");

    private static String formatDate(LocalDateTime localDateTime) {
        return localDateTime.format(FORMATTER);
    }


    public static String generateInvite(String companyName, LocalDateTime contactDate) {
        return STR. """
                BEGIN:VCALENDAR
                BEGIN:VEVENT
                UID:\{ UUID.randomUUID().toString().toUpperCase() }
                DTSTAMP:20151219T021727Z
                DTSTART;TZID=Europe/Warsaw:\{ formatDate(contactDate) }
                DTEND;TZID=Europe/Warsaw:\{ formatDate(contactDate.plusMinutes(15)) }
                SEQUENCE:0
                SUMMARY:Kontakt z \{ companyName }
                TRANSP:OPAQUE
                ORGANIZER:szakal.iaeste@gmail.com
                END:VEVENT
                END:VCALENDAR
                """ ;
    }
}

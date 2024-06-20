package org.iaeste.szakal2.utils;

import org.iaeste.szakal2.models.entities.User;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class IcsUtils {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'");

    private static String formatDate(LocalDateTime localDateTime) {
        return localDateTime.format(FORMATTER);
    }


    public static String generateInvite(User attendee, String companyName, String note, LocalDateTime contactDate) {
        return STR. """
                BEGIN:VCALENDAR
                METHOD:REQUEST
                BEGIN:VEVENT
                UID:\{ UUID.randomUUID().toString().toUpperCase() }
                DTSTAMP:\{ formatDate(LocalDateTime.now()) }
                DTSTART;TZID=Europe/Warsaw:\{ formatDate(contactDate) }
                DTEND;TZID=Europe/Warsaw:\{ formatDate(contactDate.plusMinutes(15)) }
                SEQUENCE:0
                SUMMARY:Kontakt z \{ companyName }
                DESCRIPTION:Kontakt z firmą, \{ note }.
                ORGANIZER:szakal.iaeste@gmail.com
                ATTENDEE;PARTSTAT=ACCEPTED;CN=\{ attendee.getFullName() };EMAIL=\{ attendee.getEmail() }:MAILTO:\{ attendee.getEmail() }
                END:VEVENT
                END:VCALENDAR
                """ ;
    }
}

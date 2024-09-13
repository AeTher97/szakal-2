package org.iaeste.szakal2.utils;


import org.iaeste.szakal2.models.entities.User;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class IcsUtilsTest {

    @Test
    void generateIcsInvite() {
        User user = mock(User.class);
        when(user.getFullName()).thenReturn("Test Name");
        when(user.getEmail()).thenReturn("test@gmail.com");

        String invite = IcsUtils.generateInvite(
                user,
                "IAESTE",
                "SZAKAL",
                LocalDateTime.of(2024,6,15,14,20));

        assertTrue(invite.contains("ORGANIZER:szakal.iaeste@gmail.com"));
        assertTrue(invite.contains("CN=Test Name;EMAIL=test@gmail.com:MAILTO:test@gmail.com"));
        assertTrue(invite.contains("DTSTART;TZID=Europe/Warsaw:20240615T142000Z"));
        assertTrue(invite.contains("DTEND;TZID=Europe/Warsaw:20240615T143500Z"));
    }

}
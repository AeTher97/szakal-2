package org.iaeste.szakal2.utils;

import org.springframework.aop.framework.AopConfigException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class EmailLoader {

    private EmailLoader() {}

    public static String loadResetPasswordEmail() {
        return loadFile("email/passwordReset.html");
    }

    public static String loadContactNotificationEmail() {
        return loadFile("email/contactNotification.html");
    }

    public static String loadContactPlannedEmail() {
        return loadFile("email/contactPlanned.html");
    }

    private static String loadFile(String name) {
        StringBuilder email = new StringBuilder();
        InputStream inputStream = EmailLoader.class.getClassLoader().getResourceAsStream(name);
        if(inputStream == null) {
            throw new AopConfigException("Failed to find email template");
        }

        try (InputStreamReader streamReader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
             BufferedReader bufferedReader = new BufferedReader(streamReader);
        ) {
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                email.append(line);
            }
        } catch (IOException e) {
            throw new AopConfigException("Failed to load email template", e);
        }
        return email.toString();
    }
}
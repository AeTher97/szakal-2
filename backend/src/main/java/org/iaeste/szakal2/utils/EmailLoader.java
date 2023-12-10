package org.iaeste.szakal2.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class EmailLoader {

    public static String loadResetPasswordEmail() {
        return loadFile("email/passwordReset.html");
    }

    public static String loadContactNotificationEmail() {
        return loadFile("email/contactNotification.html");
    }

    private static String loadFile(String name) {
        StringBuilder email = new StringBuilder();
        InputStream inputStream = EmailLoader.class.getClassLoader().getResourceAsStream(name);
        try (InputStreamReader streamReader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
             BufferedReader bufferedReader = new BufferedReader(streamReader);
        ) {
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                email.append(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return email.toString();
    }
}
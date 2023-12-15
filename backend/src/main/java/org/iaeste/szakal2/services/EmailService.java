package org.iaeste.szakal2.services;

import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.entities.FailedEmail;
import org.iaeste.szakal2.repositories.FailedEmailRepository;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@Log4j2
public class EmailService {

    private final ExecutorService executorService = Executors.newFixedThreadPool(2);
    private final FailedEmailRepository failedEmailRepository;
    private final JavaMailSender javaMailSender;

    public EmailService(FailedEmailRepository failedEmailRepository, JavaMailSender javaMailSender) {
        this.failedEmailRepository = failedEmailRepository;
        this.javaMailSender = javaMailSender;
        log.info("Using email account " + System.getenv("EMAIL_USERNAME") + " to send notifications");
    }

    public void sendHtmlMessage(String to, String subject, String content) {
        sendHtmlMessage(to, subject, content, null);
    }

    public void sendHtmlMessage(String to, String subject, String content, Attachment attachment) {
        log.info("Sending html email to " + to);
        try {
            executorService.submit(new SendMessageTask(javaMailSender, to, subject, content, attachment, this));
        } catch (Exception e) {
            //don't propagate this exception to callers to avoid weird errors, save email for later and handle it here
            log.error("Failed to send email " + e.getMessage());
            saveFailedEmail(FailedEmail.builder()
                    .recipient(to)
                    .subject(subject)
                    .content(content)
                    .date(new Date())
                    .build());
        }
    }

    @Scheduled(cron = "0 0 21 * * *")
    public void resendEmails() {
        log.info("Resending failed emails");
        List<FailedEmail> failedEmailList = failedEmailRepository.findAll();
        log.info(failedEmailList.size() + " failed emails found");
        failedEmailList.forEach(failedEmail -> {
            sendHtmlMessage(failedEmail.getRecipient(), failedEmail.getSubject(), failedEmail.getContent());
            failedEmailRepository.delete(failedEmail);
        });
    }

    public void saveFailedEmail(FailedEmail failedEmail) {
        failedEmailRepository.save(failedEmail);
    }


    @AllArgsConstructor
    private static class SendMessageTask implements Runnable {

        private final JavaMailSender javaMailSender;
        private final String to;
        private final String subject;
        private final String content;
        private final Attachment attachment;
        private final EmailService emailService;

        @Override
        public void run() {
            if (to == null) {
                return;
            }
            try {
                Properties props = System.getProperties();

                Session session = Session.getDefaultInstance(props);

                MimeMessage mimeMessage = new MimeMessage(session);
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");
                helper.setText(content, true);
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setFrom(System.getenv("EMAIL_USERNAME"));
                if (attachment != null) {
                    helper.addAttachment(attachment.filename, attachment.inputStreamSource,
                            "text/calendar; charset=utf-8; method=REQUEST; name=zaproszenie.ics");
                }

                javaMailSender.send(mimeMessage);
            } catch (Exception e) {
                log.error("Failed sending email " + e.getMessage());
                if (attachment == null) {
                    // dont save attachment emails
                    emailService.saveFailedEmail(FailedEmail.builder()
                            .recipient(to)
                            .subject(subject)
                            .content(content)
                            .build());
                }
            }
        }
    }

    @Data
    public static final class Attachment {

        private final String filename;
        private final InputStreamSource inputStreamSource;
    }

}
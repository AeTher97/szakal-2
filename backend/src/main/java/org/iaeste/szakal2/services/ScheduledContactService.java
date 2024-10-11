package org.iaeste.szakal2.services;

import lombok.extern.java.Log;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.dto.scheduled.contact.ScheduledContactDTO;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.ScheduledContact;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.repositories.ScheduledContactRepository;
import org.iaeste.szakal2.security.utils.SecurityUtils;
import org.iaeste.szakal2.utils.EmailLoader;
import org.iaeste.szakal2.utils.IcsUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.util.InMemoryResource;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Log
public class ScheduledContactService {

    private final ScheduledContactRepository scheduledContactRepository;
    private final UserService userService;
    private final CompanyService companyService;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM");
    private static final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");


    public ScheduledContactService(ScheduledContactRepository scheduledContactRepository, UserService userService, CompanyService companyService, NotificationService notificationService, EmailService emailService) {
        this.scheduledContactRepository = scheduledContactRepository;
        this.userService = userService;
        this.companyService = companyService;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    public ScheduledContact schedule(ScheduledContactDTO scheduledContactDTO) {
        User user = userService.getUserById(scheduledContactDTO.getUser());
        Company company = companyService.getCompanyById(scheduledContactDTO.getCompany());
        ScheduledContact scheduledContact = scheduledContactRepository.save(ScheduledContact.builder()
                .user(user)
                .company(company)
                .reminderDate(scheduledContactDTO.getReminderDate())
                .contactDate(scheduledContactDTO.getContactDate())
                .note(scheduledContactDTO.getNote())
                .build());
        emailService.sendHtmlMessage(user.getEmail(), "Zaplanowano kontakt z firmą",
                EmailLoader.loadContactPlannedEmail()
                        .replace("${domainName}", System.getenv("HEROKU_APP_DEFAULT_DOMAIN_NAME"))
                        .replace("${userName}", user.getName())
                        .replace("${company}", company.getName())
                        .replace("${contactDate}",
                                scheduledContactDTO.getContactDate().format(dateFormatter))
                        .replace("${contactTime}", scheduledContactDTO.getContactDate().format(timeFormatter)),
                new EmailService.Attachment("zaproszenie.ics",
                        new InMemoryResource(IcsUtils.generateInvite(user,
                                company.getName(),
                                scheduledContact.getNote(),
                                scheduledContact.getContactDate()))));
        return scheduledContact;
    }

    public void deleteScheduledContact(UUID scheduledContactId) {
        Optional<ScheduledContact> scheduledContactOptional = scheduledContactRepository.findById(scheduledContactId);
        if (scheduledContactOptional.isEmpty()) {
            throw new ResourceNotFoundException("No scheduled contact with this id");
        }
        ScheduledContact scheduledContact = scheduledContactOptional.get();
        if (!scheduledContact.getUser().getId().equals(SecurityUtils.getUserId())) {
            throw new BadCredentialsException("Can't delete scheduled contact for this user");
        }
        scheduledContactRepository.delete(scheduledContact);
    }

    public List<ScheduledContact> getScheduledContacts() {
        UUID userId = SecurityUtils.getUserId();
        User user = userService.getUserById(userId);
        return scheduledContactRepository.getScheduledContactByUser(user);
    }

    @Scheduled(cron = "0 * * * * *")
    public void sendNotificationAboutContact() {
        log.info("Sending scheduled contact notifications at " + LocalDateTime.now());
        List<ScheduledContact> contactsToSchedule = scheduledContactRepository
                .findScheduledContactsByReminderDateBetween(LocalDateTime.now().minusHours(12), LocalDateTime.now());
        contactsToSchedule.forEach(scheduledContact -> {
            String info = STR. """
                        Dnia \{ scheduledContact.getContactDate().format(dateFormatter) }
                        o godzinie: \{ scheduledContact.getContactDate().format(timeFormatter) } masz
                        zaplanowany kontakt z firmą:
                        \{ scheduledContact.getCompany().getName() },  \{ scheduledContact.getNote().isEmpty() ? "notatka: " + scheduledContact.getNote() : "" }
                        """ ;
            try {
                notificationService.notify(userService.getUserById(scheduledContact.getUser().getId()), info);
                emailService.sendHtmlMessage(
                        scheduledContact.getUser().getEmail(),
                        "Przypomnienie o kontakcie z " + scheduledContact.getCompany().getName(),
                        EmailLoader.loadContactNotificationEmail().replace("${userName}",
                                        scheduledContact.getUser().getName()).replace("${text}", info)
                                .replace("${domainName}", System.getenv("HEROKU_APP_DEFAULT_DOMAIN_NAME")));
                scheduledContactRepository.delete(scheduledContact);
            } catch (Exception e) {
                log.info(e.getMessage());
                //Swallow this to allow the rest to progress
            }
        });
        List<ScheduledContact> contactsToDelete = scheduledContactRepository
                .findScheduledContactsByReminderDateBetween(
                        LocalDateTime.ofEpochSecond(0, 0, ZoneOffset.MIN), LocalDateTime.now().minusHours(12));
        scheduledContactRepository.deleteAll(contactsToDelete);

    }

}

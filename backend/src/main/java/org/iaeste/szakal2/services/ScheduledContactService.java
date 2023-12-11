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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
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
        return scheduledContactRepository.save(ScheduledContact.builder()
                .user(user)
                .company(company)
                .reminderDate(scheduledContactDTO.getReminderDate())
                .note(scheduledContactDTO.getNote())
                .build());
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

    @Scheduled(cron = "0 0,30 * * * *")
    public void sendNotificationAboutContact() {
        log.info("Sending scheduled contact notifications at " + LocalDateTime.now());
        List<ScheduledContact> contactsToSchedule = scheduledContactRepository
                .findScheduledContactsByReminderDateBetween(LocalDateTime.now().plusHours(24), LocalDateTime.now().plusHours(25));
        contactsToSchedule.forEach(scheduledContact -> {
            String info =  STR."""
                        O godzinie \{scheduledContact.getReminderDate().getHour()}:\{scheduledContact.getReminderDate().getMinute()}
                         jutro masz zaplanowany kontakt z firmą:
                        \{scheduledContact.getCompany().getName()}, notatka: \{scheduledContact.getNote()}
                                """;
            try {
                notificationService.notify(userService.getUserById(scheduledContact.getUser().getId()),info);
                emailService.sendHtmlMessage(
                        scheduledContact.getUser().getEmail(),
                        "Przypomnienie o kontakcie z " + scheduledContact.getCompany().getName(),
                        EmailLoader.loadContactNotificationEmail().replace("${userName}",
                                        scheduledContact.getUser().getName()).replace("${text}", info)
                                .replace("${domainName}", System.getenv("HEROKU_APP_DEFAULT_DOMAIN_NAME")));
                scheduledContactRepository.delete(scheduledContact);
            } catch (Exception e) {
                //Swallow this to allow the rest to progress
            }
        });
        List<ScheduledContact> contactsToDelete = scheduledContactRepository
                .findScheduledContactsByReminderDateBetween(
                        LocalDateTime.ofEpochSecond(0,0, ZoneOffset.MIN), LocalDateTime.now());
        scheduledContactRepository.deleteAll(contactsToDelete);

    }

}

package org.iaeste.szakal2.services;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.iaeste.szakal2.exceptions.ResourceExistsException;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.dto.campaign.ContactJourneySearch;
import org.iaeste.szakal2.models.dto.journey.*;
import org.iaeste.szakal2.models.entities.*;
import org.iaeste.szakal2.repositories.ContactJourneyRepository;
import org.iaeste.szakal2.repositories.ContactPersonRepository;
import org.iaeste.szakal2.repositories.JourneySpecification;
import org.iaeste.szakal2.security.Authority;
import org.iaeste.szakal2.security.utils.AccessVerificationBean;
import org.iaeste.szakal2.security.utils.SecurityUtils;
import org.iaeste.szakal2.utils.MapUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class JourneyService {

    @PersistenceContext
    private EntityManager entityManager;
    private final ContactJourneyRepository contactJourneyRepository;
    private final UserService userService;
    private final CompanyService companyService;
    private final CampaignService campaignService;
    private final ContactPersonRepository contactPersonRepository;
    private final NotificationService notificationService;

    public JourneyService(ContactJourneyRepository contactJourneyRepository,
                          UserService userService,
                          CompanyService companyService,
                          CampaignService campaignService, ContactPersonRepository contactPersonRepository,
                          NotificationService notificationService) {
        this.contactJourneyRepository = contactJourneyRepository;
        this.userService = userService;
        this.companyService = companyService;
        this.campaignService = campaignService;
        this.contactPersonRepository = contactPersonRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ContactJourneyDetailsDTO createJourney(ContactJourneyCreationDTO contactJourneyCreationDTO) {
        User user = userService.getUserById(contactJourneyCreationDTO.getUser());
        Company company = companyService.getCompanyById(contactJourneyCreationDTO.getCompany());
        Campaign campaign = campaignService.getCampaignById(contactJourneyCreationDTO.getCampaign());
        Optional<ContactJourney> contactJourneyOptional = contactJourneyRepository
                .findContactJourneyByCampaignAndCompany(campaign, company);
        if (contactJourneyOptional.isPresent()) {
            ContactJourney contactJourney = contactJourneyOptional.get();
            if (contactJourney.getUser() != null) {
                throw new ResourceExistsException("Contact journey for that company already happened in this campaign");
            } else {
                contactJourney.setUser(user);
                return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
            }
        }
        ContactJourney savedJourney = contactJourneyRepository.save(contactJourneyFromDto(user, company, campaign));
        if (!AccessVerificationBean.isUser(contactJourneyCreationDTO.getUser().toString())) {
            notificationService.notify(user,
                    STR."Zostałeś przypisany do firmy \{company.getName()} w akcji \{campaign.getName()} kliknij by przejść do kontaktu",
                    savedJourney.getId());
        }
        return ContactJourneyDetailsDTO
                .fromContactJourney(savedJourney);
    }

    @Transactional
    public ContactJourneyDetailsDTO updateJourneyStatus(UUID id, ContactJourneyStatusUpdatingDTO contactJourneyStatusUpdatingDTO) {
        ContactJourney contactJourney = getJourneyById(id);
        if (AccessVerificationBean.hasRole(Authority.JOURNEY_MODIFICATION_FOR_OTHERS.getValue()) ||
                (contactJourney.getUser() != null && contactJourney.getUser().getId().equals(SecurityUtils.getUserId()))) {
            contactJourney.setContactStatus(contactJourneyStatusUpdatingDTO.getContactStatus());
            notifyOnJourneyModification(contactJourney);
            return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
        } else {
            throw new BadCredentialsException("Insufficient privileges to modify someone elses journey");
        }
    }

    @Transactional
    public ContactJourneyDetailsDTO addContactEvent(UUID id, ContactEventCreationDTO contactEventCreationDTO) {
        ContactJourney contactJourney = getJourneyById(id);
        if (AccessVerificationBean.hasRole(Authority.JOURNEY_MODIFICATION_FOR_OTHERS.getValue()) ||
                (contactJourney.getUser() != null && contactJourney.getUser().getId().equals(SecurityUtils.getUserId()))) {
            contactJourney.getContactEvents().add(contactEventFromDTO(contactJourney, contactEventCreationDTO));
            contactJourney.setContactStatus(contactEventCreationDTO.getContactStatus());
            notifyOnJourneyModification(contactJourney);
            return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
        } else {
            throw new BadCredentialsException("Insufficient privileges to modify someone elses journey");
        }
    }

    @Transactional
    public ContactJourneyDetailsDTO addComment(UUID id, CommentCreationDTO commentCreationDTO) {
        ContactJourney contactJourney = getJourneyById(id);
        contactJourney.getComments().add(commentFromDTO(contactJourney, commentCreationDTO));
        if (!AccessVerificationBean.isUser(contactJourney.getUser().getId().toString())) {
            notificationService.notify(contactJourney.getUser(),
                    STR."Twój kontakt z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()} ma nowy komentarz, kliknij by przejśc do kontaktu",
                    contactJourney.getId());
        }
        Set<User> usersToNotify = new HashSet<>();
        contactJourney.getComments().forEach(comment -> {
            if (!AccessVerificationBean.isUser(comment.getUser().getId().toString())
                    && !comment.getUser().getId().equals(contactJourney.getUser().getId())) {
                usersToNotify.add(comment.getUser());
            }
        });
        usersToNotify.forEach(user -> {
            notificationService.notify(user,
                    STR."Nowy komentarz w kontakcie z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()}, kliknij by przejśc do kontaktu",
                    contactJourney.getId());
        });
        return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
    }

    @Transactional
    public ContactJourneyDetailsDTO finishJourney(UUID id) {
        ContactJourney contactJourney = getJourneyById(id);
        if (AccessVerificationBean.hasRole(Authority.JOURNEY_MODIFICATION_FOR_OTHERS.getValue()) ||
                (contactJourney.getUser() != null && contactJourney.getUser().getId().equals(SecurityUtils.getUserId()))) {
            contactJourney.setFinished(true);
            notifyOnJourneyModification(contactJourney);
            return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
        } else {
            throw new BadCredentialsException("Insufficient privileges to modify someone elses journey");
        }
    }

    @Transactional
    public ContactJourneyDetailsDTO removeUserFromJourney(UUID id) {
        ContactJourney contactJourney = getJourneyById(id);
        if (contactJourney.getUser().getId().equals(SecurityUtils.getUserId()) ||
                AccessVerificationBean.hasRole(Authority.JOURNEY_MODIFICATION_FOR_OTHERS.getValue())) {
            contactJourney.setUser(null);
            return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
        } else {
            throw new BadCredentialsException("Insufficient privileges to modify someone elses journey");
        }
    }

    public ContactJourneyDetailsDTO getJourneyDTOById(UUID id) {
        Optional<ContactJourney> journeyOptional = contactJourneyRepository.findContactJourneyById(id);
        if (journeyOptional.isEmpty()) {
            throw new ResourceNotFoundException(STR."""
                    ContactJourney with id \{id} does not exist""");
        }
        return ContactJourneyDetailsDTO.fromContactJourney(journeyOptional.get());
    }

    public Top10DTO getTop10(UUID campaignId) {
        Campaign campaign = campaignService.getCampaignById(campaignId);
        Map<String, Integer> top10 = new LinkedHashMap<>();

        List<ContactJourney> journeys = contactJourneyRepository.findAllByCampaign(campaign);
        journeys.forEach(journey -> {
            if (journey.getUser() == null) {
                return;
            }
            top10.computeIfAbsent(journey.getUser().getFullName(), _ -> 0);
            top10.computeIfPresent(journey.getUser().getFullName(), (_, count) -> count + 1);
        });

        MapUtils.sortByValue(top10);

        Top10DTO top10DTO = new Top10DTO();
        for (int i = 0; i < 10; i++) {
            if (i >= top10.size()) {
                continue;
            }
            String fullName = top10.keySet().stream().toList().get(i);
            int count = top10.get(fullName);
            top10DTO.addUser(fullName, count);
        }

        return top10DTO;
    }

    private ContactJourney getJourneyById(UUID id) {
        Optional<ContactJourney> journeyOptional = contactJourneyRepository.findContactJourneyById(id);
        if (journeyOptional.isEmpty()) {
            throw new ResourceNotFoundException(STR."""
                    ContactJourney with id \{id} does not exist""");
        }
        return journeyOptional.get();
    }

    public Page<ContactJourneyListingDTO> getJourneys(Pageable pageable,
                                                      ContactJourneySearch journeySearch) {
        Page<ContactJourney> contactJourneyPage
                = contactJourneyRepository.findAll(new JourneySpecification(journeySearch, entityManager), pageable);
        List<ContactJourney> contactJourneyList = contactJourneyRepository
                .findAllById(contactJourneyPage.getContent().stream().map(ContactJourney::getId).toList());
        return new PageImpl<>(contactJourneyList.stream().map(ContactJourneyListingDTO::fromContactJourney).toList(),
                pageable, contactJourneyPage.getTotalElements());
    }

    private Comment commentFromDTO(ContactJourney contactJourney, CommentCreationDTO commentCreationDTO) {
        return Comment.builder()
                .user(userService.getUserById(SecurityUtils.getUserId()))
                .contactJourney(contactJourney)
                .comment(commentCreationDTO.getComment())
                .date(LocalDateTime.now())
                .build();
    }

    private ContactEvent contactEventFromDTO(ContactJourney contactJourney, ContactEventCreationDTO contactEventCreationDTO) {
        User user = userService.getUserById(contactEventCreationDTO.getUser());
        Optional<ContactPerson> contactPersonOptional = contactPersonRepository.findContactPersonById(contactEventCreationDTO.getContactPerson());

        return ContactEvent.builder()
                .contactPerson(contactPersonOptional.orElse(null))
                .contactJourney(contactJourney)
                .user(user)
                .date(LocalDateTime.now())
                .eventType(contactEventCreationDTO.getContactStatus())
                .description(contactEventCreationDTO.getDescription())
                .build();
    }

    private ContactJourney contactJourneyFromDto(User user,
                                                 Company company,
                                                 Campaign campaign) {
        return ContactJourney.builder()
                .user(user)
                .company(company)
                .campaign(campaign)
                .journeyStart(LocalDateTime.now())
                .contactStatus(ContactStatus.ASSIGNED)
                .comments(new HashSet<>())
                .contactEvents(new HashSet<>())
                .build();
    }

    private void notifyOnJourneyModification(ContactJourney contactJourney) {
        if (!AccessVerificationBean.isUser(contactJourney.getUser().getId().toString())) {
            notificationService.notify(contactJourney.getUser(),
                    STR."Twój kontakt z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()} został zmodyfikowany kliknij by przejść do kontaktu",
                    contactJourney.getId());
        }
    }

}

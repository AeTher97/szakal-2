package org.iaeste.szakal2.services;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.exceptions.ResourceExistsException;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.dto.campaign.ContactJourneySearch;
import org.iaeste.szakal2.models.dto.journey.*;
import org.iaeste.szakal2.models.entities.*;
import org.iaeste.szakal2.repositories.*;
import org.iaeste.szakal2.security.Authority;
import org.iaeste.szakal2.security.utils.AccessVerificationBean;
import org.iaeste.szakal2.security.utils.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Log4j2
public class JourneyService {

    private final ContactJourneyRepository contactJourneyRepository;
    private final UserService userService;
    private final CompanyService companyService;
    private final CampaignService campaignService;
    private final ContactPersonRepository contactPersonRepository;
    private final NotificationService notificationService;
    private final WsNotifyingService wsNotifyingService;
    private final ContactEventRepository contactEventRepository;
    private final CommentRepository commentRepository;
    private final FavouriteJourneyService favouriteJourneyService;

    public JourneyService(ContactJourneyRepository contactJourneyRepository,
                          UserService userService,
                          CompanyService companyService,
                          CampaignService campaignService,
                          ContactPersonRepository contactPersonRepository,
                          NotificationService notificationService,
                          WsNotifyingService wsNotifyingService,
                          ContactEventRepository contactEventRepository,
                          CommentRepository commentRepository, FavouriteJourneyService favouriteJourneyService) {
        this.contactJourneyRepository = contactJourneyRepository;
        this.userService = userService;
        this.companyService = companyService;
        this.campaignService = campaignService;
        this.contactPersonRepository = contactPersonRepository;
        this.notificationService = notificationService;
        this.wsNotifyingService = wsNotifyingService;
        this.contactEventRepository = contactEventRepository;
        this.commentRepository = commentRepository;
        this.favouriteJourneyService = favouriteJourneyService;
        favouriteJourneyService.setJourneyService(this);
    }

    private static boolean isCommentOwner(Comment comment) {
        return comment.getUser().getId().equals(SecurityUtils.getUserId());
    }

    private static boolean isContactEventOwner(ContactEvent contactEvent) {
        return contactEvent.getUser().getId().equals(SecurityUtils.getUserId());
    }

    private static boolean isNotJourneyOwner(ContactJourney contactJourney) {
        return !AccessVerificationBean.isUser(contactJourney.getUser().getId().toString());
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
                    STR."Zostałeś przypisany do firmy \{company.getName()} w akcji \{campaign.getName()}",
                    savedJourney.getId());
        }
        wsNotifyingService.sendUpdateAboutJourneys(contactJourneyCreationDTO.getCampaign());
        wsNotifyingService.sendUpdateAboutSummary(contactJourneyCreationDTO.getCampaign());

        return ContactJourneyDetailsDTO
                .fromContactJourney(savedJourney);
    }

    @Transactional
    public ContactJourneyDetailsDTO updateJourneyStatus(UUID id, ContactJourneyStatusUpdatingDTO contactJourneyStatusUpdatingDTO) {
        ContactJourney contactJourney = getJourneyById(id);

        if (isJourneyOwnerOrCanModifyAllJourneys(contactJourney)) {
            contactJourney.setContactStatus(contactJourneyStatusUpdatingDTO.getContactStatus());

            notifyOwnerOnJourneyModification(contactJourney);

            sendsWsJourneyPageUpdate(id, contactJourney);

            return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
        } else {
            throw new BadCredentialsException("Insufficient privileges to modify someone else's journey");
        }
    }

    @Transactional
    public ContactJourneyDetailsDTO addContactEvent(UUID id, ContactEventCreationDTO contactEventCreationDTO) {
        ContactJourney contactJourney = getJourneyById(id);

        if (isJourneyOwnerOrCanModifyAllJourneys(contactJourney)) {
            contactJourney.getContactEvents().add(contactEventFromDTO(contactJourney, contactEventCreationDTO));
            contactJourney.setContactStatus(contactEventCreationDTO.getContactStatus());
            contactJourney.setLastInteraction(LocalDateTime.now());

            notifyOwnerOnJourneyModification(contactJourney);
            notifyFollowersOnJourneyUpdate(contactJourney, false);

            sendsWsJourneyPageUpdate(id, contactJourney);

            return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
        } else {
            throw new BadCredentialsException("Insufficient privileges to modify someone else's journey");
        }
    }

    @Transactional
    public ContactJourneyDetailsDTO editContactEvent(UUID journeyId, ContactEventEditDTO contactEventEditDTO) {
        ContactJourney contactJourney = getJourneyById(journeyId);
        ContactEvent contactEvent = getContactEventById(contactEventEditDTO.getEventId());

        if (isContactEventOwner(contactEvent)) {
            contactEvent.setDescription(contactEventEditDTO.getDescription());
            contactEvent.setEventType(ContactStatus.valueOf(contactEventEditDTO.getContactStatus()));
            contactEvent.setEdited(true);
            if (contactEventEditDTO.getContactPerson() != null) {
                ContactPerson contactPerson = contactPersonRepository.findById(contactEventEditDTO.getContactPerson())
                        .orElseThrow(() -> new ResourceNotFoundException("The contact person with the given id was not found"));
                contactEvent.setContactPerson(contactPerson);
            } else {
                contactEvent.setContactPerson(null);
            }
            return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
        } else {
            throw new BadCredentialsException("Insufficient permissions to edit the event");
        }
    }

    @Transactional
    public ContactJourneyDetailsDTO addComment(UUID id, CommentCreationDTO commentCreationDTO) {
        ContactJourney contactJourney = getJourneyById(id);
        contactJourney.getComments().add(commentFromDTO(contactJourney, commentCreationDTO));

        notifyOwnerOnJourneyComment(contactJourney);
        notifyFollowersOnJourneyUpdate(contactJourney, true);

        wsNotifyingService.sendUpdateAboutJourney(id);
        return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
    }

    @Transactional
    public ContactJourneyDetailsDTO editComment(UUID journeyId, CommentEditDTO commentEditDTO) {
        ContactJourney contactJourney = getJourneyById(journeyId);
        Comment comment = getCommentById(commentEditDTO.getCommentId());

        if (isCommentOwner(comment)) {
            comment.setCommentValue(commentEditDTO.getComment());
            comment.setEdited(true);
            return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
        } else {
            throw new BadCredentialsException("Insufficient permissions to edit a comment");
        }
    }

    @Transactional
    public ContactJourneyDetailsDTO finishJourney(UUID id) {
        ContactJourney contactJourney = getJourneyById(id);

        if (isJourneyOwnerOrCanModifyAllJourneys(contactJourney)) {
            contactJourney.setFinished(true);

            notifyOwnerOnJourneyFinished(contactJourney);
            notifyFollowersOnJourneyUpdate(contactJourney, false);

            wsNotifyingService.sendUpdateAboutJourney(id);
            return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
        } else {
            throw new BadCredentialsException("Insufficient privileges to modify someone elses journey");
        }
    }

    @Transactional
    public ContactJourneyDetailsDTO reopenJourney(UUID id) {
        ContactJourney contactJourney = getJourneyById(id);

        if (isJourneyOwnerOrCanModifyAllJourneys(contactJourney)) {
            contactJourney.setFinished(false);

            notifyOwnerOnJourneyReopened(contactJourney);
            notifyFollowersOnJourneyUpdate(contactJourney, false);

            wsNotifyingService.sendUpdateAboutJourney(id);
            return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
        } else {
            throw new BadCredentialsException("Insufficient privileges to modify someone elses journey");
        }
    }

    @Transactional
    public ContactJourneyDetailsDTO removeUserFromJourney(UUID id) {
        ContactJourney contactJourney = getJourneyById(id);

        if (isJourneyOwnerOrCanModifyAllJourneys(contactJourney)) {
            contactJourney.setUser(null);

            wsNotifyingService.sendUpdateAboutJourney(id);
            notifyFollowersOnJourneyUpdate(contactJourney, false);

            return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
        } else {
            throw new BadCredentialsException("Insufficient privileges to modify someone else's journey");
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

    public ContactJourney getJourneyById(UUID id) {
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
                = contactJourneyRepository.findAll(new JourneySpecification(journeySearch), pageable);

        List<ContactJourney> contactJourneyList = contactJourneyRepository
                .findAllById(contactJourneyPage.getContent().stream().map(ContactJourney::getId).toList());

        return new PageImpl<>(contactJourneyList.stream().map(ContactJourneyListingDTO::fromContactJourney).toList(),
                pageable, contactJourneyPage.getTotalElements());
    }

    private boolean isJourneyOwnerOrCanModifyAllJourneys(ContactJourney contactJourney) {
        return AccessVerificationBean.hasRole(Authority.JOURNEY_MODIFICATION_FOR_OTHERS.getValue()) ||
                (contactJourney.getUser() != null && contactJourney.getUser().getId().equals(SecurityUtils.getUserId()));
    }

    private void notifyOwnerOnJourneyModification(ContactJourney contactJourney) {
        if (contactJourney.getUser() != null && isNotJourneyOwner(contactJourney)) {
            notificationService.notify(contactJourney.getUser(),
                    STR."Twój kontakt z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()} został zmodyfikowany",
                    contactJourney.getId());
        }
    }

    private void notifyOwnerOnJourneyFinished(ContactJourney contactJourney) {
        if (contactJourney.getUser() != null && isNotJourneyOwner(contactJourney)) {
            notificationService.notify(contactJourney.getUser(),
                    STR."Twój kontakt z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()} został zakończony",
                    contactJourney.getId());
        }
    }

    private void notifyOwnerOnJourneyReopened(ContactJourney contactJourney) {
        if (contactJourney.getUser() != null && isNotJourneyOwner(contactJourney)) {
            notificationService.notify(contactJourney.getUser(),
                    STR."Twój kontakt z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()} został ponwnie otwarty",
                    contactJourney.getId());
        }
    }

    private void notifyOwnerOnJourneyComment(ContactJourney contactJourney) {
        if (contactJourney.getUser() != null && isNotJourneyOwner(contactJourney)) {
            notificationService.notify(contactJourney.getUser(),
                    STR."""
                    Twój kontakt z firmą \{contactJourney.getCompany().getName()}
                    w akcji \{contactJourney.getCampaign().getName()} ma nowy komentarz
                    """,
                    contactJourney.getId());
        }
    }

    private void notifyFollowersOnJourneyUpdate(ContactJourney contactJourney, boolean addedComment) {
        Set<User> usersToNotify = new HashSet<>();

        contactJourney.getComments().forEach(comment -> {
            if (!isCommentOwner(comment)
                    && !comment.getUser().getId().equals(contactJourney.getUser().getId())) {
                usersToNotify.add(comment.getUser());
            }
        });

        favouriteJourneyService.getFavouriteJourneysForJourney(contactJourney.getId())
                .forEach(favouriteJourney -> {
                    if (favouriteJourney.getUserId() != SecurityUtils.getUserId()) {
                        usersToNotify.add(userService.getUserById(favouriteJourney.getUserId()));
                    }
                });

        usersToNotify.forEach(user -> {
            notificationService.notify(user,
                    STR."""
                    \{addedComment ? "Nowy komentarz" : "Nowa zmiana"} w kontakcie z firmą
                     \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()}
                    """,
                    contactJourney.getId());
        });
    }

    private void sendsWsJourneyPageUpdate(UUID id, ContactJourney contactJourney) {
        wsNotifyingService.sendUpdateAboutJourney(id);
        wsNotifyingService.sendUpdateAboutJourneys(contactJourney.getCampaignId());
    }

    private Comment commentFromDTO(ContactJourney contactJourney, CommentCreationDTO commentCreationDTO) {
        return Comment.builder()
                .user(userService.getUserById(SecurityUtils.getUserId()))
                .contactJourney(contactJourney)
                .commentValue(commentCreationDTO.getComment())
                .date(LocalDateTime.now())
                .build();
    }

    private Comment getCommentById(UUID commentId) {
        Optional<Comment> commentOptional = commentRepository.findCommentById(commentId);

        if (commentOptional.isEmpty()) {
            throw new ResourceNotFoundException(STR."""
                    Comment with id \{commentId} does not exist""");
        }
        return commentOptional.get();
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

    private ContactEvent getContactEventById(UUID eventId) {
        Optional<ContactEvent> contactEventOptional = contactEventRepository.findContactEventById(eventId);

        if (contactEventOptional.isEmpty()) {
            throw new ResourceNotFoundException(STR."""
                    ContactEvent with id \{eventId} does not exist""");
        }
        return contactEventOptional.get();
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
}

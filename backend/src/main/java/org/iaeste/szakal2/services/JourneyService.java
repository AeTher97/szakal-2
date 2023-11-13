package org.iaeste.szakal2.services;

import org.iaeste.szakal2.exceptions.ResourceExistsException;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.dto.journey.CommentCreationDTO;
import org.iaeste.szakal2.models.dto.journey.ContactEventDTO;
import org.iaeste.szakal2.models.dto.journey.ContactJourneyCreationDTO;
import org.iaeste.szakal2.models.dto.journey.ContactJourneyStatusUpdatingDTO;
import org.iaeste.szakal2.models.entities.*;
import org.iaeste.szakal2.repositories.ContactJourneyRepository;
import org.iaeste.szakal2.repositories.ContactPersonRepository;
import org.iaeste.szakal2.security.utils.SecurityUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class JourneyService {

    private final ContactJourneyRepository contactJourneyRepository;
    private final UserService userService;
    private final CompanyService companyService;
    private final CampaignService campaignService;
    private final ContactPersonRepository contactPersonRepository;

    public JourneyService(ContactJourneyRepository contactJourneyRepository,
                          UserService userService,
                          CompanyService companyService,
                          CampaignService campaignService, ContactPersonRepository contactPersonRepository) {
        this.contactJourneyRepository = contactJourneyRepository;
        this.userService = userService;
        this.companyService = companyService;
        this.campaignService = campaignService;
        this.contactPersonRepository = contactPersonRepository;
    }

    public ContactJourney createJourney(ContactJourneyCreationDTO contactJourneyCreationDTO) {
        User user = userService.getUserById(contactJourneyCreationDTO.getUser());
        Company company = companyService.getCompanyById(contactJourneyCreationDTO.getCompany());
        Campaign campaign = campaignService.getCampaignById(contactJourneyCreationDTO.getCampaign());
        if (contactJourneyRepository.findContactJourneyByCampaignAndUserAndCompany(campaign, user, company).isPresent()) {
            throw new ResourceExistsException("Contact journey for that company already happended in this campaign");
        }
        return contactJourneyRepository.save(contactJourneyFromDto(contactJourneyCreationDTO,
                user, company, campaign));
    }

    public ContactJourney updateJourneyStatus(UUID id, ContactJourneyStatusUpdatingDTO contactJourneyStatusUpdatingDTO) {
        ContactJourney contactJourney = getJourneyById(id);
        contactJourney.setContactStatus(contactJourneyStatusUpdatingDTO.getContactStatus());
        return contactJourneyRepository.save(contactJourney);
    }

    public ContactJourney addContactEventDTO(UUID id, ContactEventDTO contactEventDTO) {
        ContactJourney contactJourney = getJourneyById(id);
        contactJourney.getContactEvents().add(contactEventFromDTO(contactJourney, contactEventDTO));
        return contactJourneyRepository.save(contactJourney);
    }

    public ContactJourney addComment(UUID id, CommentCreationDTO commentCreationDTO) {
        ContactJourney contactJourney = getJourneyById(id);
        contactJourney.getComments().add(commentFromDTO(contactJourney, commentCreationDTO));
        return contactJourneyRepository.save(contactJourney);
    }

    public ContactJourney getJourneyById(UUID id) {
        Optional<ContactJourney> journeyOptional = contactJourneyRepository.findContactJourneyById(id);
        if (journeyOptional.isEmpty()) {
            throw new ResourceNotFoundException(STR. """
                    ContactJourney with id \{ id } does not exist""" );
        }
        return journeyOptional.get();
    }

    public void truncate() {
        contactJourneyRepository.deleteAll();
    }

    private Comment commentFromDTO(ContactJourney contactJourney, CommentCreationDTO commentCreationDTO) {
        return Comment.builder()
                .user(userService.getUserById(SecurityUtils.getUserId()))
                .contactJourney(contactJourney)
                .comment(commentCreationDTO.getComment())
                .date(LocalDateTime.now())
                .build();
    }

    private ContactEvent contactEventFromDTO(ContactJourney contactJourney, ContactEventDTO contactEventDTO) {
        User user = userService.getUserById(contactEventDTO.getUser());
        Optional<ContactPerson> contactPersonOptional = contactPersonRepository.findContactPersonById(contactEventDTO.getContactPerson());
        if (contactPersonOptional.isEmpty()) {
            throw new ResourceNotFoundException("Contact person with id "
                    + contactEventDTO.getContactPerson() + " does not exist");
        }
        return ContactEvent.builder()
                .contactPerson(contactPersonOptional.get())
                .contactJourney(contactJourney)
                .user(user)
                .date(LocalDateTime.now())
                .eventType(contactEventDTO.getEventType())
                .description(contactEventDTO.getDescription())
                .subject(contactEventDTO.getSubject())
                .build();
    }

    private ContactJourney contactJourneyFromDto(ContactJourneyCreationDTO contactJourneyCreationDTO,
                                                 User user,
                                                 Company company,
                                                 Campaign campaign) {
        return ContactJourney.builder()
                .user(user)
                .company(company)
                .campaign(campaign)
                .build();
    }
}

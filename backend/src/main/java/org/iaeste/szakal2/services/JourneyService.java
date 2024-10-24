package org.iaeste.szakal2.services;

import jakarta.transaction.Transactional;
import org.iaeste.szakal2.exceptions.ResourceExistsException;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.dto.journey.*;
import org.iaeste.szakal2.models.entities.*;
import org.iaeste.szakal2.repositories.ContactJourneyRepository;
import org.iaeste.szakal2.repositories.ContactPersonRepository;
import org.iaeste.szakal2.security.Authority;
import org.iaeste.szakal2.security.utils.AccessVerificationBean;
import org.iaeste.szakal2.security.utils.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
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
        return ContactJourneyDetailsDTO
                .fromContactJourney(contactJourneyRepository.save(contactJourneyFromDto(user, company, campaign)));
    }

    @Transactional
    public ContactJourneyDetailsDTO updateJourneyStatus(UUID id, ContactJourneyStatusUpdatingDTO contactJourneyStatusUpdatingDTO) {
        ContactJourney contactJourney = getJourneyById(id);
        if (AccessVerificationBean.hasRole(Authority.JOURNEY_MODIFICATION_FOR_OTHERS.getValue()) ||
                (contactJourney.getUser() != null && contactJourney.getUser().getId().equals(SecurityUtils.getUserId()))) {
            contactJourney.setContactStatus(contactJourneyStatusUpdatingDTO.getContactStatus());
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
            return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
        } else {
            throw new BadCredentialsException("Insufficient privileges to modify someone elses journey");
        }
    }

    @Transactional
    public ContactJourneyDetailsDTO addComment(UUID id, CommentCreationDTO commentCreationDTO) {
        ContactJourney contactJourney = getJourneyById(id);
        contactJourney.getComments().add(commentFromDTO(contactJourney, commentCreationDTO));
        return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
    }

    @Transactional
    public ContactJourneyDetailsDTO finishJourney(UUID id) {
        ContactJourney contactJourney = getJourneyById(id);
        if (AccessVerificationBean.hasRole(Authority.JOURNEY_MODIFICATION_FOR_OTHERS.getValue()) ||
                (contactJourney.getUser() != null && contactJourney.getUser().getId().equals(SecurityUtils.getUserId()))) {
            contactJourney.setFinished(true);
            return ContactJourneyDetailsDTO.fromContactJourney(contactJourneyRepository.save(contactJourney));
        } else {
            throw new BadCredentialsException("Insufficient privileges to modify someone elses journey");
        }
    }

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

    private ContactJourney getJourneyById(UUID id) {
        Optional<ContactJourney> journeyOptional = contactJourneyRepository.findContactJourneyById(id);
        if (journeyOptional.isEmpty()) {
            throw new ResourceNotFoundException(STR."""
                    ContactJourney with id \{id} does not exist""");
        }
        return journeyOptional.get();
    }

    public Page<ContactJourneyListingDTO> getJourneys(UUID userId, UUID campaignID, Pageable pageable) {
        User user = userService.getUserById(userId);
        Campaign campaign = campaignService.getCampaignById(campaignID);
        Page<ContactJourney> contactJourneyPage
                = contactJourneyRepository.findAllByUserAndCampaignOrderByJourneyStart(user, campaign, pageable);
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
}

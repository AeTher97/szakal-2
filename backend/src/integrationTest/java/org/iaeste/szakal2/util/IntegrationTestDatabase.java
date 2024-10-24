package org.iaeste.szakal2.util;

import lombok.Getter;
import org.hibernate.Hibernate;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.entities.*;
import org.iaeste.szakal2.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

@Component
@Getter
public class IntegrationTestDatabase {

    @Autowired
    protected AccessRightRepository accessRightRepository;
    @Autowired
    protected ContactJourneyRepository contactJourneyRepository;
    @Autowired
    protected UsersRepository usersRepository;
    @Autowired
    protected CommentRepository commentRepository;
    @Autowired
    protected RolesRepository rolesRepository;
    @Autowired
    protected CampaignRepository campaignRepository;
    @Autowired
    protected CompanyRepository companyRepository;
    @Autowired
    protected CategoryRepository categoryRepository;
    @Autowired
    protected ContactJourneyRepository journeyRepository;
    @Autowired
    protected ContactPersonRepository contactPersonRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public AccessRight createAccessRight(String accessRight) {
        return accessRightRepository.save(AccessRight.builder()
                .code(accessRight)
                .description(accessRight)
                .build());
    }

    @Transactional
    public User createUser(String email,
                           String username,
                           String password,
                           List<String> accessRights) {
        List<UUID> accessRightList = accessRights.stream().map(accessRightString ->
                createAccessRight(accessRightString).getId()).toList();

        if (usersRepository.findUserByEmailIgnoreCase(email).isPresent()) {
            User user = usersRepository.findUserByEmailIgnoreCase(email).get();
            user.getRoles().iterator().next().getAccessRights().addAll(accessRightList.stream().map(accessRight ->
                    accessRightRepository.findAccessRightById(accessRight).get()).toList());
            return usersRepository.save(user);
        }


        Role role = createRole(accessRightList, username, username);
        return usersRepository.save(User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .createdAt(LocalDateTime.now())
                .name(username)
                .surname(username)
                .accepted(true)
                .active(true)
                .roles(new HashSet<>(rolesRepository.findAllById(List.of(role.getId()))))
                .build());
    }

    public Role createRole(List<UUID> accessRightList, String roleName, String description) {
        List<AccessRight> accessRights = accessRightList.stream().map(accessRight -> {
            if (accessRightRepository.findAccessRightById(accessRight).isPresent()) {
                return accessRightRepository.findAccessRightById(accessRight).get();
            } else {
                throw new ResourceNotFoundException("Access right with id " + accessRight + " does not exist");
            }
        }).toList();
        return rolesRepository.save(Role.builder()
                .name(roleName)
                .description(description)
                .accessRights(accessRights)
                .build());
    }

    @Transactional
    public Campaign createCampaign(String name, LocalDate startDate) {
        return campaignRepository.save(Campaign.builder()
                .name(name)
                .startDate(startDate)
                .build());
    }

    @Transactional
    public Company createCompany(String name) {
        return createCompany(name, true);
    }


    @Transactional
    public Company createCompany(String name, boolean addContactPerson) {
        if (usersRepository.findAll().isEmpty()) {
            createUser("dummy@gmail.com", "dummy", "dummy", List.of());
        }
        SecurityContextHolder.setContext(new SecurityContext() {
            @Override
            public Authentication getAuthentication() {
                return new UsernamePasswordAuthenticationToken(usersRepository.findAll().get(0).getId(), "test");
            }

            @Override
            public void setAuthentication(Authentication authentication) {
                //nothing
            }
        });

        Company company = companyRepository.save(Company.builder()
                .name(name)
                .address(Address.builder().street("Reymonta").city("Krakow").postalCode("30-123").build())
                .phone("+320")
                .fax("+49")
                .www("stronka")
                .email("email@gami.com")
                .updateDate(LocalDateTime.now())
                .insertDate(LocalDateTime.now())
                .contactPeople(new HashSet<>())
                .updatedBy(usersRepository.findAll().get(0))
                .build());
        if (addContactPerson) {
            company.getContactPeople().add(ContactPerson.builder()
                    .company(company)
                    .name("Asia Kowalska")
                    .phone("+481239321")
                    .position("HR admin")
                    .email("asia@firma.com")
                    .comment("HRy...")
                    .build());
            company = companyRepository.save(company);
        }
        return company;
    }


    @Transactional
    public CompanyCategory createCategory(String name) {
        return categoryRepository.save(CompanyCategory.builder()
                .name(name)
                .build());
    }

    @Transactional
    public ContactJourney createContactJourney() {
        User user = createUser("test_user@szakal.org", "company-creator", "password",
                List.of("company_modification"));
        Campaign campaign = createCampaign("PPP2023", LocalDate.now());
        Company company = createCompany("IAESTE");
        ContactJourney contactJourney = journeyRepository.save(ContactJourney
                .builder()
                .campaign(campaign)
                .user(user)
                .company(company)
                .journeyStart(LocalDateTime.now())
                .contactStatus(ContactStatus.ASSIGNED)
                .build());
        contactJourney.setCompany(company);
        return contactJourney;
    }

    @Transactional
    public ContactJourney getContactJourney(UUID id) {
        ContactJourney contactJourney = contactJourneyRepository
                .findContactJourneyById(id).get();
        Hibernate.initialize(contactJourney.getContactEvents());
        Hibernate.initialize(contactJourney.getComments());
        return contactJourney;
    }

    @Transactional
    public Company getCompany(UUID id) {
        Company company = companyRepository.findCompanyById(id).get();
        Hibernate.initialize(company.getContactPeople());
        return company;
    }
}

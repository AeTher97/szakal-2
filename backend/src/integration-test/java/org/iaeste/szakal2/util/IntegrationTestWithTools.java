package org.iaeste.szakal2.util;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.http.Header;
import org.iaeste.szakal2.exceptions.UserNotFoundException;
import org.iaeste.szakal2.models.AccessRight;
import org.iaeste.szakal2.models.dto.campaign.CampaignCreationDTO;
import org.iaeste.szakal2.models.dto.category.CompanyCategoryCreationDTO;
import org.iaeste.szakal2.models.dto.company.CompanyCreationDTO;
import org.iaeste.szakal2.models.dto.company.ContactPersonCreationDTO;
import org.iaeste.szakal2.models.dto.journey.ContactJourneyCreationDTO;
import org.iaeste.szakal2.models.dto.role.RoleCreationDto;
import org.iaeste.szakal2.models.dto.user.UserCreationDTO;
import org.iaeste.szakal2.models.dto.user.UserRoleModificationDTO;
import org.iaeste.szakal2.models.entities.*;
import org.iaeste.szakal2.repositories.AccessRightRepository;
import org.iaeste.szakal2.repositories.CommentRepository;
import org.iaeste.szakal2.repositories.UsersRepository;
import org.iaeste.szakal2.services.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public abstract class IntegrationTestWithTools extends IntegrationTest {

    @Autowired
    protected RoleService roleService;
    @Autowired
    protected AccessRightRepository accessRightRepository;
    @Autowired
    protected UserService userService;
    @Autowired
    protected UsersRepository usersRepository;
    @Autowired
    protected CompanyService companyService;
    @Autowired
    protected CampaignService campaignService;
    @Autowired
    protected CategoryService categoryService;
    @Autowired
    protected JourneyService journeyService;
    @Autowired
    protected CommentRepository commentRepository;

    @BeforeEach
    public void cleanUpBefore() {
        cleanUp();
    }

    @AfterEach
    public void CleanUpAfter() {
        cleanUp();
    }

    protected void cleanUp() {
        commentRepository.truncate();
        journeyService.truncate();
        companyService.truncate();
        userService.truncate();
        campaignService.truncate();
        roleService.truncate();
        accessRightRepository.deleteAll();
        categoryService.truncate();
    }

    protected AccessRight createAccessRight(String accessRight) {
        return accessRightRepository.save(AccessRight.builder()
                .code(accessRight)
                .description(accessRight)
                .build());
    }

    protected User createUser(String email,
                              String username,
                              String password,
                              List<String> accessRights) {
        List<UUID> accessRightList = accessRights.stream().map(accessRightString ->
                createAccessRight(accessRightString).getId()).toList();

        try {
            return userService.getUserByEmail(email);
        } catch (UserNotFoundException e) {
            //continue
        }

        Role role = createRole(accessRightList, username, username);
        UUID userId = userService.registerUser(UserCreationDTO.builder()
                .email(email)
                .password(password)
                .repeatPassword(password)
                .username(username)
                .name(username)
                .surname(username)
                .build()).getId();
        userService.modifyUserRoles(userId, UserRoleModificationDTO.builder()
                .roles(List.of(role.getId()))
                .build());
        return userService.getUserById(userId);
    }

    protected Role createRole(List<UUID> accessRightList, String roleName, String description) {
        return roleService.createRole(RoleCreationDto.builder()
                .accessRights(accessRightList)
                .name(roleName.toUpperCase())
                .description(description)
                .build());
    }

    protected io.restassured.specification.RequestSpecification withAdminAuth() {
        createUser("administrator@szakal.org",
                "administrator",
                "administrator",
                List.of("role_modification"));
        String authToken = getToken("administrator@szakal.org", "administrator");
        return RestAssured.given()
                .header(new Header("Authorization", "Bearer " + authToken));
    }

    protected io.restassured.specification.RequestSpecification withAccessRights(String... accessRights) {
        createUser("test_user@szakal.org",
                "test_user",
                "test_user",
                Arrays.stream(accessRights).toList());

        String authToken = getToken("test_user@szakal.org", "test_user");
        return RestAssured.given()
                .header(new Header("Authorization", "Bearer " + authToken));
    }

    protected String getToken(String email, String password) {
        return RestAssured.given()
                .contentType(ContentType.MULTIPART)
                .multiPart("username", email)
                .multiPart("password", password)
                .when()
                .post("/api/login")
                .then()
                .statusCode(200)
                .extract()
                .path("authToken");
    }

    protected Campaign createCampaign(String name, LocalDate startDate) {
        return campaignService.createCampaign(CampaignCreationDTO.builder()
                .name(name)
                .startDate(startDate)
                .build());
    }

    protected Company createCompany(String name) {
        return createCompany(name, true);
    }

    protected Company createCompany(String name, boolean addContactPerson) {
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
        Company company = companyService.createCompany(CompanyCreationDTO.builder()
                .name(name)
                .address(Address.builder().street("Reymonta").city("Krakow").postalCode("30-123").build())
                .phone("+320")
                .fax("+49")
                .www("stronka")
                .email("email@gami.com")
                .build());

        if (addContactPerson) {
            return companyService.addContactPerson(company.getId(),
                    ContactPersonCreationDTO.builder()
                            .name("Asia Kowalska")
                            .phone("+481239321")
                            .position("HR admin")
                            .email("asia@firma.com")
                            .comment("HRy...")
                            .build());
        } else {
            return company;
        }
    }

    protected CompanyCategory createCategory(String name) {
        return categoryService.createCategory(CompanyCategoryCreationDTO.builder()
                .name(name)
                .build());
    }

    protected ContactJourney createContactJourney() {
        User user = createUser("company-creator@gmail.com", "company-creator", "password",
                List.of("company_modification"));
        Campaign campaign = createCampaign("PPP2023", LocalDate.now());
        Company company = createCompany("IAESTE");
        return journeyService.createJourney(ContactJourneyCreationDTO
                .builder()
                .campaign(campaign.getId())
                .user(user.getId())
                .company(company.getId())
                .build());
    }
}

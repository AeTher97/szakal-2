package org.iaeste.szakal2.controllers;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.exceptions.ResetTokenExpiredException;
import org.iaeste.szakal2.exceptions.UserNotFoundException;
import org.iaeste.szakal2.models.dto.SzakalSort;
import org.iaeste.szakal2.models.dto.user.*;
import org.iaeste.szakal2.models.entities.ProfilePicture;
import org.iaeste.szakal2.security.utils.AccessVerificationBean;
import org.iaeste.szakal2.services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@Log4j2
public class UsersController {

    private final UserService userService;

    public UsersController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping
    public ResponseEntity<Void> registerUser(@RequestBody @Valid UserCreationDTO createUserDto) {
        log.info("Registering user");
        userService.registerUser(createUserDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @PreAuthorize("hasAuthority(@authorityBean.userViewing())")
    public Page<UserDTO> searchAllUsers(@RequestParam(defaultValue = "10") int pageSize,
                                        @RequestParam int pageNumber,
                                        @RequestParam(required = false) String searchName,
                                        @RequestParam(required = false) String searchCommittee,
                                        @RequestParam(required = false) String searchRole,
                                        @RequestParam(required = false) String sort) {
        return userService.getUsersWithSearch(Pageable.ofSize(pageSize).withPage(pageNumber),
                UserSearchDTO.builder()
                        .name(searchName)
                        .surname(searchName)
                        .committee(searchCommittee)
                        .role(searchRole)
                        .szakalSort(sort == null ? null : SzakalSort.fromString(sort))
                        .build());
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority(@authorityBean.journeyCreationForOthers()) " +
            "or hasAuthority(@authorityBean.userGroupModification())")
    public List<UserMinimalDTO> searchUsers(@RequestParam String phrase) {
        return userService.searchUsers(phrase);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority(@authorityBean.userViewing()) or @accessVerificationBean.isUser(#id.toString())")
    public UserDTO getUser(@PathVariable("id") UUID id) {
        return userService.getUserDTOById(id);
    }

    @GetMapping("/{id}/picture")
    public ResponseEntity<byte[]> getProfilePicture(@PathVariable("id") UUID id) {
        return ResponseEntity.ok().contentType(MediaType.valueOf(MediaType.IMAGE_JPEG_VALUE))
                .body(userService.getProfilePicture(id));
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasAuthority(@authorityBean.userRoleGranting())")
    public UserDTO updateUserRoles(@PathVariable("id") UUID id,
                                   @RequestBody UserRoleModificationDTO userRoleModificationDTO) {
        return userService.modifyUserRoles(id, userRoleModificationDTO);
    }

    @PutMapping(value = "/{id}/picture")
    @PreAuthorize("@accessVerificationBean.isUser(#id.toString())")
    public ProfilePicture updateUserProfilePicture(@PathVariable("id") UUID id,
                                                   @ModelAttribute PictureUploadDTO pictureUploadDTO) throws IOException {
        return userService.updatePicture(pictureUploadDTO);
    }


    @PutMapping("/{id}/accept")
    @PreAuthorize("hasAuthority(@authorityBean.userAcceptance())")
    public UserDTO acceptUser(@PathVariable("id") UUID id) {
        return userService.acceptUser(id);
    }


    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority(@authorityBean.userManagement())")
    public UserDTO updateUserStatus(@PathVariable("id") UUID id, @RequestBody UpdateUserStatusDTO updateUserStatusDTO) {
        return userService.updateUserStatus(id, updateUserStatusDTO);
    }

    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable("id") UUID id, @RequestBody @Valid UserUpdateDTO userUpdateDTO) {
        if (AccessVerificationBean.isUser(id.toString())) {
            return userService.updateUser(id, userUpdateDTO);
        } else {
            throw new BadCredentialsException("Cannot modify user different that yourself");
        }
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("@accessVerificationBean.isUser(#id.toString())")
    public UserDTO changePassword(@PathVariable("id") UUID id,
                                  @RequestBody @Valid UserPasswordChangingDTO userPasswordChangingDTO) {
        return userService.changePassword(id, userPasswordChangingDTO);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Object> sendResetCode(@Valid @RequestBody StartPasswordResetDTO startPasswordResetDTO) {
        log.info("Initiating password reset for " + startPasswordResetDTO.getEmail());
        try {
            userService.sendResetCode(startPasswordResetDTO);
        } catch (Exception e) {
            log.info("Password reset " + e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password-set-new")
    public ResponseEntity<Object> resetPassword(@Valid @RequestBody PasswordResetDTO passwordResetDTO) {
        try {
            userService.resetPassword(passwordResetDTO);
        } catch (ResetTokenExpiredException | UserNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.info("Password reset: " + e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/confirm-email")
    public ResponseEntity<Object> confirmEmail(@Valid @RequestBody RegisterConfirmDTO registerConfirmDTO) {
        try {
            userService.confirmEmail(registerConfirmDTO);
        } catch (ResetTokenExpiredException | UserNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.info("Confirm registration ", e);
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority(@authorityBean.userAcceptance())")
    public ResponseEntity<Object> deleteUserIfNotAccepted(@PathVariable("id") UUID id) {
        userService.deleteUserIfNotAccepted(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/add-push-token")
    @PreAuthorize("@accessVerificationBean.isUser(#id.toString())")
    public void addPushNotificationToken(@PathVariable("id") UUID id,
                                         @RequestBody @Valid PushNotificationSubscriptionDTO pushNotificationSubscriptionDTO) {
        userService.addPushNotificationToken(id, pushNotificationSubscriptionDTO);
    }

}

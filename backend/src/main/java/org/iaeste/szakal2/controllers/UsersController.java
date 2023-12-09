package org.iaeste.szakal2.controllers;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.exceptions.ResetTokenExpiredException;
import org.iaeste.szakal2.exceptions.UserNotFoundException;
import org.iaeste.szakal2.models.dto.user.*;
import org.iaeste.szakal2.security.utils.AccessVerificationBean;
import org.iaeste.szakal2.services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Object> registerUser(@RequestBody @Valid UserCreationDTO createUserDto) {
        log.info("Registering user");
        return ResponseEntity.ok(userService.registerUser(createUserDto));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('user_viewing')")
    public Page<UserDTO> getUsers(@RequestParam(defaultValue = "10") int pageSize, @RequestParam int pageNumber) {
        return userService.getAllUsers(Pageable.ofSize(pageSize).withPage(pageNumber));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('user_viewing') or accessVerificationBean.isUser(#id.toString())")
    public UserDTO getUser(@PathVariable("id") UUID id) {
        return userService.getUserDTOById(id);
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasAuthority('user_role_granting')")
    public UserDTO updateUserRoles(@PathVariable("id") UUID id,
                                   @RequestBody UserRoleModificationDTO userRoleModificationDTO) {
        return userService.modifyUserRoles(id, userRoleModificationDTO);
    }

    @PutMapping("/{id}/accept")
    @PreAuthorize("hasAuthority('user_acceptance')")
    public UserDTO acceptUser(@PathVariable("id") UUID id) {
        return userService.acceptUser(id);
    }


    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('user_management')")
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

}

package org.iaeste.szakal2.controller;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.dto.user.UserCreationDTO;
import org.iaeste.szakal2.models.dto.user.UserDTO;
import org.iaeste.szakal2.models.dto.user.UserPasswordChangingDTO;
import org.iaeste.szakal2.models.dto.user.UserRoleModificationDTO;
import org.iaeste.szakal2.services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public Page<UserDTO> getUsers(@RequestParam(defaultValue = "10") int pageSize, @RequestParam int pageNumber){
        return userService.getAllUsers(Pageable.ofSize(pageSize).withPage(pageNumber));
    }

    @GetMapping("/{id}")
    public UserDTO getUser(@PathVariable("id") UUID id) {
        return userService.getUserDTOById(id);
    }

    @PutMapping("/{id}/roles")
    public UserDTO updateUserRoles(@PathVariable("id") UUID id,
                                   @RequestBody UserRoleModificationDTO userRoleModificationDTO){
        return userService.modifyUserRoles(id, userRoleModificationDTO);
    }

    @PutMapping("/{id}/accept")
    public UserDTO acceptUser(@PathVariable("id") UUID id){
        return userService.acceptUser(id);
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("@accessVerificationBean.isUser(#id.toString())")
    public UserDTO changePassword(@PathVariable("id") UUID id,
                                  @RequestBody @Valid UserPasswordChangingDTO userPasswordChangingDTO){
        return userService.changePassword(id, userPasswordChangingDTO);
    }

}

package org.iaeste.szakal2.controller;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.dto.user.UserCreationDTO;
import org.iaeste.szakal2.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@Log4j2
public class UsersController {

    private final UserService userService;

    public UsersController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping
    public ResponseEntity<Object> createUser(@RequestBody @Valid UserCreationDTO createUserDto) {
        log.info("Creating user");
        return ResponseEntity.ok(userService.registerUser(createUserDto));
    }

}

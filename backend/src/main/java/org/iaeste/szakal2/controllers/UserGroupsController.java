package org.iaeste.szakal2.controllers;

import org.iaeste.szakal2.models.dto.UserGroupModificationDTO;
import org.iaeste.szakal2.models.dto.user.UserGroupReadingDTO;
import org.iaeste.szakal2.services.UserGroupService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/groups")
public class UserGroupsController {

    private final UserGroupService userGroupService;

    public UserGroupsController(UserGroupService userGroupService) {
        this.userGroupService = userGroupService;
    }

    @PostMapping
    public UserGroupModificationDTO createUserGroup(@RequestBody UserGroupModificationDTO userGroup) {
        return UserGroupModificationDTO.fromEntity(userGroupService.createUserGroup(userGroup));
    }

    @GetMapping("")
    public List<UserGroupModificationDTO> getUserGroups() {
        return userGroupService.getUserGroups().stream().map(UserGroupModificationDTO::fromEntity).toList();
    }

    @GetMapping("/{id}")
    public UserGroupReadingDTO getUserGroup(@PathVariable(name = "id") UUID id) {
        return UserGroupReadingDTO.fromEntity(userGroupService.getUserGroup(id));
    }

    @PutMapping("/{id}")
    public UserGroupReadingDTO editUserGroup(@PathVariable(name = "id") UUID id, @RequestBody UserGroupModificationDTO userGroup) {
        return UserGroupReadingDTO.fromEntity(userGroupService.editUserGroup(id, userGroup));
    }

    @DeleteMapping("/{id}")
    public void deleteUserGroup(@PathVariable(name = "id") UUID id) {
        userGroupService.deleteUserGroup(id);
    }
}

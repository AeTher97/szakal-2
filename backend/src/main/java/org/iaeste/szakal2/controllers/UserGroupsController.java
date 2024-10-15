package org.iaeste.szakal2.controllers;

import org.iaeste.szakal2.models.dto.user.JoinGroupDTO;
import org.iaeste.szakal2.models.dto.user.UserGroupModificationDTO;
import org.iaeste.szakal2.models.dto.user.UserGroupReadingDTO;
import org.iaeste.szakal2.services.UserGroupService;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAuthority('user_group_modification')")
    public UserGroupModificationDTO createUserGroup(@RequestBody UserGroupModificationDTO userGroup) {
        return UserGroupModificationDTO.fromEntity(userGroupService.createUserGroup(userGroup));
    }

    @PostMapping("/join")
    public void joinGroup(@RequestBody JoinGroupDTO joinGroupDTO) {
        userGroupService.joinUserGroup(joinGroupDTO.getEntryCode());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('user_group_modification')")
    public List<UserGroupModificationDTO> getUserGroups() {
        return userGroupService.getUserGroups().stream().map(UserGroupModificationDTO::fromEntity).toList();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('user_group_modification')")
    public UserGroupReadingDTO getUserGroup(@PathVariable(name = "id") UUID id) {
        return UserGroupReadingDTO.fromEntity(userGroupService.getUserGroup(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('user_group_modification')")
    public UserGroupReadingDTO editUserGroup(@PathVariable(name = "id") UUID id, @RequestBody UserGroupModificationDTO userGroup) {
        return UserGroupReadingDTO.fromEntity(userGroupService.editUserGroup(id, userGroup));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('user_group_modification')")
    public void deleteUserGroup(@PathVariable(name = "id") UUID id) {
        userGroupService.deleteUserGroup(id);
    }
}

package org.iaeste.szakal2.services;

import jakarta.transaction.Transactional;
import org.iaeste.szakal2.exceptions.ResourceExistsException;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.dto.user.UserGroupModificationDTO;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.models.entities.UserGroup;
import org.iaeste.szakal2.repositories.UserGroupRepository;
import org.iaeste.szakal2.security.utils.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class UserGroupService {

    private static final int CODE_LENGTH = 7;

    private final UserGroupRepository userGroupRepository;
    private final UserService userService;
    private final CampaignService campaignService;

    public UserGroupService(UserGroupRepository userGroupRepository, UserService userService,
            CampaignService campaignService) {
        this.userGroupRepository = userGroupRepository;
        this.userService = userService;
        this.campaignService = campaignService;
    }

    @Transactional
    public UserGroup joinUserGroup(String entryCode) {
        UserGroup userGroup = getUserGroup(entryCode);
        User user = userService.getUserById(SecurityUtils.getUserId());
        if(!userGroup.getUserList().contains(user)){
            userGroup.getUserList().add(user);
            user.getUserGroups().add(userGroup);
            userGroupRepository.save(userGroup);
            userService.saveUserList(List.of(user));
        } else {
            throw new ResourceExistsException("Należysz już do tej grupy");
        }
        return userGroup;
    }

    @Transactional
    public UserGroup createUserGroup(UserGroupModificationDTO userGroup) {
        if (userGroupRepository.getUserGroupByName(userGroup.getName()) != null) {
            throw new ResourceExistsException(STR."User group with name \{userGroup.getName()} already exists");
        }
        UserGroup userGroupEntity = new UserGroup();
        userGroupEntity.setName(userGroup.getName());
        String entryCode = generateEntryCode();
        while (userGroupRepository.getUserGroupByEntryCode(entryCode) != null) {
            entryCode = generateEntryCode();
        }
        userGroupEntity.setEntryCode(entryCode);
        List<User> userList = null;

        if (userGroup.getUserList() != null) {
            userList = userService.getUsers(userGroup.getUserList());
            userGroupEntity.setUserList(userList);
        }
        if (userGroup.getCampaignList() != null) {
            userGroupEntity.setCampaignList(campaignService.getCampaigns(userGroup.getUserList()));
        }

        UserGroup createdGroup = userGroupRepository.save(userGroupEntity);

        if (userList != null) {
            userList.forEach(user -> user.getUserGroups().add(createdGroup));
            userService.saveUserList(userList);
        }
        return createdGroup;
    }

    @Transactional
    public UserGroup editUserGroup(UUID id, UserGroupModificationDTO userGroup) {
        UserGroup existingUserGroup = getUserGroup(id);
        if (userGroup.getCampaignList() != null) {
            existingUserGroup.setCampaignList(campaignService.getCampaigns(userGroup.getCampaignList()));
        }
        if (userGroup.getUserList() != null) {
            List<User> userList = userService.getUsers(userGroup.getUserList());
            List<User> usersToRemove = existingUserGroup.getUserList().stream()
                    .filter(user -> !userGroup.getUserList().contains(user.getId())).toList();
            List<User> usersToAdd = userList.stream().filter(user -> !existingUserGroup.getUserList()
                    .contains(user)).toList();

            usersToAdd.forEach(user -> user.getUserGroups().add(existingUserGroup));
            userService.saveUserList(usersToAdd);
            usersToRemove.forEach(user -> user.getUserGroups().remove(existingUserGroup));
            userService.saveUserList(usersToRemove);
            existingUserGroup.setUserList(userService.getUsers(userGroup.getUserList()));
        }
        if (userGroup.getName() != null) {
            existingUserGroup.setName(userGroup.getName());
        }
        return userGroupRepository.save(existingUserGroup);
    }

    @Transactional
    public void deleteUserGroup(UUID id) {
        UserGroup existingUserGroup = getUserGroup(id);
        List<User> usersInExistingGroup = existingUserGroup.getUserList();
        usersInExistingGroup.forEach(user -> user.getUserGroups().remove(existingUserGroup));
        userService.saveUserList(usersInExistingGroup);
        userGroupRepository.deleteById(id);
    }

    public UserGroup getUserGroup(UUID id) {
        return userGroupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(STR."User group with id \{id} not found"));
    }

    public List<UserGroup> getUserGroups() {
        return userGroupRepository.findAll();
    }

    private UserGroup getUserGroup(String entryCode) {
        UserGroup userGroup = userGroupRepository.getUserGroupByEntryCode(entryCode);
        if(userGroup == null){
            throw new ResourceNotFoundException(STR."User group with entry code \{entryCode} not found");
        }
        return userGroup;
    }

    private String generateEntryCode() {
        int leftLimit = 48;
        int rightLimit = 57;
        Random random = new Random();
        StringBuilder buffer = new StringBuilder(UserGroupService.CODE_LENGTH);
        for (int i = 0; i < UserGroupService.CODE_LENGTH; i++) {
            int randomLimitedInt = leftLimit + (int) (random.nextFloat() * (rightLimit - leftLimit + 1));
            buffer.append((char) randomLimitedInt);
        }
        return buffer.toString();
    }
}

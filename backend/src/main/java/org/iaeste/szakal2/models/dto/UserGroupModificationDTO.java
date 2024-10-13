package org.iaeste.szakal2.models.dto;

import lombok.Data;
import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.models.entities.UserGroup;

import java.util.List;
import java.util.UUID;

@Data
public class UserGroupModificationDTO {

    private UUID id;
    private List<UUID> userList;
    private List<UUID> campaignList;
    private String name;

    public static UserGroupModificationDTO fromEntity(UserGroup userGroup) {
        UserGroupModificationDTO userGroupModificationDTO = new UserGroupModificationDTO();
        userGroupModificationDTO.setId(userGroup.getId());
        userGroupModificationDTO.setName(userGroup.getName());
        userGroupModificationDTO.setUserList(userGroup.getUserList().stream().map(User::getId).toList());
        userGroupModificationDTO.setCampaignList(userGroup.getCampaignList().stream().map(Campaign::getId).toList());
        return userGroupModificationDTO;
    }
}

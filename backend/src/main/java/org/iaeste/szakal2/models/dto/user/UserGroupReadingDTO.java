package org.iaeste.szakal2.models.dto.user;

import lombok.Data;
import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.models.entities.UserGroup;

import java.util.List;
import java.util.UUID;

@Data
public class UserGroupReadingDTO {

    private UUID id;
    private List<User> userList;
    private List<Campaign> campaignList;
    private String name;

    public static UserGroupReadingDTO fromEntity(UserGroup userGroup) {
        UserGroupReadingDTO userGroupReadingDTO = new UserGroupReadingDTO();
        userGroupReadingDTO.setId(userGroup.getId());
        userGroupReadingDTO.setName(userGroup.getName());
        userGroupReadingDTO.setUserList(userGroup.getUserList());
        userGroupReadingDTO.setCampaignList(userGroup.getCampaignList());
        return userGroupReadingDTO;
    }
}

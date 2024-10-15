package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserGroupRepository extends JpaRepository<UserGroup, UUID> {
    UserGroup getUserGroupByName(String name);

    UserGroup getUserGroupByEntryCode(String entryCode);
}

package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.ApplicationSetting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ApplicationSettingRepository extends JpaRepository<ApplicationSetting, UUID> {

    Optional<ApplicationSetting> findApplicationSettingByName(String name);

}

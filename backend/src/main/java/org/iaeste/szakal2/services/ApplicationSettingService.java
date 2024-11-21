package org.iaeste.szakal2.services;

import org.iaeste.szakal2.models.dto.setting.SettingDTO;
import org.iaeste.szakal2.models.entities.ApplicationSetting;
import org.iaeste.szakal2.repositories.ApplicationSettingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationSettingService {

    private final ApplicationSettingRepository applicationSettingRepository;

    public ApplicationSettingService(ApplicationSettingRepository applicationSettingRepository) {
        this.applicationSettingRepository = applicationSettingRepository;
    }

    public List<ApplicationSetting> getApplicationSettings() {
        return applicationSettingRepository.findAll();
    }
    public List<ApplicationSetting> setApplicationSetting(String name, SettingDTO settingDTO) {
        Optional<ApplicationSetting> applicationSettingOptional
                = applicationSettingRepository.findApplicationSettingByName(name);
        if(applicationSettingOptional.isPresent()) {
            ApplicationSetting applicationSetting = applicationSettingOptional.get();
            applicationSetting.setValue(settingDTO.getValue());
            applicationSettingRepository.save(applicationSetting);
        } else {
            ApplicationSetting applicationSetting = ApplicationSetting.builder()
                    .name(name)
                    .value(settingDTO.getValue())
                    .build();
            applicationSettingRepository.save(applicationSetting);
        }
        return applicationSettingRepository.findAll();
    }
}

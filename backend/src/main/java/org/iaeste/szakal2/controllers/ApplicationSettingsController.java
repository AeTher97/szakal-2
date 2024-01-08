package org.iaeste.szakal2.controllers;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.dto.setting.SettingDTO;
import org.iaeste.szakal2.models.entities.ApplicationSetting;
import org.iaeste.szakal2.services.ApplicationSettingService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app-settings")
@Log4j2
public class ApplicationSettingsController {

    private final ApplicationSettingService applicationSettingService;

    public ApplicationSettingsController(ApplicationSettingService applicationSettingService) {
        this.applicationSettingService = applicationSettingService;
    }

    @GetMapping
    public List<ApplicationSetting> getApplicationSettings() {
        return applicationSettingService.getApplicationSettings();
    }

    @PutMapping("/{name}")
    @PreAuthorize("hasAuthority('app_settings')")
    public List<ApplicationSetting> setApplicationSetting(@PathVariable("name") String name,
                                                          @RequestBody @Valid SettingDTO settingDTO){
        return applicationSettingService.setApplicationSetting(name, settingDTO);
    }
}

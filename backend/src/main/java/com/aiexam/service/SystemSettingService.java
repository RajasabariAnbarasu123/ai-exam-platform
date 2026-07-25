package com.aiexam.service;

import com.aiexam.model.SystemSetting;
import com.aiexam.repository.SystemSettingRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Thin shared service for reading individual system settings.
 * Used by AuthService, EmailService, and the MaintenanceModeFilter
 * so they don't depend directly on AdminService (which has broader
 * admin-only logic).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SystemSettingService {

    private final SystemSettingRepository settingRepository;

    /**
     * On every startup, ensure maintenance mode is OFF so a previous
     * accidental toggle never bricks the running instance.
     * Admins can still re-enable it through the Admin Settings UI
     * while the server is running.
     */
    @PostConstruct
    @Transactional
    public void resetMaintenanceModeOnStartup() {
        try {
            settingRepository.findById("maintenanceMode").ifPresent(setting -> {
                if ("true".equalsIgnoreCase(setting.getSettingValue())) {
                    setting.setSettingValue("false");
                    settingRepository.save(setting);
                    log.info("Maintenance mode was ON at startup — automatically reset to OFF.");
                }
            });
        } catch (Exception e) {
            log.warn("Could not reset maintenanceMode on startup: {}", e.getMessage());
        }
    }

    /**
     * Migrate old GPT-based settings to Gemini 3.5 on startup to prevent 404 errors.
     */
    @PostConstruct
    @Transactional
    public void migrateAiModelSettingsOnStartup() {
        try {
            settingRepository.findById("aiModel").ifPresent(setting -> {
                String val = setting.getSettingValue();
                if (val == null || val.trim().isEmpty() || val.toLowerCase().startsWith("gpt-") || val.toLowerCase().contains("gpt")) {
                    setting.setSettingValue("gemini-3.5-flash");
                    settingRepository.save(setting);
                    log.info("Database AI Model setting migrated from '{}' to 'gemini-3.5-flash'.", val);
                }
            });
        } catch (Exception e) {
            log.warn("Could not migrate aiModel setting on startup: {}", e.getMessage());
        }
    }

    public String get(String key, String defaultValue) {
        return settingRepository.findById(key)
                .map(s -> s.getSettingValue())
                .orElse(defaultValue);
    }

    public boolean getBoolean(String key, boolean defaultValue) {
        return Boolean.parseBoolean(get(key, String.valueOf(defaultValue)));
    }

    /** Is maintenance mode currently active? */
    public boolean isMaintenanceMode() {
        return getBoolean("maintenanceMode", false);
    }

    /** Is user self-registration currently allowed? */
    public boolean isRegistrationEnabled() {
        return getBoolean("registrationEnabled", true);
    }

    /** Should email notifications be sent? */
    public boolean isEmailNotificationsEnabled() {
        return getBoolean("emailNotifications", true);
    }
}

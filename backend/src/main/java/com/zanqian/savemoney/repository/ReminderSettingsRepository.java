package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.ReminderSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ReminderSettingsRepository extends JpaRepository<ReminderSettings, String> {
    Optional<ReminderSettings> findByUserId(String userId);
}

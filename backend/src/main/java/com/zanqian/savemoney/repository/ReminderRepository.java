package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, String> {
    List<Reminder> findByUserId(String userId);
}

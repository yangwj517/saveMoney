package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.SavingsGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, String> {
    List<SavingsGoal> findByUserIdAndBookType(String userId, String bookType);
    List<SavingsGoal> findByUserIdAndBookTypeAndIsCompleted(String userId, String bookType, Boolean isCompleted);
}

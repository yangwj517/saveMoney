package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.SavingsDeposit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavingsDepositRepository extends JpaRepository<SavingsDeposit, String> {
    List<SavingsDeposit> findByGoalIdOrderByCreatedAtDesc(String goalId);
}

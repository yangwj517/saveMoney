package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, String> {
    List<Budget> findByUserIdAndBookType(String userId, String bookType);
    List<Budget> findByUserIdAndBookTypeAndPeriod(String userId, String bookType, String period);
}

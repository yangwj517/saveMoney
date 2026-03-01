package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccountRepository extends JpaRepository<Account, String> {
    List<Account> findByUserIdAndBookType(String userId, String bookType);
    List<Account> findByUserId(String userId);
}

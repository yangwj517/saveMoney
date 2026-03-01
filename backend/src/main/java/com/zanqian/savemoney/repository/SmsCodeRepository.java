package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.SmsCode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SmsCodeRepository extends JpaRepository<SmsCode, String> {
    Optional<SmsCode> findFirstByPhoneAndUsedFalseOrderByExpireAtDesc(String phone);
}

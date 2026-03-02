package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.SmsCode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * 短信验证码数据仓库接口
 *
 * 提供短信验证码数据的数据库操作接口
 */
public interface SmsCodeRepository extends JpaRepository<SmsCode, String> {
    /**
     * 根据手机号查询最新的未使用验证码
     *
     * 查询逻辑：
     * 1. 手机号匹配
     * 2. 未被使用（used=false）
     * 3. 按过期时间倒序排列（获取最新的）
     *
     * @param phone 手机号
     * @return 验证码记录（Optional）
     */
    Optional<SmsCode> findFirstByPhoneAndUsedFalseOrderByExpireAtDesc(String phone);
}

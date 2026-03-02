package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * 用户数据仓库接口
 *
 * 提供用户数据的数据库操作接口
 */
public interface UserRepository extends JpaRepository<User, String> {
    /**
     * 根据手机号查询用户
     *
     * @param phone 手机号
     * @return 用户对象（Optional）
     */
    Optional<User> findByPhone(String phone);
}

package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * 账户数据仓库接口
 *
 * 提供账户数据的数据库操作接口
 */
public interface AccountRepository extends JpaRepository<Account, String> {
    /**
     * 根据用户ID和账簿类型查询账户列表
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @return 账户列表
     */
    List<Account> findByUserIdAndBookType(String userId, String bookType);

    /**
     * 根据用户ID查询所有账户
     *
     * @param userId 用户ID
     * @return 账户列表
     */
    List<Account> findByUserId(String userId);
}

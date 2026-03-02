package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * 分类数据仓库接口
 *
 * 提供分类数据的数据库操作接口
 */
public interface CategoryRepository extends JpaRepository<Category, String> {
    /**
     * 根据用户ID和账簿类型查询分类列表
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @return 分类列表
     */
    List<Category> findByUserIdAndBookType(String userId, String bookType);

    /**
     * 根据用户ID、账簿类型和账单类型查询分类列表
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param type 账单类型（"income"收入或"expense"支出）
     * @return 分类列表
     */
    List<Category> findByUserIdAndBookTypeAndType(String userId, String bookType, String type);
}

package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.CategoryRequest;
import com.zanqian.savemoney.dto.CategoryUpdateRequest;
import java.util.List;
import java.util.Map;

/**
 * 分类服务接口
 *
 * 定义分类管理相关的业务逻辑
 */
public interface CategoryService {
    /**
     * 获取分类列表
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param type 账单类型（可选）
     * @return 分类列表
     */
    List<Map<String, Object>> getCategories(String userId, String bookType, String type);

    /**
     * 创建分类
     *
     * @param userId 用户ID
     * @param request 创建请求
     * @return 创建后的分类信息
     */
    Map<String, Object> createCategory(String userId, CategoryRequest request);

    /**
     * 更新分类
     *
     * @param userId 用户ID
     * @param id 分类ID
     * @param request 更新请求
     * @return 更新后的分类信息
     */
    Map<String, Object> updateCategory(String userId, String id, CategoryUpdateRequest request);

    /**
     * 删除分类
     *
     * @param userId 用户ID
     * @param id 分类ID
     */
    void deleteCategory(String userId, String id);
}

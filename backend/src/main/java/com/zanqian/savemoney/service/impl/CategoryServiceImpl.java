package com.zanqian.savemoney.service.impl;

import com.zanqian.savemoney.common.ErrorCode;
import com.zanqian.savemoney.common.exception.BusinessException;
import com.zanqian.savemoney.dto.CategoryRequest;
import com.zanqian.savemoney.dto.CategoryUpdateRequest;
import com.zanqian.savemoney.entity.Category;
import com.zanqian.savemoney.repository.CategoryRepository;
import com.zanqian.savemoney.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 分类业务实现类
 *
 * 实现分类管理相关的业务逻辑：
 * - 获取分类列表（支持按类型筛选）
 * - 创建分类
 * - 更新分类
 * - 删除分类
 */
@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * 获取分类列表
     *
     * 根据用户ID和账簿类型获取分类列表
     * 可选地按账单类型（收入/支出）进行筛选
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param type 账单类型（可选，"income"收入或"expense"支出）
     * @return 分类列表
     */
    @Override
    public List<Map<String, Object>> getCategories(String userId, String bookType, String type) {
        List<Category> categories;
        // 如果指定了账单类型，则按类型筛选；否则返回所有分类
        if (type != null && !type.isEmpty()) {
            categories = categoryRepository.findByUserIdAndBookTypeAndType(userId, bookType, type);
        } else {
            categories = categoryRepository.findByUserIdAndBookType(userId, bookType);
        }
        return categories.stream().map(this::toMap).collect(Collectors.toList());
    }

    /**
     * 创建分类
     *
     * 创建一个新的账单分类
     * 支持分层结构（通过parentId指定父分类）
     *
     * @param userId 用户ID
     * @param request 分类创建请求
     * @return 创建后的分类信息
     */
    @Override
    @Transactional
    public Map<String, Object> createCategory(String userId, CategoryRequest request) {
        Category category = new Category();
        category.setUserId(userId);
        category.setName(request.getName());
        category.setIcon(request.getIcon());
        category.setColor(request.getColor());
        category.setType(request.getType());
        category.setBookType(request.getBookType());
        category.setParentId(request.getParentId());
        category.setOrder(request.getOrder());
        categoryRepository.save(category);
        return toMap(category);
    }

    /**
     * 更新分类
     *
     * 修改分类信息，需要权限验证
     * 支持部分更新，只更新非null的字段
     *
     * @param userId 用户ID
     * @param id 分类ID
     * @param request 分类更新请求
     * @return 更新后的分类信息
     * @throws BusinessException 如果分类不存在或无权操作
     */
    @Override
    @Transactional
    public Map<String, Object> updateCategory(String userId, String id, CategoryUpdateRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "分类不存在"));

        // 权限验证：只能修改属于自己的分类
        if (!category.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        // 选择性更新分类信息
        if (request.getName() != null) category.setName(request.getName());
        if (request.getIcon() != null) category.setIcon(request.getIcon());
        if (request.getColor() != null) category.setColor(request.getColor());
        if (request.getOrder() != null) category.setOrder(request.getOrder());
        categoryRepository.save(category);
        return toMap(category);
    }

    /**
     * 删除分类
     *
     * 删除指定的分类，需要权限验证
     *
     * @param userId 用户ID
     * @param id 分类ID
     * @throws BusinessException 如果分类不存在或无权操作
     */
    @Override
    @Transactional
    public void deleteCategory(String userId, String id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "分类不存在"));

        // 权限验证：只能删除属于自己的分类
        if (!category.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        categoryRepository.delete(category);
    }

    /**
     * 将Category实体转换为Map格式
     *
     * @param c 分类实体
     * @return 分类信息Map
     */
    private Map<String, Object> toMap(Category c) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", c.getId());
        map.put("name", c.getName());
        map.put("icon", c.getIcon());
        map.put("color", c.getColor());
        map.put("type", c.getType());
        map.put("bookType", c.getBookType());
        map.put("parentId", c.getParentId());
        map.put("order", c.getOrder());
        return map;
    }
}

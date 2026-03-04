package com.zanqian.savemoney.controller;

import com.zanqian.savemoney.common.ApiResponse;
import com.zanqian.savemoney.dto.CategoryRequest;
import com.zanqian.savemoney.dto.CategoryUpdateRequest;
import com.zanqian.savemoney.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 分类控制器
 *
 * 处理账单分类管理操作：
 * - 获取分类列表
 * - 创建分类
 * - 修改分类
 * - 删除分类
 *
 * 分类用于对账单进行分类标签，支持自定义分类
 */
@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * 获取分类列表
     *
     * 获取指定账簿类型和账单类型的分类列表
     *
     * @param bookType 账簿类型
     * @param type 账单类型（可选，"income"收入或"expense"支出）
     * @return 分类列表
     */
    @GetMapping
    public ApiResponse<List<Map<String, Object>>> getCategories(@RequestParam String bookType,
                                                                  @RequestParam(required = false) String type) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(categoryService.getCategories(userId, bookType, type));
    }

    /**
     * 创建分类
     *
     * 创建新的账单分类
     *
     * @param request 包含分类信息的请求（名称、图标、颜色等）
     * @return 创建后的分类信息
     */
    @PostMapping
    public ApiResponse<Map<String, Object>> createCategory(@Valid @RequestBody CategoryRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(categoryService.createCategory(userId, request));
    }

    /**
     * 更新分类
     *
     * 修改指定分类的信息
     *
     * @param id 分类ID
     * @param request 包含更新信息的请求
     * @return 更新后的分类信息
     */
    @PutMapping("/{id}")
    public ApiResponse<Map<String, Object>> updateCategory(@PathVariable String id,
                                                            @Valid @RequestBody CategoryUpdateRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(categoryService.updateCategory(userId, id, request));
    }

    /**
     * 删除分类
     *
     * 删除指定的分类
     *
     * @param id 分类ID
     * @return 删除成功响应
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        categoryService.deleteCategory(userId, id);
        return ApiResponse.success();
    }
}

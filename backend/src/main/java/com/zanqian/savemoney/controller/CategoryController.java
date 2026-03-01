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

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> getCategories(@RequestParam String bookType,
                                                                  @RequestParam(required = false) String type) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(categoryService.getCategories(userId, bookType, type));
    }

    @PostMapping
    public ApiResponse<Map<String, Object>> createCategory(@Valid @RequestBody CategoryRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(categoryService.createCategory(userId, request));
    }

    @PutMapping("/{id}")
    public ApiResponse<Map<String, Object>> updateCategory(@PathVariable String id,
                                                            @Valid @RequestBody CategoryUpdateRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(categoryService.updateCategory(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        categoryService.deleteCategory(userId, id);
        return ApiResponse.success();
    }
}

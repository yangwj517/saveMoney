package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.CategoryRequest;
import com.zanqian.savemoney.dto.CategoryUpdateRequest;
import java.util.List;
import java.util.Map;

public interface CategoryService {
    List<Map<String, Object>> getCategories(String userId, String bookType, String type);
    Map<String, Object> createCategory(String userId, CategoryRequest request);
    Map<String, Object> updateCategory(String userId, String id, CategoryUpdateRequest request);
    void deleteCategory(String userId, String id);
}

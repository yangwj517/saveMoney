package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, String> {
    List<Category> findByUserIdAndBookType(String userId, String bookType);
    List<Category> findByUserIdAndBookTypeAndType(String userId, String bookType, String type);
}

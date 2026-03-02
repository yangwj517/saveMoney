package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.Record;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 账单记录数据仓库接口
 *
 * 提供账单记录数据的数据库操作接口
 * 支持复杂查询和统计
 */
public interface RecordRepository extends JpaRepository<Record, String>, JpaSpecificationExecutor<Record> {

    /**
     * 统计指定条件的账单总金额
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param type 账单类型
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 总金额
     */
    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM Record r WHERE r.userId = :userId AND r.bookType = :bookType AND r.type = :type AND r.date BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
            @Param("userId") String userId,
            @Param("bookType") String bookType,
            @Param("type") String type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * 查询指定日期范围内的账单列表
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 账单列表
     */
    List<Record> findByUserIdAndBookTypeAndDateBetween(String userId, String bookType, LocalDate startDate, LocalDate endDate);

    /**
     * 统计指定分类在日期范围内的支出总额
     *
     * @param userId 用户ID
     * @param categoryId 分类ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 支出总额
     */
    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM Record r WHERE r.userId = :userId AND r.categoryId = :categoryId AND r.type = 'expense' AND r.date BETWEEN :startDate AND :endDate")
    BigDecimal sumExpenseByCategoryAndDateBetween(
            @Param("userId") String userId,
            @Param("categoryId") String categoryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * 统计指定账簿和分类在日期范围内的支出总额
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param categoryId 分类ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 支出总额
     */
    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM Record r WHERE r.userId = :userId AND r.bookType = :bookType AND r.categoryId = :categoryId AND r.type = 'expense' AND r.date BETWEEN :startDate AND :endDate")
    BigDecimal sumExpenseByBookTypeAndCategoryAndDateBetween(
            @Param("userId") String userId,
            @Param("bookType") String bookType,
            @Param("categoryId") String categoryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}

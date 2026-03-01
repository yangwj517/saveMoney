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

public interface RecordRepository extends JpaRepository<Record, String>, JpaSpecificationExecutor<Record> {

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM Record r WHERE r.userId = :userId AND r.bookType = :bookType AND r.type = :type AND r.date BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
            @Param("userId") String userId,
            @Param("bookType") String bookType,
            @Param("type") String type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    List<Record> findByUserIdAndBookTypeAndDateBetween(String userId, String bookType, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM Record r WHERE r.userId = :userId AND r.categoryId = :categoryId AND r.type = 'expense' AND r.date BETWEEN :startDate AND :endDate")
    BigDecimal sumExpenseByCategoryAndDateBetween(
            @Param("userId") String userId,
            @Param("categoryId") String categoryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}

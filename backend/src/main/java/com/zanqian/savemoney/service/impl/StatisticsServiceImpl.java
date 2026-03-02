package com.zanqian.savemoney.service.impl;

import com.zanqian.savemoney.entity.Category;
import com.zanqian.savemoney.entity.Record;
import com.zanqian.savemoney.repository.AccountRepository;
import com.zanqian.savemoney.repository.CategoryRepository;
import com.zanqian.savemoney.repository.RecordRepository;
import com.zanqian.savemoney.service.StatisticsService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsServiceImpl implements StatisticsService {

    private final RecordRepository recordRepository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;

    public StatisticsServiceImpl(RecordRepository recordRepository,
                                  CategoryRepository categoryRepository,
                                  AccountRepository accountRepository) {
        this.recordRepository = recordRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    public Map<String, Object> getStatistics(String userId, String bookType,
                                              String startDate, String endDate, String type) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        BigDecimal totalIncome = recordRepository.sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
                userId, bookType, "income", start, end);
        BigDecimal totalExpense = recordRepository.sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
                userId, bookType, "expense", start, end);

        List<Record> records = recordRepository.findByUserIdAndBookTypeAndDateBetween(userId, bookType, start, end);

        // Filter by type if specified
        String filterType = (type != null && !type.isEmpty()) ? type : "expense";
        List<Record> filteredRecords = records.stream()
                .filter(r -> r.getType().equals(filterType))
                .collect(Collectors.toList());

        // Category stats
        List<Record> filteredRecordsWithCategory = filteredRecords.stream()
                .filter(r -> r.getCategoryId() != null)
                .collect(Collectors.toList());

        BigDecimal totalFilteredAmount = filteredRecordsWithCategory.stream()
                .map(Record::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, List<Record>> byCategoryId = filteredRecordsWithCategory.stream()
                .collect(Collectors.groupingBy(Record::getCategoryId));

        List<Map<String, Object>> categoryStats = new ArrayList<>();
        for (Map.Entry<String, List<Record>> entry : byCategoryId.entrySet()) {
            BigDecimal amount = entry.getValue().stream()
                    .map(Record::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            double percentage = totalFilteredAmount.compareTo(BigDecimal.ZERO) > 0
                    ? amount.multiply(BigDecimal.valueOf(100))
                    .divide(totalFilteredAmount, 2, RoundingMode.HALF_UP).doubleValue()
                    : 0;

            Map<String, Object> catStat = new LinkedHashMap<>();
            catStat.put("categoryId", entry.getKey());

            Optional<Category> cat = categoryRepository.findById(entry.getKey());
            if (cat.isPresent()) {
                Map<String, Object> catMap = new LinkedHashMap<>();
                catMap.put("id", cat.get().getId());
                catMap.put("name", cat.get().getName());
                catMap.put("icon", cat.get().getIcon());
                catMap.put("color", cat.get().getColor());
                catStat.put("category", catMap);
            }
            catStat.put("amount", amount);
            catStat.put("percentage", percentage);
            catStat.put("count", entry.getValue().size());
            categoryStats.add(catStat);
        }

        // Daily stats
        Map<LocalDate, List<Record>> byDate = records.stream()
                .collect(Collectors.groupingBy(Record::getDate));

        List<Map<String, Object>> dailyStats = new ArrayList<>();
        LocalDate current = start;
        while (!current.isAfter(end)) {
            List<Record> dayRecords = byDate.getOrDefault(current, Collections.emptyList());
            BigDecimal dayIncome = dayRecords.stream()
                    .filter(r -> "income".equals(r.getType()))
                    .map(Record::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal dayExpense = dayRecords.stream()
                    .filter(r -> "expense".equals(r.getType()))
                    .map(Record::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> dayStat = new LinkedHashMap<>();
            dayStat.put("date", current.toString());
            dayStat.put("income", dayIncome);
            dayStat.put("expense", dayExpense);
            dailyStats.add(dayStat);
            current = current.plusDays(1);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalIncome", totalIncome);
        result.put("totalExpense", totalExpense);
        result.put("balance", totalIncome.subtract(totalExpense));
        result.put("categoryStats", categoryStats);
        result.put("dailyStats", dailyStats);
        return result;
    }

    @Override
    public Map<String, Object> getOverview(String userId, String bookType) {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate monthEnd = today.withDayOfMonth(today.lengthOfMonth());

        BigDecimal todayIncome = recordRepository.sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
                userId, bookType, "income", today, today);
        BigDecimal todayExpense = recordRepository.sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
                userId, bookType, "expense", today, today);
        BigDecimal monthIncome = recordRepository.sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
                userId, bookType, "income", monthStart, monthEnd);
        BigDecimal monthExpense = recordRepository.sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
                userId, bookType, "expense", monthStart, monthEnd);

        // Total balance from all accounts
        BigDecimal totalBalance = accountRepository.findByUserIdAndBookType(userId, bookType)
                .stream()
                .map(a -> a.getBalance() != null ? a.getBalance() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("bookType", bookType);
        result.put("totalBalance", totalBalance);
        result.put("todayIncome", todayIncome);
        result.put("todayExpense", todayExpense);
        result.put("monthIncome", monthIncome);
        result.put("monthExpense", monthExpense);
        return result;
    }
}

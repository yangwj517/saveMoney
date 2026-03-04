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

/**
 * 统计业务实现类
 *
 * 实现数据统计和分析相关的业务逻辑：
 * - 获取指定日期范围的收支统计（包括分类统计和日期统计）
 * - 获取账簿概览信息（总余额、今日/本月收支等）
 */
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

    /**
     * 获取统计数据
     *
     * 返回指定日期范围内的详细统计，包括：
     * 1. 总收入和总支出
     * 2. 按分类统计的支出详情（金额和占比）
     * 3. 按日期统计的收支趋势
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param startDate 开始日期（格式：yyyy-MM-dd）
     * @param endDate 结束日期（格式：yyyy-MM-dd）
     * @param type 账单类型筛选（可选，为null时默认统计支出）
     * @return 包含统计数据的Map
     */
    @Override
    public Map<String, Object> getStatistics(String userId, String bookType,
                                              String startDate, String endDate, String type) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        // 计算总收入和总支出
        BigDecimal totalIncome = recordRepository.sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
                userId, bookType, "income", start, end);
        BigDecimal totalExpense = recordRepository.sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
                userId, bookType, "expense", start, end);

        // 获取指定日期范围内的所有账单
        List<Record> records = recordRepository.findByUserIdAndBookTypeAndDateBetween(userId, bookType, start, end);

        // 按类型筛选（默认为支出）
        String filterType = (type != null && !type.isEmpty()) ? type : "expense";
        List<Record> filteredRecords = records.stream()
                .filter(r -> r.getType().equals(filterType))
                .collect(Collectors.toList());

        // 过滤出有分类的账单（用于分类统计）
        List<Record> filteredRecordsWithCategory = filteredRecords.stream()
                .filter(r -> r.getCategoryId() != null)
                .collect(Collectors.toList());

        // 计算筛选后账单的总金额（用于计算占比）
        BigDecimal totalFilteredAmount = filteredRecordsWithCategory.stream()
                .map(Record::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 按分类ID分组统计
        Map<String, List<Record>> byCategoryId = filteredRecordsWithCategory.stream()
                .collect(Collectors.groupingBy(Record::getCategoryId));

        // 构建分类统计列表
        List<Map<String, Object>> categoryStats = new ArrayList<>();
        for (Map.Entry<String, List<Record>> entry : byCategoryId.entrySet()) {
            // 计算该分类的总金额
            BigDecimal amount = entry.getValue().stream()
                    .map(Record::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // 计算该分类的占比（百分比，精确到2位小数）
            double percentage = totalFilteredAmount.compareTo(BigDecimal.ZERO) > 0
                    ? amount.multiply(BigDecimal.valueOf(100))
                    .divide(totalFilteredAmount, 2, RoundingMode.HALF_UP).doubleValue()
                    : 0;

            Map<String, Object> catStat = new LinkedHashMap<>();
            catStat.put("categoryId", entry.getKey());

            // 获取分类详情
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
            catStat.put("count", entry.getValue().size());  // 该分类的账单数
            categoryStats.add(catStat);
        }

        // 按日期分组统计（用于绘制日期趋势图）
        Map<LocalDate, List<Record>> byDate = records.stream()
                .collect(Collectors.groupingBy(Record::getDate));

        // 构建日期统计列表（逐日统计）
        List<Map<String, Object>> dailyStats = new ArrayList<>();
        LocalDate current = start;
        while (!current.isAfter(end)) {
            List<Record> dayRecords = byDate.getOrDefault(current, Collections.emptyList());

            // 计算该天的收入和支出
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

        // 构建返回结果
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalIncome", totalIncome);
        result.put("totalExpense", totalExpense);
        result.put("balance", totalIncome.subtract(totalExpense));
        result.put("categoryStats", categoryStats);
        result.put("dailyStats", dailyStats);
        return result;
    }

    /**
     * 获取账簿概览信息
     *
     * 返回快速查看的关键指标：
     * - 账簿总余额
     * - 今日收入和支出
     * - 本月累计收入和支出
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @return 包含概览数据的Map
     */
    @Override
    public Map<String, Object> getOverview(String userId, String bookType) {
        LocalDate today = LocalDate.now();
        // 本月的开始日期和结束日期
        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate monthEnd = today.withDayOfMonth(today.lengthOfMonth());

        // 统计今日的收入和支出
        BigDecimal todayIncome = recordRepository.sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
                userId, bookType, "income", today, today);
        BigDecimal todayExpense = recordRepository.sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
                userId, bookType, "expense", today, today);

        // 统计本月的收入和支出
        BigDecimal monthIncome = recordRepository.sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
                userId, bookType, "income", monthStart, monthEnd);
        BigDecimal monthExpense = recordRepository.sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
                userId, bookType, "expense", monthStart, monthEnd);

        // 计算账簿总余额（所有账户余额之和）
        BigDecimal totalBalance = accountRepository.findByUserIdAndBookType(userId, bookType)
                .stream()
                .map(a -> a.getBalance() != null ? a.getBalance() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 构建返回结果
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

package com.zanqian.savemoney.service.impl;

import com.zanqian.savemoney.common.ErrorCode;
import com.zanqian.savemoney.common.exception.BusinessException;
import com.zanqian.savemoney.dto.BudgetRequest;
import com.zanqian.savemoney.dto.BudgetUpdateRequest;
import com.zanqian.savemoney.entity.Budget;
import com.zanqian.savemoney.entity.Category;
import com.zanqian.savemoney.repository.BudgetRepository;
import com.zanqian.savemoney.repository.CategoryRepository;
import com.zanqian.savemoney.repository.RecordRepository;
import com.zanqian.savemoney.service.BudgetService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 预算业务实现类
 *
 * 实现预算管理相关的业务逻辑：
 * - 获取预算列表（支持按周期筛选）
 * - 创建预算
 * - 更新预算
 * - 删除预算
 * - 计算预算使用情况
 */
@Service
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final RecordRepository recordRepository;

    public BudgetServiceImpl(BudgetRepository budgetRepository,
                             CategoryRepository categoryRepository,
                             RecordRepository recordRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.recordRepository = recordRepository;
    }

    /**
     * 获取预算列表
     *
     * 根据用户ID、账簿类型和预算周期获取预算列表
     * 自动计算每个预算的已使用金额
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param period 预算周期（可选，"weekly"周度、"monthly"月度、"yearly"年度）
     * @return 预算列表，包含计算后的已使用金额
     */
    @Override
    public List<Map<String, Object>> getBudgets(String userId, String bookType, String period) {
        List<Budget> budgets;
        // 按周期筛选或获取所有预算
        if (period != null && !period.isEmpty()) {
            budgets = budgetRepository.findByUserIdAndBookTypeAndPeriod(userId, bookType, period);
        } else {
            budgets = budgetRepository.findByUserIdAndBookType(userId, bookType);
        }
        // 将实体转换为Map格式，并计算已使用额度
        return budgets.stream()
                .map(b -> toMap(b, userId))
                .collect(Collectors.toList());
    }

    /**
     * 创建预算
     *
     * @param userId 用户ID
     * @param request 预算创建请求
     * @return 创建后的预算信息
     */
    @Override
    @Transactional
    public Map<String, Object> createBudget(String userId, BudgetRequest request) {
        // 验证请求参数
        validateBudgetRequest(request);

        // 检查同一周期内是否已存在该分类的预算
        if (budgetRepository.existsByUserIdAndBookTypeAndPeriodAndCategoryId(
                userId, request.getBookType(), request.getPeriod(), request.getCategoryId())) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "该周期内已存在此分类的预算");
        }

        Budget budget = new Budget();
        budget.setUserId(userId);
        budget.setCategoryId(request.getCategoryId());
        budget.setAmount(request.getAmount());
        budget.setUsedAmount(BigDecimal.ZERO);
        budget.setPeriod(request.getPeriod());
        budget.setBookType(request.getBookType());
        budget.setAlertThreshold(request.getAlertThreshold());
        // 如果未指定提醒状态，默认不启用
        budget.setIsAlertEnabled(request.getIsAlertEnabled() != null ? request.getIsAlertEnabled() : false);

        budgetRepository.save(budget);
        return toMap(budget, userId);
    }

    /**
     * 更新预算
     *
     * 支持部分更新，只更新非null的字段
     *
     * @param userId 用户ID
     * @param id 预算ID
     * @param request 预算更新请求
     * @return 更新后的预算信息
     * @throws BusinessException 如果预算不存在或无权操作
     */
    @Override
    @Transactional
    public Map<String, Object> updateBudget(String userId, String id, BudgetUpdateRequest request) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "预算不存在"));

        // 权限验证：只能修改属于自己的预算
        if (!budget.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "无权修改此预算");
        }

        // 选择性更新预算信息
        if (request.getAmount() != null) {
            if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessException(ErrorCode.PARAM_ERROR, "预算金额必须大于0");
            }
            budget.setAmount(request.getAmount());
        }

        if (request.getAlertThreshold() != null) {
            if (request.getAlertThreshold() < 0 || request.getAlertThreshold() > 100) {
                throw new BusinessException(ErrorCode.PARAM_ERROR, "提醒阈值必须在0-100之间");
            }
            budget.setAlertThreshold(request.getAlertThreshold());
        }

        if (request.getIsAlertEnabled() != null) {
            budget.setIsAlertEnabled(request.getIsAlertEnabled());
        }

        budgetRepository.save(budget);
        return toMap(budget, userId);
    }

    /**
     * 删除预算
     *
     * @param userId 用户ID
     * @param id 预算ID
     * @throws BusinessException 如果预算不存在或无权操作
     */
    @Override
    @Transactional
    public void deleteBudget(String userId, String id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "预算不存在"));

        // 权限验证：只能删除属于自己的预算
        if (!budget.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "无权删除此预算");
        }

        budgetRepository.delete(budget);
    }

    /**
     * 将Budget实体转换为Map格式
     *
     * 包含预算信息以及计算出的已使用金额
     *
     * @param budget 预算实体
     * @param userId 用户ID
     * @return 预算信息Map
     */
    private Map<String, Object> toMap(Budget budget, String userId) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", budget.getId());
        map.put("categoryId", budget.getCategoryId());

        // 获取分类详情
        if (budget.getCategoryId() != null) {
            Optional<Category> cat = categoryRepository.findById(budget.getCategoryId());
            cat.ifPresent(c -> {
                Map<String, Object> catMap = new LinkedHashMap<>();
                catMap.put("id", c.getId());
                catMap.put("name", c.getName());
                catMap.put("icon", c.getIcon());
                catMap.put("color", c.getColor());
                map.put("category", catMap);
            });
        } else {
            map.put("category", null);
        }

        // 计算已使用金额和进度
        BigDecimal usedAmount = calculateUsedAmount(budget, userId);
        BigDecimal amount = budget.getAmount();

        map.put("amount", amount);
        map.put("usedAmount", usedAmount);

        // 计算使用百分比
        if (amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal percentage = usedAmount.multiply(new BigDecimal(100))
                    .divide(amount, 2, BigDecimal.ROUND_HALF_UP);
            map.put("percentage", percentage);

            // 判断是否超出预算或达到提醒阈值
            if (usedAmount.compareTo(amount) >= 0) {
                map.put("status", "exceeded");
            } else if (budget.getIsAlertEnabled() && budget.getAlertThreshold() != null) {
                BigDecimal thresholdAmount = amount.multiply(
                        new BigDecimal(budget.getAlertThreshold()).divide(new BigDecimal(100)));
                if (usedAmount.compareTo(thresholdAmount) >= 0) {
                    map.put("status", "warning");
                } else {
                    map.put("status", "normal");
                }
            } else {
                map.put("status", "normal");
            }
        } else {
            map.put("percentage", BigDecimal.ZERO);
            map.put("status", "normal");
        }

        map.put("period", budget.getPeriod());
        map.put("bookType", budget.getBookType());
        map.put("alertThreshold", budget.getAlertThreshold());
        map.put("isAlertEnabled", budget.getIsAlertEnabled());
        map.put("createdAt", budget.getCreatedAt() != null ? budget.getCreatedAt().toString() : null);

        return map;
    }

    /**
     * 计算预算的已使用金额
     *
     * 根据预算周期计算对应时间范围内，
     * 该分类的支出总额
     *
     * @param budget 预算对象
     * @param userId 用户ID
     * @return 已使用金额
     */
    private BigDecimal calculateUsedAmount(Budget budget, String userId) {
        // 获取当前预算周期的日期范围
        LocalDate[] dateRange = getPeriodDateRange(budget.getPeriod());
        LocalDate startDate = dateRange[0];
        LocalDate endDate = dateRange[1];

        // 计算该分类在该时间范围内的支出总额
        BigDecimal usedAmount;
        if (budget.getCategoryId() != null) {
            usedAmount = recordRepository.sumExpenseByBookTypeAndCategoryAndDateBetween(
                    userId, budget.getBookType(), budget.getCategoryId(), startDate, endDate);
        } else {
            // 如果未指定分类，则计算全部支出
            usedAmount = recordRepository.sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
                    userId, budget.getBookType(), "expense", startDate, endDate);
        }

        return usedAmount != null ? usedAmount : BigDecimal.ZERO;
    }

    /**
     * 根据预算周期获取对应的日期范围
     *
     * @param period 周期类型（"weekly"、"monthly"、"yearly"）
     * @return 包含开始日期和结束日期的数组
     */
    private LocalDate[] getPeriodDateRange(String period) {
        LocalDate today = LocalDate.now();
        LocalDate startDate;
        LocalDate endDate;

        if (period == null) {
            period = "monthly";
        }

        switch (period) {
            case "weekly":
                // 周度：从本周一到本周日
                startDate = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                endDate = startDate.plusDays(6);
                break;
            case "yearly":
                // 年度：从今年1月1日到12月31日
                startDate = today.with(TemporalAdjusters.firstDayOfYear());
                endDate = today.with(TemporalAdjusters.lastDayOfYear());
                break;
            case "monthly":
            default:
                // 月度：从本月1日到月末
                startDate = today.withDayOfMonth(1);
                endDate = today.with(TemporalAdjusters.lastDayOfMonth());
                break;
        }

        return new LocalDate[]{startDate, endDate};
    }

    /**
     * 验证预算创建请求
     *
     * @param request 预算创建请求
     * @throws BusinessException 如果参数无效
     */
    private void validateBudgetRequest(BudgetRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "预算金额必须大于0");
        }

        if (request.getPeriod() == null || request.getPeriod().trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "预算周期不能为空");
        }

        if (!List.of("weekly", "monthly", "yearly").contains(request.getPeriod())) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "预算周期无效");
        }

        if (request.getBookType() == null || request.getBookType().trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "账簿类型不能为空");
        }

        if (request.getAlertThreshold() != null) {
            if (request.getAlertThreshold() < 0 || request.getAlertThreshold() > 100) {
                throw new BusinessException(ErrorCode.PARAM_ERROR, "提醒阈值必须在0-100之间");
            }
        }
    }
}
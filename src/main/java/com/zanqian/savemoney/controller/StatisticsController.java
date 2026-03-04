package com.zanqian.savemoney.controller;

import com.zanqian.savemoney.common.ApiResponse;
import com.zanqian.savemoney.service.StatisticsService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 统计控制器
 *
 * 处理数据统计相关操作：
 * - 获取指定日期范围的统计数据
 * - 获取账簿概览信息
 *
 * 提供收支分析、数据可视化等统计功能
 */
@RestController
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    /**
     * 获取统计数据
     *
     * 获取指定日期范围内的收支统计数据
     * 支持按账簿类型和账单类型进行统计
     *
     * @param bookType 账簿类型
     * @param startDate 开始日期（格式：yyyy-MM-dd）
     * @param endDate 结束日期（格式：yyyy-MM-dd）
     * @param type 账单类型（可选，"income"收入或"expense"支出）
     * @return 统计数据
     */
    @GetMapping("/statistics")
    public ApiResponse<Map<String, Object>> getStatistics(
            @RequestParam String bookType,
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) String type) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(statisticsService.getStatistics(userId, bookType, startDate, endDate, type));
    }

    /**
     * 获取账簿概览
     *
     * 获取指定账簿的概览信息（如总余额、本月收入、本月支出等）
     *
     * @param bookType 账簿类型
     * @return 账簿概览信息
     */
    @GetMapping("/overview")
    public ApiResponse<Map<String, Object>> getOverview(@RequestParam String bookType) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(statisticsService.getOverview(userId, bookType));
    }
}

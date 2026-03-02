package com.zanqian.savemoney.service;

import java.util.Map;

/**
 * 统计服务接口
 *
 * 定义数据统计相关的业务逻辑
 */
public interface StatisticsService {
    /**
     * 获取统计数据
     *
     * 获取指定日期范围内的收支统计
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param type 账单类型（可选）
     * @return 统计数据
     */
    Map<String, Object> getStatistics(String userId, String bookType, String startDate, String endDate, String type);

    /**
     * 获取账簿概览
     *
     * 获取指定账簿的概览信息
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @return 账簿概览信息
     */
    Map<String, Object> getOverview(String userId, String bookType);
}

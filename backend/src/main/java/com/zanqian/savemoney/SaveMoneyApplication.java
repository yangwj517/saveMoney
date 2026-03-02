package com.zanqian.savemoney;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 攒钱记账应用 - 主启动类
 *
 * 该应用提供个人财务管理功能，包括：
 * - 账户管理：支持多账户、多账簿管理
 * - 记录管理：收支记录、分类管理
 * - 预算管理：预算设定与超额提醒
 * - 储蓄目标：储蓄计划与进度追踪
 * - 提醒功能：账单提醒与储蓄提醒
 * - 数据统计：收支统计、数据分析
 */
@SpringBootApplication
public class SaveMoneyApplication {
    public static void main(String[] args) {
        SpringApplication.run(SaveMoneyApplication.class, args);
    }
}

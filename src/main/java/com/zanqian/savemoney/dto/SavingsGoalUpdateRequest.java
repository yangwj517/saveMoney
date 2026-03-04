package com.zanqian.savemoney.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 储蓄目标更新请求DTO
 */
@Data
public class SavingsGoalUpdateRequest {
    /** 目标名称 */
    private String name;

    /** 目标金额 */
    private BigDecimal targetAmount;

    /** 截止日期（格式：yyyy-MM-dd） */
    private String deadline;

    /** 目标图标 */
    private String icon;

    /** 目标颜色 */
    private String color;
}

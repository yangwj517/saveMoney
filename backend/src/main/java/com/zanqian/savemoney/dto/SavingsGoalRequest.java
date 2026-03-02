package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 储蓄目标创建请求DTO
 */
@Data
public class SavingsGoalRequest {
    /** 目标名称，必填 */
    @NotBlank(message = "目标名称不能为空")
    private String name;

    /** 目标金额，必填且必须大于0 */
    @NotNull(message = "目标金额不能为空")
    @Positive(message = "目标金额必须大于0")
    private BigDecimal targetAmount;

    /** 账簿类型，必填 */
    @NotBlank(message = "账本类型不能为空")
    private String bookType;

    /** 截止日期（格式：yyyy-MM-dd） */
    private String deadline;

    /** 目标图标 */
    private String icon;

    /** 目标颜色 */
    private String color;

    /** 目标封面图片 */
    private String coverImage;
}

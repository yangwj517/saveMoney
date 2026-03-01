package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class SavingsGoalRequest {
    @NotBlank(message = "目标名称不能为空")
    private String name;

    @NotNull(message = "目标金额不能为空")
    @Positive(message = "目标金额必须大于0")
    private BigDecimal targetAmount;

    @NotBlank(message = "账本类型不能为空")
    private String bookType;

    private String deadline;
    private String icon;
    private String color;
    private String coverImage;
}

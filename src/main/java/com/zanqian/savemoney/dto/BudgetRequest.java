package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 预算创建请求DTO
 */
@Data
public class BudgetRequest {
    /** 分类ID */
    private String categoryId;

    /** 预算额度，必填且必须大于0 */
    @NotNull(message = "预算金额不能为空")
    @Positive(message = "预算金额必须大于0")
    private BigDecimal amount;

    /** 预算周期（"monthly"月度、"yearly"年度等），必填 */
    @NotBlank(message = "预算周期不能为空")
    private String period;

    /** 账簿类型，必填 */
    @NotBlank(message = "账本类型不能为空")
    private String bookType;

    /** 提醒阈值（百分比） */
    private Integer alertThreshold;

    /** 是否启用提醒 */
    private Boolean isAlertEnabled;
}

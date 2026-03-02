package com.zanqian.savemoney.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 预算更新请求DTO
 */
@Data
public class BudgetUpdateRequest {
    /** 预算额度 */
    private BigDecimal amount;

    /** 提醒阈值（百分比） */
    private Integer alertThreshold;

    /** 是否启用提醒 */
    private Boolean isAlertEnabled;
}

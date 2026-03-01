package com.zanqian.savemoney.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BudgetUpdateRequest {
    private BigDecimal amount;
    private Integer alertThreshold;
    private Boolean isAlertEnabled;
}

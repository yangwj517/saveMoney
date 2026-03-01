package com.zanqian.savemoney.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SavingsGoalUpdateRequest {
    private String name;
    private BigDecimal targetAmount;
    private String deadline;
    private String icon;
    private String color;
}

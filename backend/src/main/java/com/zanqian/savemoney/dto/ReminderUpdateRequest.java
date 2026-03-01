package com.zanqian.savemoney.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ReminderUpdateRequest {
    private String name;
    private BigDecimal amount;
    private Integer dueDay;
    private Boolean isEnabled;
    private String note;
}

package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ReminderRequest {
    @NotBlank(message = "提醒名称不能为空")
    private String name;

    @NotNull(message = "金额不能为空")
    private BigDecimal amount;

    @NotNull(message = "到期日不能为空")
    private Integer dueDay;

    private String categoryId;
    private Boolean isEnabled;
    private String note;
}

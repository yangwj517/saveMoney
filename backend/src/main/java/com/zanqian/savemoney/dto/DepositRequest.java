package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 储蓄存取请求DTO
 *
 * 用于储蓄目标的存入或提取操作
 */
@Data
public class DepositRequest {
    /** 存取金额，必填且必须大于0 */
    @NotNull(message = "金额不能为空")
    @Positive(message = "金额必须大于0")
    private BigDecimal amount;

    /** 存取备注 */
    private String note;
}

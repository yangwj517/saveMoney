package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 提醒创建请求DTO
 */
@Data
public class ReminderRequest {
    /** 提醒名称，必填 */
    @NotBlank(message = "提醒名称不能为空")
    private String name;

    /** 提醒金额，必填 */
    @NotNull(message = "金额不能为空")
    private BigDecimal amount;

    /** 每月提醒日期（1-31），必填 */
    @NotNull(message = "到期日不能为空")
    private Integer dueDay;

    /** 关联分类ID */
    private String categoryId;

    /** 是否启用提醒 */
    private Boolean isEnabled;

    /** 提醒备注 */
    private String note;
}

package com.zanqian.savemoney.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 提醒更新请求DTO
 */
@Data
public class ReminderUpdateRequest {
    /** 提醒名称 */
    private String name;

    /** 提醒金额 */
    private BigDecimal amount;

    /** 每月提醒日期（1-31） */
    private Integer dueDay;

    /** 是否启用提醒 */
    private Boolean isEnabled;

    /** 提醒备注 */
    private String note;
}

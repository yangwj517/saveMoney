package com.zanqian.savemoney.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * 账单记录更新请求DTO
 */
@Data
public class RecordUpdateRequest {
    /** 账单金额 */
    private BigDecimal amount;

    /** 账单类型（"income"收入或"expense"支出） */
    private String type;

    /** 分类ID */
    private String categoryId;

    /** 账户ID */
    private String accountId;

    /** 账单日期（格式：yyyy-MM-dd） */
    private String date;

    /** 账单备注 */
    private String note;

    /** 账单附图列表 */
    private List<String> images;
}

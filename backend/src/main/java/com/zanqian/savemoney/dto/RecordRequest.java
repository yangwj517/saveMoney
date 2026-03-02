package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * 账单记录创建请求DTO
 */
@Data
public class RecordRequest {
    /** 账单金额，必填且必须大于0 */
    @NotNull(message = "金额不能为空")
    @Positive(message = "金额必须大于0")
    private BigDecimal amount;

    /** 账单类型（"income"收入或"expense"支出），必填 */
    @NotBlank(message = "类型不能为空")
    private String type;

    /** 分类ID，必填 */
    @NotBlank(message = "分类不能为空")
    private String categoryId;

    /** 账户ID，必填 */
    @NotBlank(message = "账户不能为空")
    private String accountId;

    /** 账簿类型，必填 */
    @NotBlank(message = "账本类型不能为空")
    private String bookType;

    /** 账单日期（格式：yyyy-MM-dd），必填 */
    @NotBlank(message = "日期不能为空")
    private String date;

    /** 账单备注 */
    private String note;

    /** 账单附图列表 */
    private List<String> images;
}

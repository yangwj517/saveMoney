package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class RecordRequest {
    @NotNull(message = "金额不能为空")
    @Positive(message = "金额必须大于0")
    private BigDecimal amount;

    @NotBlank(message = "类型不能为空")
    private String type;

    @NotBlank(message = "分类不能为空")
    private String categoryId;

    @NotBlank(message = "账户不能为空")
    private String accountId;

    @NotBlank(message = "账本类型不能为空")
    private String bookType;

    @NotBlank(message = "日期不能为空")
    private String date;

    private String note;
    private List<String> images;
}

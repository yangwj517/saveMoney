package com.zanqian.savemoney.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class RecordUpdateRequest {
    private BigDecimal amount;
    private String type;
    private String categoryId;
    private String accountId;
    private String date;
    private String note;
    private List<String> images;
}

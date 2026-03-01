package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class FeedbackRequest {
    @NotBlank(message = "反馈类型不能为空")
    private String type;

    @NotBlank(message = "反馈内容不能为空")
    private String content;

    private String contact;
    private List<String> images;
}

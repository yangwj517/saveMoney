package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

/**
 * 用户反馈请求DTO
 */
@Data
public class FeedbackRequest {
    /** 反馈类型（如"bug"问题、"suggestion"建议等），必填 */
    @NotBlank(message = "反馈类型不能为空")
    private String type;

    /** 反馈内容，必填 */
    @NotBlank(message = "反馈内容不能为空")
    private String content;

    /** 反馈者联系方式（邮箱或电话） */
    private String contact;

    /** 反馈附图列表 */
    private List<String> images;
}

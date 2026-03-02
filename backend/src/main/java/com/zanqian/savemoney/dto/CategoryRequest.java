package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 分类创建请求DTO
 */
@Data
public class CategoryRequest {
    /** 分类名称，必填 */
    @NotBlank(message = "分类名称不能为空")
    private String name;

    /** 分类图标 */
    private String icon;

    /** 分类颜色 */
    private String color;

    /** 分类类型（"income"收入或"expense"支出），必填 */
    @NotBlank(message = "分类类型不能为空")
    private String type;

    /** 账簿类型，必填 */
    @NotBlank(message = "账本类型不能为空")
    private String bookType;

    /** 父分类ID（用于分层结构） */
    private String parentId;

    /** 排序顺序 */
    private Integer order;
}

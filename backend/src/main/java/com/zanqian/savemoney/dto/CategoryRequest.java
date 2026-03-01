package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank(message = "分类名称不能为空")
    private String name;
    private String icon;
    private String color;
    @NotBlank(message = "分类类型不能为空")
    private String type;
    @NotBlank(message = "账本类型不能为空")
    private String bookType;
    private String parentId;
    private Integer order;
}

package com.zanqian.savemoney.dto;

import lombok.Data;

/**
 * 分类更新请求DTO
 */
@Data
public class CategoryUpdateRequest {
    /** 分类名称 */
    private String name;

    /** 分类图标 */
    private String icon;

    /** 分类颜色 */
    private String color;

    /** 排序顺序 */
    private Integer order;
}

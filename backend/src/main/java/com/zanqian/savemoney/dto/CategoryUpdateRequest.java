package com.zanqian.savemoney.dto;

import lombok.Data;

@Data
public class CategoryUpdateRequest {
    private String name;
    private String icon;
    private String color;
    private Integer order;
}

package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;

/**
 * 分类实体类
 *
 * 用于对账单进行分类标签
 * 支持自定义分类以及分层结构（父子分类）
 */
@Data
@Entity
@Table(name = "categories")
public class Category {
    /** 分类ID（主键），使用UUID自动生成 */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /** 所属用户ID */
    private String userId;

    /** 分类名称（如"食物"、"交通"等） */
    private String name;

    /** 分类图标 */
    private String icon;

    /** 分类颜色 */
    private String color;

    /** 分类类型（"income"收入或"expense"支出） */
    private String type;

    /** 所属账簿类型 */
    private String bookType;

    /** 父分类ID，用于分层结构（NULL表示顶级分类） */
    private String parentId;

    /** 分类排序顺序 */
    @Column(name = "sort_order")
    private Integer order;
}

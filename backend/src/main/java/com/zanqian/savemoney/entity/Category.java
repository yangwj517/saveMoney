package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String userId;
    private String name;
    private String icon;
    private String color;
    private String type;
    private String bookType;
    private String parentId;

    @Column(name = "sort_order")
    private Integer order;
}

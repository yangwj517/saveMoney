package com.zanqian.savemoney.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * API 统一响应类
 *
 * 用于封装所有接口的返回数据，包括状态码、消息、数据内容
 *
 * @param <T> 响应数据的泛型类型
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.ALWAYS)
public class ApiResponse<T> {
    /** 响应状态码，0表示成功，其他值表示各种错误码 */
    private int code;

    /** 响应消息描述 */
    private String message;

    /** 响应数据内容 */
    private T data;

    /**
     * 构建成功响应（包含数据）
     *
     * @param data 响应数据
     * @return ApiResponse 对象
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(0, "success", data);
    }

    /**
     * 构建成功响应（不包含数据）
     *
     * @return ApiResponse 对象
     */
    public static <T> ApiResponse<T> success() {
        return new ApiResponse<>(0, "success", null);
    }

    /**
     * 构建错误响应
     *
     * @param code 错误码
     * @param message 错误消息
     * @return ApiResponse 对象
     */
    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, message, null);
    }
}

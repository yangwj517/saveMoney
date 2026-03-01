package com.zanqian.savemoney.common;

import lombok.Getter;

@Getter
public enum ErrorCode {
    SUCCESS(0, "success"),
    PARAM_ERROR(10001, "参数错误"),
    DATA_NOT_FOUND(10002, "数据不存在"),
    DATA_ALREADY_EXISTS(10003, "数据已存在"),
    UNAUTHORIZED(20001, "请先登录"),
    TOKEN_EXPIRED(20002, "登录已过期，请重新登录"),
    FORBIDDEN(20003, "无权操作此资源"),
    SERVER_ERROR(30001, "服务器繁忙，请稍后重试");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}

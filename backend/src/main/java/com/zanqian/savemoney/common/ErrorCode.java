package com.zanqian.savemoney.common;

import lombok.Getter;

/**
 * 系统错误码定义
 *
 * 统一定义应用中所有可能的错误码及其对应的错误消息
 *
 * 错误码规则：
 * - 0: 成功
 * - 10001-10099: 参数与数据错误
 * - 20001-20099: 认证与授权错误
 * - 30001-30099: 系统错误
 */
@Getter
public enum ErrorCode {
    /** 成功 */
    SUCCESS(0, "success"),

    /** 参数错误 */
    PARAM_ERROR(10001, "参数错误"),

    /** 数据不存在 */
    DATA_NOT_FOUND(10002, "数据不存在"),

    /** 数据已存在 */
    DATA_ALREADY_EXISTS(10003, "数据已存在"),

    /** 未授权（未登录） */
    UNAUTHORIZED(20001, "请先登录"),

    /** Token 已过期 */
    TOKEN_EXPIRED(20002, "登录已过期，请重新登录"),

    /** 无权操作此资源 */
    FORBIDDEN(20003, "无权操作此资源"),

    /** 服务器繁忙 */
    SERVER_ERROR(30001, "服务器繁忙，请稍后重试");

    /** 错误码 */
    private final int code;

    /** 错误消息 */
    private final String message;

    /**
     * 构造函数
     *
     * @param code 错误码
     * @param message 错误消息
     */
    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}

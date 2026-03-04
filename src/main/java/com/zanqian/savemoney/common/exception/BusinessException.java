package com.zanqian.savemoney.common.exception;

import com.zanqian.savemoney.common.ErrorCode;
import lombok.Getter;

/**
 * 业务异常类
 *
 * 用于捕获和处理业务逻辑中的异常情况
 * 包含错误码和错误消息，便于统一处理和返回给客户端
 */
@Getter
public class BusinessException extends RuntimeException {
    /** 错误码 */
    private final int code;

    /**
     * 使用错误码枚举构造异常
     *
     * @param errorCode 错误码枚举
     */
    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
    }

    /**
     * 使用错误码枚举和自定义消息构造异常
     *
     * @param errorCode 错误码枚举
     * @param message 自定义错误消息
     */
    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.code = errorCode.getCode();
    }

    /**
     * 使用错误码和消息构造异常
     *
     * @param code 错误码
     * @param message 错误消息
     */
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }
}

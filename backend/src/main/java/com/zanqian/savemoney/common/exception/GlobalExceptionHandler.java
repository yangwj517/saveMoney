package com.zanqian.savemoney.common.exception;

import com.zanqian.savemoney.common.ApiResponse;
import com.zanqian.savemoney.common.ErrorCode;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器
 *
 * 统一处理应用中发生的各类异常，包括：
 * - 业务异常：由应用业务逻辑抛出
 * - 参数验证异常：参数校验失败
 * - 权限异常：无权访问资源
 * - 其他未预期异常：系统异常
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理业务异常
     *
     * @param e 业务异常
     * @return 格式化的错误响应
     */
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> handleBusinessException(BusinessException e) {
        return ApiResponse.error(e.getCode(), e.getMessage());
    }

    /**
     * 处理方法参数验证异常
     *
     * 当请求体中的参数验证失败时触发
     *
     * @param e 验证异常
     * @return 格式化的参数错误响应
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> handleValidationException(MethodArgumentNotValidException e) {
        FieldError fieldError = e.getBindingResult().getFieldError();
        String message = fieldError != null
                ? "参数错误: " + fieldError.getField() + fieldError.getDefaultMessage()
                : "参数错误";
        return ApiResponse.error(ErrorCode.PARAM_ERROR.getCode(), message);
    }

    /**
     * 处理缺少请求参数异常
     *
     * 当必需的请求参数缺失时触发
     *
     * @param e 缺少参数异常
     * @return 格式化的参数错误响应
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> handleMissingParam(MissingServletRequestParameterException e) {
        return ApiResponse.error(ErrorCode.PARAM_ERROR.getCode(),
                "参数错误: 缺少参数 " + e.getParameterName());
    }

    /**
     * 处理验证码错误异常
     *
     * @param e 坏凭据异常
     * @return 格式化的验证码错误响应
     */
    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> handleBadCredentials(BadCredentialsException e) {
        return ApiResponse.error(ErrorCode.UNAUTHORIZED.getCode(), "验证码错误");
    }

    /**
     * 处理访问拒绝异常（权限不足）
     *
     * @param e 访问拒绝异常
     * @return 格式化的权限错误响应
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> handleAccessDenied(AccessDeniedException e) {
        return ApiResponse.error(ErrorCode.FORBIDDEN.getCode(), ErrorCode.FORBIDDEN.getMessage());
    }

    /**
     * 处理未预期的异常
     *
     * 捕获所有未被特定处理器捕获的异常
     *
     * @param e 异常
     * @return 格式化的服务器错误响应
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> handleException(Exception e) {
        return ApiResponse.error(ErrorCode.SERVER_ERROR.getCode(), ErrorCode.SERVER_ERROR.getMessage());
    }
}

package com.zanqian.savemoney.dto;

import lombok.Data;

/**
 * 用户资料更新请求DTO
 */
@Data
public class UserProfileUpdateRequest {
    /** 用户昵称 */
    private String nickname;

    /** 用户头像URL */
    private String avatar;

    /** 用户邮箱 */
    private String email;
}

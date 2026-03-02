/**
 * 攒钱记账 - 认证服务
 */

import api, { unwrap } from './api';

/** 发送短信验证码 */
export async function sendSms(phone: string) {
  return unwrap<{ expireIn: number }>(
    api.post('/auth/sms/send', { phone })
  );
}

/** 手机号 + 验证码登录 */
export async function loginByPhone(phone: string, code: string) {
  return unwrap<{
    token: string;
    refreshToken: string;
    expiresIn: number;
    user: {
      id: string;
      nickname: string;
      avatar: string;
      phone: string;
      email: string;
      createdAt: string;
    };
  }>(api.post('/auth/login/phone', { phone, code }));
}

/** 刷新令牌 */
export async function refreshToken(refreshTokenStr: string) {
  return unwrap<{
    token: string;
    refreshToken: string;
    expiresIn: number;
  }>(api.post('/auth/token/refresh', { refreshToken: refreshTokenStr }));
}

/** 登出 */
export async function logout() {
  return unwrap<void>(api.post('/auth/logout'));
}


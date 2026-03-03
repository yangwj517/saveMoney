/**
 * 攒钱记账 - 认证服务
 */

import api, { unwrap } from './api';

/** 发送短信验证码 */
export async function sendSms(phone: string) {
  return unwrap<{ expireIn: number; smCode?: string }>(
    api.post('/auth/sms/send', { phone })
  );
}

/** 手机号 + 密码登录 */
export async function loginByPassword(phone: string, password: string) {
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
  }>(api.post('/auth/login/password', { phone, password }));
}

/** 手机号注册 */
export async function register(phone: string, password: string, code: string) {
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
  }>(api.post('/auth/register', { phone, password, code }));
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

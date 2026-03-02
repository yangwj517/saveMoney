/**
 * 攒钱记账 - 用户服务
 */

import api, { unwrap } from './api';

export interface UserProfileUpdateParams {
  nickname?: string;
  avatar?: string;
  email?: string;
}

/** 获取用户资料 */
export async function getProfile() {
  return unwrap<any>(api.get('/user/profile'));
}

/** 更新用户资料 */
export async function updateProfile(data: UserProfileUpdateParams) {
  return unwrap<any>(api.put('/user/profile', data));
}

/** 上传用户头像 */
export async function uploadAvatar(file: { uri: string; name: string; type: string }) {
  const formData = new FormData();
  formData.append('file', file as any);
  return unwrap<{ url: string }>(
    api.post('/user/avatar/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  );
}


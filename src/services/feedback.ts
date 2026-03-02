/**
 * 攒钱记账 - 反馈服务
 */

import api, { unwrap } from './api';

export interface FeedbackCreateParams {
  type: string;
  content: string;
  contact?: string;
  images?: string[];
}

/** 提交反馈 */
export async function submitFeedback(data: FeedbackCreateParams) {
  return unwrap<any>(api.post('/feedback', data));
}

/** 上传反馈图片 */
export async function uploadFeedbackImage(file: { uri: string; name: string; type: string }) {
  const formData = new FormData();
  formData.append('file', file as any);
  return unwrap<{ url: string }>(
    api.post('/feedback/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  );
}


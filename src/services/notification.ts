/**
 * 攒钱记账 - 通知服务
 */

import api, { unwrap } from './api';

/** 获取通知列表（分页） */
export async function getNotifications(
  page: number = 1,
  pageSize: number = 20,
  isRead?: boolean
) {
  return unwrap<any>(
    api.get('/notifications', { params: { page, pageSize, isRead } })
  );
}

/** 标记单个通知为已读 */
export async function markAsRead(id: string) {
  return unwrap<void>(api.put(`/notifications/${id}/read`));
}

/** 标记全部通知为已读 */
export async function markAllAsRead() {
  return unwrap<void>(api.put('/notifications/read-all'));
}

/** 删除通知 */
export async function deleteNotification(id: string) {
  return unwrap<void>(api.delete(`/notifications/${id}`));
}


/**
 * 攒钱记账 - 提醒服务
 */

import api, { unwrap } from './api';

export interface ReminderCreateParams {
  name: string;
  amount: number;
  dueDay: number;
  categoryId?: string;
  isEnabled?: boolean;
  note?: string;
}

export interface ReminderUpdateParams {
  name?: string;
  amount?: number;
  dueDay?: number;
  isEnabled?: boolean;
  note?: string;
}

export interface ReminderSettingsParams {
  billReminder?: boolean;
  billReminderTime?: string;
  savingsReminder?: boolean;
  savingsReminderTime?: string;
  budgetAlert?: boolean;
  budgetAlertThreshold?: number;
}

/** 获取提醒列表 */
export async function getReminders() {
  return unwrap<any[]>(api.get('/reminders'));
}

/** 创建提醒 */
export async function createReminder(data: ReminderCreateParams) {
  return unwrap<any>(api.post('/reminders', data));
}

/** 更新提醒 */
export async function updateReminder(id: string, data: ReminderUpdateParams) {
  return unwrap<any>(api.put(`/reminders/${id}`, data));
}

/** 删除提醒 */
export async function deleteReminder(id: string) {
  return unwrap<void>(api.delete(`/reminders/${id}`));
}

/** 获取提醒设置 */
export async function getReminderSettings() {
  return unwrap<any>(api.get('/reminders/settings'));
}

/** 更新提醒设置 */
export async function updateReminderSettings(data: ReminderSettingsParams) {
  return unwrap<any>(api.put('/reminders/settings', data));
}


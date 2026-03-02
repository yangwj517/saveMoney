/**
 * 攒钱记账 - 账户服务
 */

import api, { unwrap } from './api';

export interface AccountCreateParams {
  name: string;
  balance?: number;
  icon?: string;
  color?: string;
  bookType: string;
  isDefault?: boolean;
}

export interface AccountUpdateParams {
  name?: string;
  balance?: number;
  icon?: string;
  color?: string;
  isDefault?: boolean;
}

/** 获取账户列表 */
export async function getAccounts(bookType: string) {
  return unwrap<any[]>(api.get('/accounts', { params: { bookType } }));
}

/** 创建账户 */
export async function createAccount(data: AccountCreateParams) {
  return unwrap<any>(api.post('/accounts', data));
}

/** 更新账户 */
export async function updateAccount(id: string, data: AccountUpdateParams) {
  return unwrap<any>(api.put(`/accounts/${id}`, data));
}

/** 删除账户 */
export async function deleteAccount(id: string) {
  return unwrap<void>(api.delete(`/accounts/${id}`));
}


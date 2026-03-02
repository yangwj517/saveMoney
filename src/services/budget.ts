/**
 * 攒钱记账 - 预算服务
 */

import api, { unwrap } from './api';

export interface BudgetCreateParams {
  categoryId?: string;
  amount: number;
  period: string;
  bookType: string;
  alertThreshold?: number;
  isAlertEnabled?: boolean;
}

export interface BudgetUpdateParams {
  amount?: number;
  alertThreshold?: number;
  isAlertEnabled?: boolean;
}

/** 获取预算列表 */
export async function getBudgets(bookType: string, period?: string) {
  return unwrap<any[]>(
    api.get('/budgets', { params: { bookType, period } })
  );
}

/** 创建预算 */
export async function createBudget(data: BudgetCreateParams) {
  return unwrap<any>(api.post('/budgets', data));
}

/** 更新预算 */
export async function updateBudget(id: string, data: BudgetUpdateParams) {
  return unwrap<any>(api.put(`/budgets/${id}`, data));
}

/** 删除预算 */
export async function deleteBudget(id: string) {
  return unwrap<void>(api.delete(`/budgets/${id}`));
}


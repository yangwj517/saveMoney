/**
 * 攒钱记账 - 储蓄目标服务
 */

import api, { unwrap } from './api';

export interface SavingsGoalCreateParams {
  name: string;
  targetAmount: number;
  bookType: string;
  deadline?: string;
  icon?: string;
  color?: string;
  coverImage?: string;
}

export interface SavingsGoalUpdateParams {
  name?: string;
  targetAmount?: number;
  deadline?: string;
  icon?: string;
  color?: string;
}

export interface DepositParams {
  amount: number;
  note?: string;
}

/** 获取储蓄目标列表 */
export async function getGoals(bookType: string, isCompleted?: boolean) {
  return unwrap<any[]>(
    api.get('/savings/goals', { params: { bookType, isCompleted } })
  );
}

/** 获取储蓄目标详情 */
export async function getGoal(id: string) {
  return unwrap<any>(api.get(`/savings/goals/${id}`));
}

/** 创建储蓄目标 */
export async function createGoal(data: SavingsGoalCreateParams) {
  return unwrap<any>(api.post('/savings/goals', data));
}

/** 更新储蓄目标 */
export async function updateGoal(id: string, data: SavingsGoalUpdateParams) {
  return unwrap<any>(api.put(`/savings/goals/${id}`, data));
}

/** 删除储蓄目标 */
export async function deleteGoal(id: string) {
  return unwrap<void>(api.delete(`/savings/goals/${id}`));
}

/** 存入 */
export async function deposit(id: string, data: DepositParams) {
  return unwrap<any>(api.post(`/savings/goals/${id}/deposits`, data));
}

/** 提取 */
export async function withdraw(id: string, data: DepositParams) {
  return unwrap<any>(api.post(`/savings/goals/${id}/withdraw`, data));
}


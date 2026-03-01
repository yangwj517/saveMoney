/**
 * 攒钱记账 - 攒钱目标 Mock 数据
 */

import { SavingsGoal, SavingsDeposit } from '@/types';

// 模拟攒钱目标
export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: 'sg1',
    name: '旅行基金',
    targetAmount: 10000,
    currentAmount: 4500,
    bookType: 'personal',
    deadline: '2025-06-30',
    icon: 'plane',
    color: '#4ECDC4',
    isCompleted: false,
    createdAt: '2025-01-01',
    updatedAt: '2025-03-01',
  },
  {
    id: 'sg2',
    name: '新手机',
    targetAmount: 6000,
    currentAmount: 2800,
    bookType: 'personal',
    deadline: '2025-04-15',
    icon: 'mobile',
    color: '#9C6ADE',
    isCompleted: false,
    createdAt: '2025-01-15',
    updatedAt: '2025-02-28',
  },
  {
    id: 'sg3',
    name: '紧急备用金',
    targetAmount: 20000,
    currentAmount: 12000,
    bookType: 'personal',
    icon: 'shield',
    color: '#3867D6',
    isCompleted: false,
    createdAt: '2024-06-01',
    updatedAt: '2025-02-20',
  },
  {
    id: 'sg4',
    name: '年会活动基金',
    targetAmount: 5000,
    currentAmount: 3000,
    bookType: 'business',
    deadline: '2025-12-01',
    icon: 'users',
    color: '#2E7EB5',
    isCompleted: false,
    createdAt: '2025-02-01',
    updatedAt: '2025-03-01',
  },
];

// 模拟存入记录
export const mockSavingsDeposits: SavingsDeposit[] = [
  {
    id: 'sd1',
    goalId: 'sg1',
    amount: 500,
    note: '本月存入',
    createdAt: '2025-03-01T10:00:00',
  },
  {
    id: 'sd2',
    goalId: 'sg1',
    amount: 1000,
    note: '年终奖存入',
    createdAt: '2025-02-15T14:30:00',
  },
  {
    id: 'sd3',
    goalId: 'sg2',
    amount: 800,
    note: '兼职收入',
    createdAt: '2025-02-28T09:00:00',
  },
  {
    id: 'sd4',
    goalId: 'sg3',
    amount: 2000,
    note: '每月定存',
    createdAt: '2025-02-20T08:00:00',
  },
];

// 根据账本类型获取目标
export const getSavingsGoalsByBookType = (bookType?: 'personal' | 'business'): SavingsGoal[] => {
  if (!bookType) return mockSavingsGoals;
  return mockSavingsGoals.filter(g => g.bookType === bookType);
};

// 获取目标的存入记录
export const getDepositsByGoalId = (goalId: string): SavingsDeposit[] => {
  return mockSavingsDeposits
    .filter(d => d.goalId === goalId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// 获取活跃的攒钱目标（未完成）
export const getActiveSavingsGoals = (): SavingsGoal[] => {
  return mockSavingsGoals.filter(g => !g.isCompleted);
};

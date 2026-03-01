/**
 * 攒钱记账 - 类型定义
 */

// 账本类型
export type AccountBookType = 'personal' | 'business';

// 交易类型
export type TransactionType = 'expense' | 'income';

// 用户信息
export interface User {
  id: string;
  nickname: string;
  avatar?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

// 账户（如现金、银行卡等）
export interface Account {
  id: string;
  name: string;
  balance: number;
  icon: string;
  color: string;
  bookType: AccountBookType;
  isDefault?: boolean;
  createdAt: string;
}

// 分类
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  bookType: AccountBookType;
  parentId?: string;
  order?: number;
}

// 账单记录
export interface Record {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  category?: Category;
  accountId: string;
  account?: Account;
  bookType: AccountBookType;
  date: string;
  note?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

// 攒钱目标
export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  bookType: AccountBookType;
  deadline?: string;
  icon?: string;
  color?: string;
  coverImage?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// 攒钱记录
export interface SavingsDeposit {
  id: string;
  goalId: string;
  amount: number;
  note?: string;
  createdAt: string;
}

// 预算
export interface Budget {
  id: string;
  categoryId?: string;
  amount: number;
  usedAmount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  bookType: AccountBookType;
  alertThreshold?: number;
  isAlertEnabled: boolean;
}

// 统计数据
export interface Statistics {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryStats: CategoryStat[];
  dailyStats: DailyStat[];
}

export interface CategoryStat {
  categoryId: string;
  category?: Category;
  amount: number;
  percentage: number;
  count: number;
}

export interface DailyStat {
  date: string;
  income: number;
  expense: number;
}

// 账本总览
export interface BookOverview {
  bookType: AccountBookType;
  totalBalance: number;
  todayIncome: number;
  todayExpense: number;
  monthIncome: number;
  monthExpense: number;
}

// 提醒设置
export interface ReminderSettings {
  billReminder: boolean;
  billReminderTime?: string;
  savingsReminder: boolean;
  savingsReminderTime?: string;
  budgetAlert: boolean;
  budgetAlertThreshold?: number;
}

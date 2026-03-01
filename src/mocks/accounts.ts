/**
 * 攒钱记账 - 账户 Mock 数据
 */

import { Account } from '@/types';

// 个人账户
export const personalAccounts: Account[] = [
  {
    id: 'pa_cash',
    name: '现金',
    balance: 1200,
    icon: 'wallet',
    color: '#4ECDC4',
    bookType: 'personal',
    isDefault: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'pa_bank',
    name: '银行卡',
    balance: 8500,
    icon: 'credit-card',
    color: '#3867D6',
    bookType: 'personal',
    createdAt: '2024-01-01',
  },
  {
    id: 'pa_alipay',
    name: '支付宝',
    balance: 2100,
    icon: 'mobile',
    color: '#1890FF',
    bookType: 'personal',
    createdAt: '2024-01-01',
  },
  {
    id: 'pa_wechat',
    name: '微信',
    balance: 780,
    icon: 'comment',
    color: '#07C160',
    bookType: 'personal',
    createdAt: '2024-01-01',
  },
];

// 公司账户
export const businessAccounts: Account[] = [
  {
    id: 'ba_cash',
    name: '备用金',
    balance: 5000,
    icon: 'wallet',
    color: '#2E7EB5',
    bookType: 'business',
    isDefault: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'ba_card',
    name: '公司卡',
    balance: 0,
    icon: 'credit-card',
    color: '#1D5A8A',
    bookType: 'business',
    createdAt: '2024-01-01',
  },
];

// 获取所有账户
export const getAllAccounts = (): Account[] => [
  ...personalAccounts,
  ...businessAccounts,
];

// 根据账本类型获取账户
export const getAccountsByBookType = (bookType: 'personal' | 'business'): Account[] => {
  return bookType === 'personal' ? personalAccounts : businessAccounts;
};

// 计算个人总资产
export const getPersonalTotalBalance = (): number => {
  return personalAccounts.reduce((sum, acc) => sum + acc.balance, 0);
};

// 计算公司总资产
export const getBusinessTotalBalance = (): number => {
  return businessAccounts.reduce((sum, acc) => sum + acc.balance, 0);
};

/**
 * 攒钱记账 - 账单记录 Mock 数据
 */

import { Record } from '@/types';
import { getAllCategories } from './categories';
import { getAllAccounts } from './accounts';

const categories = getAllCategories();
const accounts = getAllAccounts();

// 模拟账单记录
export const mockRecords: Record[] = [
  {
    id: 'r1',
    amount: 35,
    type: 'expense',
    categoryId: 'p_food',
    category: categories.find(c => c.id === 'p_food'),
    accountId: 'pa_alipay',
    account: accounts.find(a => a.id === 'pa_alipay'),
    bookType: 'personal',
    date: '2025-03-01',
    note: '午餐',
    createdAt: '2025-03-01T12:30:00',
    updatedAt: '2025-03-01T12:30:00',
  },
  {
    id: 'r2',
    amount: 15,
    type: 'expense',
    categoryId: 'p_transport',
    category: categories.find(c => c.id === 'p_transport'),
    accountId: 'pa_wechat',
    account: accounts.find(a => a.id === 'pa_wechat'),
    bookType: 'personal',
    date: '2025-03-01',
    note: '地铁',
    createdAt: '2025-03-01T08:15:00',
    updatedAt: '2025-03-01T08:15:00',
  },
  {
    id: 'r3',
    amount: 320,
    type: 'income',
    categoryId: 'p_redpacket',
    category: categories.find(c => c.id === 'p_redpacket'),
    accountId: 'pa_wechat',
    account: accounts.find(a => a.id === 'pa_wechat'),
    bookType: 'personal',
    date: '2025-03-01',
    note: '生日红包',
    createdAt: '2025-03-01T10:00:00',
    updatedAt: '2025-03-01T10:00:00',
  },
  {
    id: 'r4',
    amount: 128,
    type: 'expense',
    categoryId: 'b_meal',
    category: categories.find(c => c.id === 'b_meal'),
    accountId: 'ba_cash',
    account: accounts.find(a => a.id === 'ba_cash'),
    bookType: 'business',
    date: '2025-02-28',
    note: '客户招待',
    createdAt: '2025-02-28T19:30:00',
    updatedAt: '2025-02-28T19:30:00',
  },
  {
    id: 'r5',
    amount: 8500,
    type: 'income',
    categoryId: 'p_salary',
    category: categories.find(c => c.id === 'p_salary'),
    accountId: 'pa_bank',
    account: accounts.find(a => a.id === 'pa_bank'),
    bookType: 'personal',
    date: '2025-02-25',
    note: '2月工资',
    createdAt: '2025-02-25T10:00:00',
    updatedAt: '2025-02-25T10:00:00',
  },
  {
    id: 'r6',
    amount: 299,
    type: 'expense',
    categoryId: 'p_shopping',
    category: categories.find(c => c.id === 'p_shopping'),
    accountId: 'pa_alipay',
    account: accounts.find(a => a.id === 'pa_alipay'),
    bookType: 'personal',
    date: '2025-02-24',
    note: '网购衣服',
    createdAt: '2025-02-24T20:15:00',
    updatedAt: '2025-02-24T20:15:00',
  },
];

// 获取今日记录
export const getTodayRecords = (): Record[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockRecords.filter(r => r.date === today);
};

// 获取最近记录
export const getRecentRecords = (limit: number = 5): Record[] => {
  return [...mockRecords]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

// 根据账本类型获取记录
export const getRecordsByBookType = (bookType: 'personal' | 'business'): Record[] => {
  return mockRecords.filter(r => r.bookType === bookType);
};

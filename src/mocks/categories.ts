/**
 * 攒钱记账 - 分类 Mock 数据
 */

import { Category } from '@/types';

// 个人账本支出分类
export const personalExpenseCategories: Category[] = [
  { id: 'p_food', name: '餐饮', icon: 'utensils', color: '#FF6B6B', type: 'expense', bookType: 'personal' },
  { id: 'p_transport', name: '交通', icon: 'car', color: '#4ECDC4', type: 'expense', bookType: 'personal' },
  { id: 'p_shopping', name: '购物', icon: 'shopping-bag', color: '#9C6ADE', type: 'expense', bookType: 'personal' },
  { id: 'p_entertainment', name: '娱乐', icon: 'gamepad', color: '#F7B731', type: 'expense', bookType: 'personal' },
  { id: 'p_medical', name: '医疗', icon: 'heartbeat', color: '#EB3B5A', type: 'expense', bookType: 'personal' },
  { id: 'p_education', name: '教育', icon: 'book', color: '#3867D6', type: 'expense', bookType: 'personal' },
  { id: 'p_housing', name: '住房', icon: 'home', color: '#20BF6B', type: 'expense', bookType: 'personal' },
  { id: 'p_utilities', name: '水电', icon: 'bolt', color: '#FA8231', type: 'expense', bookType: 'personal' },
  { id: 'p_communication', name: '通讯', icon: 'phone', color: '#2E7EB5', type: 'expense', bookType: 'personal' },
  { id: 'p_personal', name: '个人护理', icon: 'user', color: '#E91E63', type: 'expense', bookType: 'personal' },
  { id: 'p_gift', name: '礼物', icon: 'gift', color: '#9C27B0', type: 'expense', bookType: 'personal' },
  { id: 'p_other', name: '其他', icon: 'ellipsis-h', color: '#6B7280', type: 'expense', bookType: 'personal' },
];

// 个人账本收入分类
export const personalIncomeCategories: Category[] = [
  { id: 'p_salary', name: '工资', icon: 'briefcase', color: '#4ECDC4', type: 'income', bookType: 'personal' },
  { id: 'p_bonus', name: '奖金', icon: 'award', color: '#F7B731', type: 'income', bookType: 'personal' },
  { id: 'p_investment', name: '投资收益', icon: 'chart-line', color: '#20BF6B', type: 'income', bookType: 'personal' },
  { id: 'p_parttime', name: '兼职', icon: 'clock', color: '#3867D6', type: 'income', bookType: 'personal' },
  { id: 'p_redpacket', name: '红包', icon: 'envelope', color: '#EB3B5A', type: 'income', bookType: 'personal' },
  { id: 'p_other_income', name: '其他收入', icon: 'plus-circle', color: '#6B7280', type: 'income', bookType: 'personal' },
];

// 公司账本支出分类
export const businessExpenseCategories: Category[] = [
  { id: 'b_office', name: '办公用品', icon: 'paperclip', color: '#2E7EB5', type: 'expense', bookType: 'business' },
  { id: 'b_travel', name: '差旅', icon: 'plane', color: '#3867D6', type: 'expense', bookType: 'business' },
  { id: 'b_meal', name: '招待餐饮', icon: 'utensils', color: '#FF6B6B', type: 'expense', bookType: 'business' },
  { id: 'b_transport', name: '交通费用', icon: 'taxi', color: '#4ECDC4', type: 'expense', bookType: 'business' },
  { id: 'b_communication', name: '通讯费', icon: 'phone', color: '#9C6ADE', type: 'expense', bookType: 'business' },
  { id: 'b_equipment', name: '设备', icon: 'laptop', color: '#20BF6B', type: 'expense', bookType: 'business' },
  { id: 'b_other', name: '其他', icon: 'ellipsis-h', color: '#6B7280', type: 'expense', bookType: 'business' },
];

// 公司账本收入分类
export const businessIncomeCategories: Category[] = [
  { id: 'b_reimbursement', name: '报销', icon: 'receipt', color: '#4ECDC4', type: 'income', bookType: 'business' },
  { id: 'b_advance', name: '预支', icon: 'hand-holding-usd', color: '#2E7EB5', type: 'income', bookType: 'business' },
  { id: 'b_other_income', name: '其他', icon: 'plus-circle', color: '#6B7280', type: 'income', bookType: 'business' },
];

// 获取所有分类
export const getAllCategories = (): Category[] => [
  ...personalExpenseCategories,
  ...personalIncomeCategories,
  ...businessExpenseCategories,
  ...businessIncomeCategories,
];

// 根据账本类型和交易类型获取分类
export const getCategoriesByBookAndType = (
  bookType: 'personal' | 'business',
  transactionType: 'expense' | 'income'
): Category[] => {
  if (bookType === 'personal') {
    return transactionType === 'expense' ? personalExpenseCategories : personalIncomeCategories;
  }
  return transactionType === 'expense' ? businessExpenseCategories : businessIncomeCategories;
};

/**
 * 攒钱记账 - 默认分类数据
 * 当后端没有分类数据时，使用这些预设分类
 */

export interface DefaultCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
  bookType: 'personal' | 'business';
  order: number;
}

// 个人账本 - 支出分类
export const PERSONAL_EXPENSE_CATEGORIES: DefaultCategory[] = [
  { id: 'p_exp_food', name: '餐饮', icon: '🍜', color: '#FF9800', type: 'expense', bookType: 'personal', order: 1 },
  { id: 'p_exp_transport', name: '交通', icon: '🚗', color: '#2196F3', type: 'expense', bookType: 'personal', order: 2 },
  { id: 'p_exp_shopping', name: '购物', icon: '🛒', color: '#E91E63', type: 'expense', bookType: 'personal', order: 3 },
  { id: 'p_exp_entertainment', name: '娱乐', icon: '🎮', color: '#9C27B0', type: 'expense', bookType: 'personal', order: 4 },
  { id: 'p_exp_home', name: '住房', icon: '🏠', color: '#795548', type: 'expense', bookType: 'personal', order: 5 },
  { id: 'p_exp_utility', name: '水电燃', icon: '💡', color: '#FFC107', type: 'expense', bookType: 'personal', order: 6 },
  { id: 'p_exp_communication', name: '通讯', icon: '📱', color: '#00BCD4', type: 'expense', bookType: 'personal', order: 7 },
  { id: 'p_exp_medical', name: '医疗', icon: '💊', color: '#F44336', type: 'expense', bookType: 'personal', order: 8 },
  { id: 'p_exp_education', name: '教育', icon: '📚', color: '#3F51B5', type: 'expense', bookType: 'personal', order: 9 },
  { id: 'p_exp_gift', name: '人情', icon: '🎁', color: '#FF5722', type: 'expense', bookType: 'personal', order: 10 },
  { id: 'p_exp_clothes', name: '服饰', icon: '👔', color: '#607D8B', type: 'expense', bookType: 'personal', order: 11 },
  { id: 'p_exp_beauty', name: '美容', icon: '💄', color: '#EC407A', type: 'expense', bookType: 'personal', order: 12 },
  { id: 'p_exp_sports', name: '运动', icon: '⚽', color: '#4CAF50', type: 'expense', bookType: 'personal', order: 13 },
  { id: 'p_exp_pet', name: '宠物', icon: '🐱', color: '#8D6E63', type: 'expense', bookType: 'personal', order: 14 },
  { id: 'p_exp_other', name: '其他', icon: '📝', color: '#9E9E9E', type: 'expense', bookType: 'personal', order: 15 },
];

// 个人账本 - 收入分类
export const PERSONAL_INCOME_CATEGORIES: DefaultCategory[] = [
  { id: 'p_inc_salary', name: '工资', icon: '💰', color: '#4CAF50', type: 'income', bookType: 'personal', order: 1 },
  { id: 'p_inc_bonus', name: '奖金', icon: '🎉', color: '#FF9800', type: 'income', bookType: 'personal', order: 2 },
  { id: 'p_inc_invest', name: '投资', icon: '📈', color: '#2196F3', type: 'income', bookType: 'personal', order: 3 },
  { id: 'p_inc_parttime', name: '兼职', icon: '💼', color: '#9C27B0', type: 'income', bookType: 'personal', order: 4 },
  { id: 'p_inc_redpacket', name: '红包', icon: '🧧', color: '#F44336', type: 'income', bookType: 'personal', order: 5 },
  { id: 'p_inc_refund', name: '退款', icon: '↩️', color: '#00BCD4', type: 'income', bookType: 'personal', order: 6 },
  { id: 'p_inc_other', name: '其他', icon: '📝', color: '#9E9E9E', type: 'income', bookType: 'personal', order: 7 },
];

// 公司账本 - 支出分类
export const BUSINESS_EXPENSE_CATEGORIES: DefaultCategory[] = [
  { id: 'b_exp_salary', name: '工资', icon: '💵', color: '#4CAF50', type: 'expense', bookType: 'business', order: 1 },
  { id: 'b_exp_rent', name: '房租', icon: '🏢', color: '#795548', type: 'expense', bookType: 'business', order: 2 },
  { id: 'b_exp_utility', name: '水电', icon: '💡', color: '#FFC107', type: 'expense', bookType: 'business', order: 3 },
  { id: 'b_exp_office', name: '办公', icon: '🖨️', color: '#607D8B', type: 'expense', bookType: 'business', order: 4 },
  { id: 'b_exp_marketing', name: '营销', icon: '📢', color: '#E91E63', type: 'expense', bookType: 'business', order: 5 },
  { id: 'b_exp_travel', name: '差旅', icon: '✈️', color: '#2196F3', type: 'expense', bookType: 'business', order: 6 },
  { id: 'b_exp_entertain', name: '招待', icon: '🍽️', color: '#FF5722', type: 'expense', bookType: 'business', order: 7 },
  { id: 'b_exp_equipment', name: '设备', icon: '💻', color: '#3F51B5', type: 'expense', bookType: 'business', order: 8 },
  { id: 'b_exp_service', name: '服务费', icon: '🔧', color: '#00BCD4', type: 'expense', bookType: 'business', order: 9 },
  { id: 'b_exp_tax', name: '税费', icon: '📋', color: '#9C27B0', type: 'expense', bookType: 'business', order: 10 },
  { id: 'b_exp_insurance', name: '保险', icon: '🛡️', color: '#009688', type: 'expense', bookType: 'business', order: 11 },
  { id: 'b_exp_logistics', name: '物流', icon: '📦', color: '#8D6E63', type: 'expense', bookType: 'business', order: 12 },
  { id: 'b_exp_other', name: '其他', icon: '📝', color: '#9E9E9E', type: 'expense', bookType: 'business', order: 13 },
];

// 公司账本 - 收入分类
export const BUSINESS_INCOME_CATEGORIES: DefaultCategory[] = [
  { id: 'b_inc_sales', name: '销售', icon: '💰', color: '#4CAF50', type: 'income', bookType: 'business', order: 1 },
  { id: 'b_inc_service', name: '服务', icon: '🔧', color: '#2196F3', type: 'income', bookType: 'business', order: 2 },
  { id: 'b_inc_invest', name: '投资', icon: '📈', color: '#FF9800', type: 'income', bookType: 'business', order: 3 },
  { id: 'b_inc_subsidy', name: '补贴', icon: '🏛️', color: '#9C27B0', type: 'income', bookType: 'business', order: 4 },
  { id: 'b_inc_refund', name: '退款', icon: '↩️', color: '#00BCD4', type: 'income', bookType: 'business', order: 5 },
  { id: 'b_inc_other', name: '其他', icon: '📝', color: '#9E9E9E', type: 'income', bookType: 'business', order: 6 },
];

// 获取默认分类数据
export function getDefaultCategories(bookType: string, type?: string): DefaultCategory[] {
  let categories: DefaultCategory[] = [];
  
  if (bookType === 'personal') {
    if (!type || type === 'expense') {
      categories = [...categories, ...PERSONAL_EXPENSE_CATEGORIES];
    }
    if (!type || type === 'income') {
      categories = [...categories, ...PERSONAL_INCOME_CATEGORIES];
    }
  } else if (bookType === 'business') {
    if (!type || type === 'expense') {
      categories = [...categories, ...BUSINESS_EXPENSE_CATEGORIES];
    }
    if (!type || type === 'income') {
      categories = [...categories, ...BUSINESS_INCOME_CATEGORIES];
    }
  }
  
  return categories;
}

// 所有默认分类
export const ALL_DEFAULT_CATEGORIES: DefaultCategory[] = [
  ...PERSONAL_EXPENSE_CATEGORIES,
  ...PERSONAL_INCOME_CATEGORIES,
  ...BUSINESS_EXPENSE_CATEGORIES,
  ...BUSINESS_INCOME_CATEGORIES,
];

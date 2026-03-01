/**
 * 攒钱记账 - 颜色系统
 * 设计规范：现代、优雅、轻量，融合玻璃态和微质感设计
 */

export const Colors = {
  // 主色调 - 渐变青绿，象征成长与清晰
  primary: {
    start: '#00B4A0',
    end: '#4CAF50',
    default: '#00B4A0',
  },

  // 账本标识色
  personal: '#9C6ADE',      // 个人账本 - 温馨紫色
  personalLight: '#F3EAFF', // 个人账本浅色背景
  personalDark: '#7C4DBC',  // 个人账本深色

  business: '#2E7EB5',      // 公司账本 - 专业蓝色
  businessLight: '#E3F2FD', // 公司账本浅色背景
  businessDark: '#1D5A8A',  // 公司账本深色

  // 收支颜色
  expense: '#FF6B6B',       // 支出 - 柔和红色
  expenseLight: '#FFEBEE',  // 支出浅色背景
  income: '#4ECDC4',        // 收入 - 清新绿色
  incomeLight: '#E0F7F5',   // 收入浅色背景

  // 背景色
  background: '#F8FAFC',
  backgroundGradientStart: '#E0F2E9',
  backgroundGradientEnd: '#FFFFFF',

  // 卡片与表面
  card: '#FFFFFF',
  cardGlass: 'rgba(255, 255, 255, 0.8)',
  surface: '#FFFFFF',

  // 文字颜色
  text: {
    primary: '#1A1A2E',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  // 边框与分割线
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  divider: '#E5E7EB',

  // 状态颜色
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // 灰度
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // 透明度
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

// 主题渐变配置
export const Gradients = {
  primary: [Colors.primary.start, Colors.primary.end],
  splash: [Colors.backgroundGradientStart, Colors.backgroundGradientEnd],
  personal: [Colors.personal, Colors.personalDark],
  business: [Colors.business, Colors.businessDark],
  expense: ['#FF6B6B', '#FF8787'],
  income: ['#4ECDC4', '#6EE7DE'],
};

export default Colors;

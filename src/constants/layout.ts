/**
 * 攒钱记账 - 布局规范
 * 圆角、阴影、间距等设计规范
 */

import { Platform, ViewStyle } from 'react-native';

// 圆角规范
export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 8,      // 输入框
  md: 12,
  lg: 16,     // 按钮
  xl: 20,
  '2xl': 24,  // 卡片
  '3xl': 32,
  full: 9999, // 圆形
};

// 间距规范
export const Spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

// 阴影样式
export const Shadows = {
  // 无阴影
  none: {} as ViewStyle,

  // 轻微阴影 - 用于悬浮元素
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
    default: {},
  }) as ViewStyle,

  // 默认阴影 - 用于卡片
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: {
      elevation: 3,
    },
    default: {},
  }) as ViewStyle,

  // 中等阴影 - 用于突出卡片
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
    },
    android: {
      elevation: 6,
    },
    default: {},
  }) as ViewStyle,

  // 大阴影 - 用于弹出层
  xl: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
    },
    android: {
      elevation: 12,
    },
    default: {},
  }) as ViewStyle,

  // 卡片阴影
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }) as ViewStyle,
};

// 尺寸规范
export const Sizes = {
  // 图标尺寸
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    '2xl': 48,
    '3xl': 64,
  },

  // 头像尺寸
  avatar: {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
    '2xl': 120,
  },

  // 按钮高度
  button: {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
  },

  // 输入框高度
  input: {
    sm: 36,
    md: 44,
    lg: 52,
  },

  // 底部导航栏高度
  tabBar: 60,
  
  // 顶部导航栏高度
  header: 56,
};

// 动画时长
export const Duration = {
  fast: 150,
  normal: 250,
  slow: 350,
};

// Z-Index 层级
export const ZIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
};

export default {
  BorderRadius,
  Spacing,
  Shadows,
  Sizes,
  Duration,
  ZIndex,
};

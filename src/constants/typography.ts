/**
 * 攒钱记账 - 字体规范
 * 字体：Inter 或 SF Pro，无衬线，字重精细
 */

import { Platform, TextStyle } from 'react-native';

// 字体家族
export const FontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
};

// 字体大小
export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// 行高
export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// 字重
export const FontWeight: Record<string, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// 预设文字样式
export const Typography = {
  // 大标题
  h1: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['4xl'] * LineHeight.tight,
  } as TextStyle,

  // 标题
  h2: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize['3xl'] * LineHeight.tight,
  } as TextStyle,

  // 副标题
  h3: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize['2xl'] * LineHeight.tight,
  } as TextStyle,

  // 小标题
  h4: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.xl * LineHeight.normal,
  } as TextStyle,

  // 正文大
  bodyLarge: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.lg * LineHeight.normal,
  } as TextStyle,

  // 正文
  body: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.base * LineHeight.normal,
  } as TextStyle,

  // 正文小
  bodySmall: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.sm * LineHeight.normal,
  } as TextStyle,

  // 标签
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.base * LineHeight.tight,
  } as TextStyle,

  // 按钮文字
  button: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.md * LineHeight.tight,
  } as TextStyle,

  // 说明文字
  caption: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.xs * LineHeight.normal,
  } as TextStyle,

  // 金额大字
  amount: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['3xl'] * LineHeight.tight,
  } as TextStyle,

  // 金额小字
  amountSmall: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.xl * LineHeight.tight,
  } as TextStyle,
};

export default Typography;

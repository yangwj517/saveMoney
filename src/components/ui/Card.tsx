/**
 * 攒钱记账 - 卡片组件
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { BorderRadius, Shadows, Spacing } from '@/constants/layout';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  shadow = 'md',
  borderRadius = 'xl',
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return Spacing.sm;
      case 'md':
        return Spacing.base;
      case 'lg':
        return Spacing.xl;
      default:
        return Spacing.base;
    }
  };

  const getShadow = (): ViewStyle => {
    switch (shadow) {
      case 'none':
        return Shadows.none;
      case 'sm':
        return Shadows.sm;
      case 'md':
        return Shadows.md;
      case 'lg':
        return Shadows.lg;
      default:
        return Shadows.md;
    }
  };

  const getBorderRadius = () => {
    switch (borderRadius) {
      case 'sm':
        return BorderRadius.sm;
      case 'md':
        return BorderRadius.md;
      case 'lg':
        return BorderRadius.lg;
      case 'xl':
        return BorderRadius['2xl'];
      default:
        return BorderRadius['2xl'];
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          padding: getPadding(),
          borderRadius: getBorderRadius(),
        },
        getShadow(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
  },
});

export default Card;

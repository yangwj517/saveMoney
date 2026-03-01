/**
 * 攒钱记账 - 毛玻璃卡片组件
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { BorderRadius, Shadows, Spacing } from '@/constants/layout';
import { AccountBookType } from '@/types';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  showTopBorder?: boolean;
  bookType?: AccountBookType | 'both';
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 50,
  padding = 'md',
  showTopBorder = false,
  bookType,
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

  const getTopBorderColors = (): [string, string] => {
    if (!showTopBorder) return ['transparent', 'transparent'];
    
    switch (bookType) {
      case 'personal':
        return [Colors.personal, Colors.personal];
      case 'business':
        return [Colors.business, Colors.business];
      case 'both':
        return [Colors.personal, Colors.business];
      default:
        return [Colors.primary.start, Colors.primary.end];
    }
  };

  const containerStyle: ViewStyle = {
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadows.card,
    ...style,
  };

  const contentStyle: ViewStyle = {
    padding: getPadding(),
  };

  // Android 不支持 BlurView，使用半透明背景替代
  if (Platform.OS === 'android') {
    return (
      <View style={containerStyle}>
        {showTopBorder && (
          <LinearGradient
            colors={getTopBorderColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.topBorder}
          />
        )}
        <View style={[styles.androidGlass, contentStyle]}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      {showTopBorder && (
        <LinearGradient
          colors={getTopBorderColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topBorder}
        />
      )}
      <BlurView intensity={intensity} tint="light" style={styles.blur}>
        <View style={[styles.glassContent, contentStyle]}>
          {children}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  blur: {
    flex: 1,
  },
  glassContent: {
    backgroundColor: Colors.cardGlass,
  },
  androidGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  topBorder: {
    height: 4,
    width: '100%',
  },
});

export default GlassCard;

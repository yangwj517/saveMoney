/**
 * 攒钱记账 - 引导页（首次启动）
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows } from '@/constants/layout';
import { Button } from '@/components/ui';

const { width, height } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: '双账本管理',
    description: '个人支出与公司备用金分开记录，清晰明了',
    emoji: '📚',
    color: '#9C6ADE',
  },
  {
    id: '2',
    title: '攒钱目标',
    description: '为梦想储蓄，进度实时追踪',
    emoji: '🎯',
    color: '#4ECDC4',
  },
  {
    id: '3',
    title: '智能统计',
    description: '多维度分析收支，洞察消费习惯',
    emoji: '📊',
    color: '#00B4A0',
  },
];

// 插画组件
const Illustration: React.FC<{ item: OnboardingItem }> = ({ item }) => {
  return (
    <View style={styles.illustrationContainer}>
      <View style={[styles.illustrationCircle, { backgroundColor: item.color + '20' }]}>
        <Text style={styles.illustrationEmoji}>{item.emoji}</Text>
      </View>
      
      {/* 装饰元素 */}
      <View style={[styles.decorDot, styles.decorDot1, { backgroundColor: Colors.personal }]} />
      <View style={[styles.decorDot, styles.decorDot2, { backgroundColor: Colors.business }]} />
      <View style={[styles.decorDot, styles.decorDot3, { backgroundColor: Colors.income }]} />
    </View>
  );
};

export default function OnboardingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  const currentItem = onboardingData[currentIndex];

  return (
    <View style={styles.container}>
      {/* 跳过按钮 */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>跳过</Text>
      </TouchableOpacity>

      {/* 内容区域 */}
      <View style={styles.content}>
        {/* 插画 */}
        <View style={styles.illustrationWrapper}>
          <Illustration item={currentItem} />
        </View>

        {/* 标题和描述 */}
        <Text style={styles.title}>{currentItem.title}</Text>
        <Text style={styles.description}>{currentItem.description}</Text>
      </View>

      {/* 分页指示器 */}
      <View style={styles.pagination}>
        {onboardingData.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setCurrentIndex(index)}
            style={[
              styles.dot,
              index === currentIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* 按钮 */}
      <View style={styles.buttonContainer}>
        <Button
          title={currentIndex === onboardingData.length - 1 ? '立即体验' : '下一步'}
          onPress={handleNext}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: Spacing.xl,
    zIndex: 10,
    padding: Spacing.sm,
  },
  skipText: {
    fontSize: FontSize.base,
    color: Colors.text.secondary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  illustrationWrapper: {
    width: width * 0.7,
    height: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['3xl'],
  },
  illustrationContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  illustrationCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  illustrationEmoji: {
    fontSize: 72,
  },
  decorDot: {
    position: 'absolute',
    borderRadius: 50,
  },
  decorDot1: {
    width: 20,
    height: 20,
    top: 20,
    right: 40,
  },
  decorDot2: {
    width: 14,
    height: 14,
    bottom: 40,
    left: 30,
  },
  decorDot3: {
    width: 10,
    height: 10,
    top: 80,
    left: 20,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.6,
    paddingHorizontal: Spacing.lg,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['2xl'],
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary.default,
  },
  dotInactive: {
    width: 8,
    backgroundColor: Colors.gray[300],
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing['3xl'],
  },
});

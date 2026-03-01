/**
 * 攒钱记账 - 启动页 / 入口页
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Gradients } from '@/constants/colors';
import { Typography, FontSize, FontWeight } from '@/constants/typography';
import { Spacing } from '@/constants/layout';

const { width } = Dimensions.get('window');

export default function SplashPage() {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo 动画
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // 进度条动画
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // 微光扫过动画
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();

    // 2.5秒后跳转
    const timer = setTimeout(() => {
      // 检查是否首次启动（实际应用中应该检查 AsyncStorage）
      const isFirstLaunch = true; // 模拟首次启动
      if (isFirstLaunch) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.5, width * 0.5],
  });

  return (
    <LinearGradient
      colors={['#E0F2E9', '#FFFFFF']}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logo}>
          {/* 存钱罐外框 */}
          <View style={styles.piggyBank}>
            {/* 左侧紫色 */}
            <View style={[styles.piggyHalf, styles.piggyLeft]} />
            {/* 右侧蓝色 */}
            <View style={[styles.piggyHalf, styles.piggyRight]} />
            {/* 斜线分隔 */}
            <View style={styles.dividerLine} />
            {/* 投币口 */}
            <View style={styles.coinSlot} />
          </View>
        </View>
      </Animated.View>

      {/* 应用名称 */}
      <Animated.Text
        style={[
          styles.appName,
          {
            opacity: logoOpacity,
          },
        ]}
      >
        攒钱记账
      </Animated.Text>

      {/* 进度条 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]}>
            <LinearGradient
              colors={Gradients.primary as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressGradient}
            />
            {/* 微光效果 */}
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [{ translateX: shimmerTranslate }],
                },
              ]}
            />
          </Animated.View>
        </View>
      </View>

      {/* 版本号 */}
      <Text style={styles.version}>v1.0.0</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  piggyBank: {
    width: 100,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  piggyHalf: {
    flex: 1,
    opacity: 0.85,
  },
  piggyLeft: {
    backgroundColor: Colors.personal,
  },
  piggyRight: {
    backgroundColor: Colors.business,
  },
  dividerLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    left: '50%',
    marginLeft: -1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transform: [{ rotate: '15deg' }],
  },
  coinSlot: {
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  appName: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
    letterSpacing: 2,
    marginBottom: Spacing['4xl'],
  },
  progressContainer: {
    position: 'absolute',
    bottom: 100,
    width: width * 0.6,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(0, 180, 160, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressGradient: {
    flex: 1,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: 50,
  },
  version: {
    position: 'absolute',
    bottom: 60,
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
});

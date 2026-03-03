/**
 * 攒钱记账 - 自定义弹框组件
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing } from '@/constants/layout';

const { width } = Dimensions.get('window');

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: 'info' | 'success' | 'error' | 'warning' | 'loading';
  loading?: boolean;
  hideButton?: boolean;
}

// 加载动画组件
const LoadingSpinner: React.FC<{ color: string }> = ({ color }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => spin.stop();
  }, [spinValue]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]}>
      <View style={[styles.spinnerArc, { borderTopColor: color }]} />
    </Animated.View>
  );
};

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  title,
  message,
  onClose,
  type = 'info',
  loading = false,
  hideButton = false,
}) => {
  const getIconAndColor = () => {
    if (loading || type === 'loading') {
      return { icon: '', color: Colors.primary.default, bgColor: '#E3F2FD', isLoading: true };
    }
    switch (type) {
      case 'success':
        return { icon: '✓', color: '#4CAF50', bgColor: '#E8F5E9', isLoading: false };
      case 'error':
        return { icon: '✕', color: '#F44336', bgColor: '#FFEBEE', isLoading: false };
      case 'warning':
        return { icon: '!', color: '#FF9800', bgColor: '#FFF3E0', isLoading: false };
      default:
        return { icon: 'i', color: Colors.primary.default, bgColor: '#E3F2FD', isLoading: false };
    }
  };

  const { icon, color, bgColor, isLoading } = getIconAndColor();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isLoading ? undefined : onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 图标/加载动画 */}
          <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
            {isLoading ? (
              <LoadingSpinner color={color} />
            ) : (
              <Text style={[styles.icon, { color }]}>{icon}</Text>
            )}
          </View>

          {/* 标题 */}
          <Text style={styles.title}>{title}</Text>

          {/* 消息 */}
          <Text style={styles.message}>{message}</Text>

          {/* 按钮 - 加载时隐藏 */}
          {!isLoading && !hideButton && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: color }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>确定</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  container: {
    width: Math.min(width - Spacing.xl * 2, 320),
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 28,
    fontWeight: FontWeight.bold,
  },
  spinner: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerArc: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopWidth: 3,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  button: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: '#FFFFFF',
  },
});

export default AlertModal;

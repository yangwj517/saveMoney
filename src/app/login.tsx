/**
 * 攒钱记账 - 登录/注册页
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Gradients } from '@/constants/colors';
import { Typography, FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows } from '@/constants/layout';
import { Button, Input, GlassCard } from '@/components/ui';

const { width, height } = Dimensions.get('window');

// 简单图标组件
const Icon: React.FC<{ name: string; color?: string; size?: number }> = ({ 
  name, 
  color = Colors.text.secondary, 
  size = 20 
}) => {
  const iconMap: Record<string, string> = {
    phone: '📱',
    lock: '🔒',
    wechat: '💬',
    apple: '🍎',
    fingerprint: '👆',
  };
  
  return (
    <Text style={{ fontSize: size, color }}>
      {iconMap[name] || '•'}
    </Text>
  );
};

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = () => {
    // 模拟登录成功，直接跳转到主页
    router.replace('/(tabs)');
  };

  const handleThirdPartyLogin = (type: string) => {
    console.log('Third party login:', type);
    // 模拟登录成功
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient
      colors={['#E0F2E9', '#FFFFFF']}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo 和欢迎语 */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <View style={styles.piggyBank}>
                <View style={[styles.piggyHalf, styles.piggyLeft]} />
                <View style={[styles.piggyHalf, styles.piggyRight]} />
              </View>
            </View>
            <Text style={styles.welcomeText}>
              {isLogin ? '欢迎回来' : '创建账号'}
            </Text>
            <Text style={styles.subtitleText}>
              {isLogin ? '登录您的账号，继续记录生活' : '注册新账号，开启智能记账'}
            </Text>
          </View>

          {/* 表单卡片 */}
          <GlassCard style={styles.formCard} padding="lg">
            <Input
              value={phone}
              onChangeText={setPhone}
              placeholder="请输入手机号/邮箱"
              keyboardType="phone-pad"
              leftIcon={<Icon name="phone" />}
            />
            
            <View style={styles.inputSpacing} />
            
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="请输入密码"
              secureTextEntry
              leftIcon={<Icon name="lock" />}
            />

            {/* 辅助链接 */}
            <View style={styles.linkContainer}>
              <TouchableOpacity>
                <Text style={styles.linkText}>忘记密码？</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.linkText}>
                  {isLogin ? '注册账号' : '已有账号？登录'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 登录按钮 */}
            <Button
              title={isLogin ? '登录' : '注册'}
              onPress={handleSubmit}
              fullWidth
            />
          </GlassCard>

          {/* 第三方登录 */}
          <View style={styles.thirdPartyContainer}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>其他登录方式</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.thirdPartyButtons}>
              <TouchableOpacity
                style={styles.thirdPartyButton}
                onPress={() => handleThirdPartyLogin('wechat')}
              >
                <Icon name="wechat" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.thirdPartyButton}
                onPress={() => handleThirdPartyLogin('apple')}
              >
                <Icon name="apple" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.thirdPartyButton}
                onPress={() => handleThirdPartyLogin('fingerprint')}
              >
                <Icon name="fingerprint" size={24} />
              </TouchableOpacity>
            </View>
          </View>

          {/* 协议提示 */}
          <View style={styles.agreementContainer}>
            <Text style={styles.agreementText}>
              登录即表示同意{' '}
              <Text style={styles.agreementLink}>《用户协议》</Text>
              {' '}和{' '}
              <Text style={styles.agreementLink}>《隐私政策》</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: height * 0.1,
    paddingBottom: Spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  logo: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  piggyBank: {
    width: 70,
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Shadows.md,
  },
  piggyHalf: {
    flex: 1,
  },
  piggyLeft: {
    backgroundColor: Colors.personal,
  },
  piggyRight: {
    backgroundColor: Colors.business,
  },
  welcomeText: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitleText: {
    fontSize: FontSize.base,
    color: Colors.text.secondary,
  },
  formCard: {
    marginBottom: Spacing.xl,
  },
  inputSpacing: {
    height: Spacing.lg,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  linkText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  thirdPartyContainer: {
    marginBottom: Spacing.xl,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
  thirdPartyButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  thirdPartyButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  agreementContainer: {
    alignItems: 'center',
  },
  agreementText: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  agreementLink: {
    color: Colors.text.secondary,
    textDecorationLine: 'underline',
  },
});

/**
 * 攒钱记账 - 登录/注册页
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Gradients } from '@/constants/colors';
import { Typography, FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows } from '@/constants/layout';
import { Button, Input, GlassCard } from '@/components/ui';
import { useAuthStore } from '@/store/auth';
import * as authService from '@/services/auth';

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
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { setTokens, setUser } = useAuthStore();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSendSms = async () => {
    if (!phone.trim() || phone.length < 11) {
      Alert.alert('提示','请输入正确的手机号');
      return;
    }
    try {
      // 使用 authService 发送短信
      const result = await authService.sendSms(phone);
      console.log('[SMS] success:', result);
        
      Alert.alert('发送成功', '验证码已发送，过期时间：' + (result.expireIn || '未知') + '秒');
      setCountdown(60);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e: any) {
      console.log('[SMS] error:', e);
      Alert.alert('发送失败', e.message || '请稍后重试');
    }
  };

  const handleLogin = async () => {
    if (!phone.trim()) {
      Alert.alert('提示', '请输入手机号');
      return;
    }
    if (!code.trim()) {
      Alert.alert('提示', '请输入验证码');
      return;
    }
    setLoading(true);
    try {
      // 使用 authService 登录
      const result = await authService.loginByPhone(phone, code);
      console.log('[Login] success:', result);
        
      if (!result.token) {
        Alert.alert('登录异常', '响应中无 token 字段');
        return;
      }
  
      setTokens(result.token, result.refreshToken);
      if (result.user) {
        setUser(result.user as any);
      }
      router.replace('/(tabs)');
    } catch (e: any) {
      console.log('[Login] error:', e);
      Alert.alert('登录失败', e.message || '请稍后重试');
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.welcomeText}>欢迎使用攒钱记账</Text>
            <Text style={styles.subtitleText}>
              使用手机号验证码快速登录
            </Text>
          </View>

          {/* 表单卡片 */}
          <GlassCard style={styles.formCard} padding="lg">
            <Input
              value={phone}
              onChangeText={setPhone}
              placeholder="请输入手机号"
              keyboardType="phone-pad"
              maxLength={11}
              leftIcon={<Icon name="phone" />}
            />
            
            <View style={styles.inputSpacing} />
            
            <View style={styles.codeRow}>
              <View style={styles.codeInputWrapper}>
                <Input
                  value={code}
                  onChangeText={setCode}
                  placeholder="请输入验证码"
                  keyboardType="numeric"
                  maxLength={6}
                  leftIcon={<Icon name="lock" />}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.sendCodeButton,
                  countdown > 0 && styles.sendCodeButtonDisabled,
                ]}
                onPress={handleSendSms}
                disabled={countdown > 0}
              >
                <Text
                  style={[
                    styles.sendCodeText,
                    countdown > 0 && styles.sendCodeTextDisabled,
                  ]}
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonSpacing} />

            {/* 登录按钮 */}
            <Button
              title="登录"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              fullWidth
            />
          </GlassCard>

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
    width: 64,
    height: 50,
    borderRadius: 25,
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
  welcomeText: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
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
    height: Spacing.md,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  codeInputWrapper: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  sendCodeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary.default,
    marginBottom: 4,
  },
  sendCodeButtonDisabled: {
    backgroundColor: Colors.gray[200],
  },
  sendCodeText: {
    fontSize: FontSize.sm,
    color: Colors.text.inverse,
    fontWeight: FontWeight.medium,
  },
  sendCodeTextDisabled: {
    color: Colors.text.tertiary,
  },
  buttonSpacing: {
    height: Spacing.xl,
  },
  agreementContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  agreementText: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  agreementLink: {
    color: Colors.primary.default,
  },
});

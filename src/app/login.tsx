/**
 * 攒钱记账 - 登录页
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
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { Spacing } from '@/constants/layout';
import { Button, Input, GlassCard, AlertModal } from '@/components/ui';
import { useAuthStore } from '@/store/auth';
import * as authService from '@/services/auth';
import { ALLOWED_PHONES, ENABLE_PHONE_WHITELIST } from '@/constants/config';

const { height } = Dimensions.get('window');

// 简单图标组件
const Icon: React.FC<{ name: string; color?: string; size?: number }> = ({ 
  name, 
  color = Colors.text.secondary, 
  size = 20 
}) => {
  const iconMap: Record<string, string> = {
    phone: '📱',
    lock: '🔒',
  };
  
  return (
    <Text style={{ fontSize: size, color }}>
      {iconMap[name] || '•'}
    </Text>
  );
};

// 手机号校验
const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) {
    return '请输入手机号';
  }
  if (!/^1\d{10}$/.test(phone)) {
    return '请输入正确的11位手机号';
  }
  return null;
};

// 手机号白名单校验
const validatePhoneWhitelist = (phone: string): string | null => {
  if (ENABLE_PHONE_WHITELIST && !ALLOWED_PHONES.includes(phone)) {
    return '该手机号暂不支持登录，请联系管理员';
  }
  return null;
};

// 密码校验
const validatePassword = (password: string): string | null => {
  if (!password.trim()) {
    return '请输入密码';
  }
  if (password.length < 6) {
    return '密码长度不能少于6位';
  }
  return null;
};

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 弹框状态
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error' | 'warning'>('info');

  const { setTokens, setUser } = useAuthStore();

  // 显示弹框
  const showAlert = (title: string, message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    // 前端校验 - 手机号格式
    const phoneError = validatePhone(phone);
    if (phoneError) {
      showAlert('输入错误', phoneError, 'warning');
      return;
    }

    // 前端校验 - 手机号白名单
    const whitelistError = validatePhoneWhitelist(phone);
    if (whitelistError) {
      showAlert('手机号受限', whitelistError, 'error');
      return;
    }

    // 前端校验 - 密码
    const passwordError = validatePassword(password);
    if (passwordError) {
      showAlert('输入错误', passwordError, 'warning');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.loginByPassword(phone, password);
      console.log('[Login] success:', result);
        
      if (!result.token) {
        showAlert('登录异常', '服务器响应异常，请稍后重试', 'error');
        return;
      }
  
      setTokens(result.token, result.refreshToken);
      if (result.user) {
        setUser(result.user as any);
      }
      router.replace('/(tabs)');
    } catch (e: any) {
      console.log('[Login] error:', e);
      const errorMessage = e.message || '登录失败，请稍后重试';
      showAlert('登录失败', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoRegister = () => {
    router.push('/register');
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
              使用手机号和密码登录
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
            
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="请输入密码"
              secureTextEntry
              leftIcon={<Icon name="lock" />}
            />

            <View style={styles.buttonSpacing} />

            {/* 登录按钮 */}
            <Button
              title="登录"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              fullWidth
            />

            {/* 注册链接 */}
            <View style={styles.registerRow}>
              <Text style={styles.registerHint}>还没有账号？</Text>
              <TouchableOpacity onPress={handleGoRegister}>
                <Text style={styles.registerLink}>立即注册</Text>
              </TouchableOpacity>
            </View>
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

      {/* 自定义弹框 */}
      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />
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
  buttonSpacing: {
    height: Spacing.xl,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  registerHint: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
  registerLink: {
    fontSize: FontSize.sm,
    color: Colors.primary.default,
    fontWeight: FontWeight.medium,
    marginLeft: Spacing.xs,
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

/**
 * 攒钱记账 - 注册页
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing } from '@/constants/layout';
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
    shield: '🛡️',
    code: '🔢',
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
    return '请输入正确的11位手机号（以1开头）';
  }
  return null;
};

// 手机号白名单校验
const validatePhoneWhitelist = (phone: string): string | null => {
  if (ENABLE_PHONE_WHITELIST && !ALLOWED_PHONES.includes(phone)) {
    return '该手机号暂不支持注册，请联系管理员';
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
  if (password.length > 20) {
    return '密码长度不能超过20位';
  }
  return null;
};

// 验证码校验
const validateCode = (code: string): string | null => {
  if (!code.trim()) {
    return '请输入验证码';
  }
  if (!/^\d{4,6}$/.test(code)) {
    return '请输入4-6位数字验证码';
  }
  return null;
};

export default function RegisterPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 弹框状态
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error' | 'warning' | 'loading'>('info');
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertCallback, setAlertCallback] = useState<(() => void) | null>(null);

  const { setTokens, setUser } = useAuthStore();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 显示弹框
  const showAlert = (
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'error' | 'warning' | 'loading' = 'info',
    callback?: () => void,
    loading: boolean = false
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertLoading(loading);
    setAlertCallback(() => callback || null);
    setAlertVisible(true);
  };

  // 更新弹框内容（不关闭弹框）
  const updateAlert = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'error' | 'warning' | 'loading' = 'info',
    callback?: () => void,
    loading: boolean = false
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertLoading(loading);
    setAlertCallback(() => callback || null);
  };

  // 关闭弹框
  const handleAlertClose = () => {
    setAlertVisible(false);
    if (alertCallback) {
      alertCallback();
    }
  };

  const handleSendSms = async () => {
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

    setSendingCode(true);
    // 显示加载弹框
    showAlert('正在获取', '验证码获取中，请稍候...', 'loading', undefined, true);
    
    try {
      const result = await authService.sendSms(phone);
      console.log('[SMS] success:', result);
      
      const expireTime = result.expireIn || 300;
      const smsCode = result.smCode || '';
      
      // 更新弹框显示验证码
      updateAlert(
        '获取成功',
        `您的验证码是：${smsCode}\n\n${Math.floor(expireTime / 60)} 分钟内有效`,
        'success',
        undefined,
        false
      );
      
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
      const errorMessage = e.message || '验证码获取失败，请稍后重试';
      updateAlert('获取失败', errorMessage, 'error', undefined, false);
    } finally {
      setSendingCode(false);
    }
  };

  const handleRegister = async () => {
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

    // 前端校验 - 确认密码
    if (!confirmPassword.trim()) {
      showAlert('输入错误', '请再次输入密码', 'warning');
      return;
    }
    if (password !== confirmPassword) {
      showAlert('输入错误', '两次输入的密码不一致，请重新输入', 'warning');
      return;
    }

    // 前端校验 - 验证码
    const codeError = validateCode(code);
    if (codeError) {
      showAlert('输入错误', codeError, 'warning');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.register(phone, password, code);
      console.log('[Register] success:', result);
        
      if (!result.token) {
        showAlert('注册异常', '服务器响应异常，请稍后重试', 'error');
        return;
      }
  
      setTokens(result.token, result.refreshToken);
      if (result.user) {
        setUser(result.user as any);
      }
      showAlert('注册成功', '欢迎使用攒钱记账！', 'success', () => {
        router.replace('/(tabs)');
      });
    } catch (e: any) {
      console.log('[Register] error:', e);
      const errorMessage = e.message || '注册失败，请稍后重试';
      showAlert('注册失败', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoLogin = () => {
    router.replace('/login');
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
          {/* 返回按钮 */}
          <TouchableOpacity style={styles.backButton} onPress={handleGoLogin}>
            <Text style={styles.backText}>← 返回登录</Text>
          </TouchableOpacity>

          {/* Logo 和欢迎语 */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <View style={styles.piggyBank}>
                <View style={[styles.piggyHalf, styles.piggyLeft]} />
                <View style={[styles.piggyHalf, styles.piggyRight]} />
              </View>
            </View>
            <Text style={styles.welcomeText}>创建新账户</Text>
            <Text style={styles.subtitleText}>
              填写以下信息完成注册
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
              placeholder="请输入密码（6-20位）"
              secureTextEntry
              maxLength={20}
              leftIcon={<Icon name="lock" />}
            />

            <View style={styles.inputSpacing} />
            
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="请再次输入密码"
              secureTextEntry
              maxLength={20}
              leftIcon={<Icon name="shield" />}
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
                  leftIcon={<Icon name="code" />}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.sendCodeButton,
                  (countdown > 0 || sendingCode) && styles.sendCodeButtonDisabled,
                ]}
                onPress={handleSendSms}
                disabled={countdown > 0 || sendingCode}
              >
                <Text
                  style={[
                    styles.sendCodeText,
                    (countdown > 0 || sendingCode) && styles.sendCodeTextDisabled,
                  ]}
                >
                  {sendingCode ? '发送中...' : countdown > 0 ? `${countdown}s` : '获取验证码'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonSpacing} />

            {/* 注册按钮 */}
            <Button
              title="注册"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              fullWidth
            />

            {/* 登录链接 */}
            <View style={styles.loginRow}>
              <Text style={styles.loginHint}>已有账号？</Text>
              <TouchableOpacity onPress={handleGoLogin}>
                <Text style={styles.loginLink}>立即登录</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* 协议提示 */}
          <View style={styles.agreementContainer}>
            <Text style={styles.agreementText}>
              注册即表示同意{' '}
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
        loading={alertLoading}
        onClose={handleAlertClose}
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
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  backText: {
    fontSize: FontSize.base,
    color: Colors.primary.default,
    fontWeight: FontWeight.medium,
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
    minWidth: 100,
    alignItems: 'center',
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
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  loginHint: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
  loginLink: {
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

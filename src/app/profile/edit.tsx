/**
 * 攒钱记账 - 编辑资料页
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows } from '@/constants/layout';
import { Card, AlertModal } from '@/components/ui';
import { useAuthStore } from '@/store/auth';
import * as userService from '@/services/user';

// 输入项组件
const InputItem: React.FC<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}> = ({ label, value, onChangeText, placeholder, keyboardType = 'default' }) => (
  <View style={styles.inputItem}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.inputField}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.text.tertiary}
      keyboardType={keyboardType}
    />
  </View>
);

// 选择项组件
const SelectItem: React.FC<{
  label: string;
  value: string;
  onPress?: () => void;
}> = ({ label, value, onPress }) => (
  <TouchableOpacity style={styles.selectItem} onPress={onPress}>
    <Text style={styles.selectLabel}>{label}</Text>
    <View style={styles.selectRight}>
      <Text style={styles.selectValue}>{value}</Text>
      <Text style={styles.selectArrow}>›</Text>
    </View>
  </TouchableOpacity>
);

export default function EditProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUserStore = useAuthStore((s) => s.setUser);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  // 弹框状态
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error' | 'warning'>('info');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    userService.getProfile().then((profile: any) => {
      if (profile) {
        setNickname(profile.nickname || '');
        setPhone(profile.phone || '');
        setEmail(profile.email || '');
      }
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const updated = await userService.updateProfile({ nickname, email });
      if (updated) {
        setUserStore({ ...user!, nickname: updated.nickname || nickname, email: updated.email || email });
      }
      // 显示成功提示
      setAlertTitle('保存成功');
      setAlertMessage('您的资料已更新');
      setAlertType('success');
      setIsSuccess(true);
      setAlertVisible(true);
    } catch (e: any) {
      // 显示失败提示
      setAlertTitle('保存失败');
      setAlertMessage(e.message || '请稍后重试');
      setAlertType('error');
      setIsSuccess(false);
      setAlertVisible(true);
    } finally {
      setSaving(false);
    }
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
    if (isSuccess) {
      // 成功后返回上一页
      router.back();
    }
    // 失败则停留在当前页面
  };

  const handleAvatarChange = () => {
    // 更换头像逻辑 - 可使用 expo-image-picker
    console.log('Change avatar');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>编辑资料</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          <Text style={[styles.saveText, saving && styles.saveTextDisabled]}>
            {saving ? '保存中...' : '保存'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 头像 */}
        <TouchableOpacity style={styles.avatarSection} onPress={handleAvatarChange}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{nickname?.charAt(0) || '用'}</Text>
          </View>
          <Text style={styles.avatarHint}>点击更换头像</Text>
        </TouchableOpacity>

        {/* 基本信息 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>基本信息</Text>
          <InputItem
            label="昵称"
            value={nickname}
            onChangeText={setNickname}
            placeholder="请输入昵称"
          />
        </Card>

        {/* 联系方式 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>联系方式</Text>
          <InputItem
            label="手机号"
            value={phone}
            onChangeText={setPhone}
            placeholder="请输入手机号"
            keyboardType="phone-pad"
          />
          <View style={styles.divider} />
          <InputItem
            label="邮箱"
            value={email}
            onChangeText={setEmail}
            placeholder="请输入邮箱"
            keyboardType="email-address"
          />
        </Card>
      </ScrollView>

      {/* 提示弹框 */}
      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onClose={handleAlertClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 32,
    color: Colors.text.primary,
    marginTop: -4,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  saveButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  saveText: {
    fontSize: FontSize.base,
    color: Colors.primary.default,
    fontWeight: FontWeight.medium,
  },
  saveTextDisabled: {
    color: Colors.text.tertiary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['2xl'],
  },
  // 头像
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  avatarText: {
    fontSize: FontSize['3xl'],
    color: Colors.text.inverse,
    fontWeight: FontWeight.bold,
  },
  avatarHint: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
  // 分区
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.md,
  },
  // 输入项
  inputItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  inputLabel: {
    width: 80,
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  inputField: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.text.primary,
    textAlign: 'right',
    padding: 0,
  },
  // 选择项
  selectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  selectLabel: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  selectRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectValue: {
    fontSize: FontSize.base,
    color: Colors.text.secondary,
    marginRight: Spacing.xs,
  },
  selectArrow: {
    fontSize: 20,
    color: Colors.text.tertiary,
  },
  // 分割线
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
});

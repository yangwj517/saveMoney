/**
 * 攒钱记账 - 编辑资料页
 */

import React, { useState } from 'react';
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
import { Card } from '@/components/ui';

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
  const [nickname, setNickname] = useState('张先生');
  const [phone, setPhone] = useState('138****8888');
  const [email, setEmail] = useState('zhang@example.com');
  const [gender, setGender] = useState('男');
  const [birthday, setBirthday] = useState('1990-01-01');

  const handleSave = () => {
    // 保存逻辑
    console.log('Save profile:', { nickname, phone, email, gender, birthday });
    router.back();
  };

  const handleAvatarChange = () => {
    // 更换头像逻辑
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
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>保存</Text>
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
            <Text style={styles.avatarText}>张</Text>
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
          <View style={styles.divider} />
          <SelectItem
            label="性别"
            value={gender}
            onPress={() => {
              setGender(gender === '男' ? '女' : '男');
            }}
          />
          <View style={styles.divider} />
          <SelectItem
            label="生日"
            value={birthday}
            onPress={() => {
              // 选择生日
              console.log('Select birthday');
            }}
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

        {/* 账号安全 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>账号安全</Text>
          <SelectItem
            label="修改密码"
            value=""
            onPress={() => console.log('Change password')}
          />
          <View style={styles.divider} />
          <SelectItem
            label="绑定微信"
            value="已绑定"
            onPress={() => console.log('Bindweixin')}
          />
          <View style={styles.divider} />
          <SelectItem
            label="注销账号"
            value=""
            onPress={() => console.log('Delete account')}
          />
        </Card>
      </ScrollView>
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

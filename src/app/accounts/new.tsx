/**
 * 攒钱记账 - 添加账户页
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing } from '@/constants/layout';
import { Card } from '@/components/ui';
import { AccountBookType } from '@/types';

// 账户类型选项
const ACCOUNT_TYPES = [
  { key: 'cash', icon: '💵', label: '现金' },
  { key: 'bank', icon: '💳', label: '银行卡' },
  { key: 'alipay', icon: '📱', label: '支付宝' },
  { key: 'wechat', icon: '💬', label: '微信' },
  { key: 'credit', icon: '💳', label: '信用卡' },
  { key: 'other', icon: '💰', label: '其他' },
];

export default function AddAccountPage() {
  const [bookType, setBookType] = useState<AccountBookType>('personal');
  const [accountType, setAccountType] = useState('cash');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [note, setNote] = useState('');

  const bookColor = bookType === 'personal' ? Colors.personal : Colors.business;

  const handleSave = () => {
    if (!name.trim()) {
      console.log('请输入账户名称');
      return;
    }

    const account = {
      bookType,
      accountType,
      name,
      balance: parseFloat(balance) || 0,
      note,
    };

    console.log('创建账户:', account);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>添加账户</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 账本选择 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>选择账本</Text>
          <View style={styles.bookSelector}>
            <TouchableOpacity
              style={[
                styles.bookOption,
                bookType === 'personal' && { backgroundColor: Colors.personalLight, borderColor: Colors.personal },
              ]}
              onPress={() => setBookType('personal')}
            >
              <View style={[styles.bookDot, { backgroundColor: Colors.personal }]} />
              <Text style={[styles.bookText, bookType === 'personal' && { color: Colors.personal }]}>
                个人账本
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.bookOption,
                bookType === 'business' && { backgroundColor: Colors.businessLight, borderColor: Colors.business },
              ]}
              onPress={() => setBookType('business')}
            >
              <View style={[styles.bookDot, { backgroundColor: Colors.business }]} />
              <Text style={[styles.bookText, bookType === 'business' && { color: Colors.business }]}>
                公司账本
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 账户类型 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>账户类型</Text>
          <View style={styles.typeGrid}>
            {ACCOUNT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.typeItem,
                  accountType === type.key && { backgroundColor: bookColor + '15', borderColor: bookColor },
                ]}
                onPress={() => setAccountType(type.key)}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text style={[styles.typeLabel, accountType === type.key && { color: bookColor }]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* 账户信息 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>账户信息</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>账户名称</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="例如：工商银行储蓄卡"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>初始余额</Text>
            <View style={styles.amountInput}>
              <Text style={styles.currencySymbol}>¥</Text>
              <TextInput
                style={styles.amountField}
                value={balance}
                onChangeText={setBalance}
                placeholder="0.00"
                placeholderTextColor={Colors.text.tertiary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>备注（可选）</Text>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="添加备注信息..."
              placeholderTextColor={Colors.text.tertiary}
              multiline
              numberOfLines={2}
            />
          </View>
        </Card>

        {/* 保存按钮 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient
            colors={Gradients.primary as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveGradient}
          >
            <Text style={styles.saveText}>保存账户</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['2xl'],
  },
  // 分区
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.md,
  },
  // 账本选择
  bookSelector: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  bookOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  bookDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bookText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  // 账户类型
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeItem: {
    width: '31%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  typeLabel: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
  },
  // 输入组
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  currencySymbol: {
    fontSize: FontSize.lg,
    color: Colors.text.secondary,
    marginRight: Spacing.sm,
  },
  amountField: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.lg,
    color: Colors.text.primary,
  },
  noteInput: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.base,
    color: Colors.text.primary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  // 保存按钮
  saveButton: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  saveGradient: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  saveText: {
    fontSize: FontSize.base,
    color: Colors.text.inverse,
    fontWeight: FontWeight.semibold,
  },
});

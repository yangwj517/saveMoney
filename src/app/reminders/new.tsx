/**
 * 攒钱记账 - 添加账单提醒页
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
import { AccountBookType, TransactionType } from '@/types';

// 常见账单类型
const BILL_TEMPLATES = [
  { id: '1', name: '房租', icon: '🏠', type: 'expense' as TransactionType },
  { id: '2', name: '信用卡还款', icon: '💳', type: 'expense' as TransactionType },
  { id: '3', name: '工资', icon: '💰', type: 'income' as TransactionType },
  { id: '4', name: '水电费', icon: '💡', type: 'expense' as TransactionType },
  { id: '5', name: '网费', icon: '📶', type: 'expense' as TransactionType },
  { id: '6', name: '话费', icon: '📱', type: 'expense' as TransactionType },
  { id: '7', name: '保险', icon: '🛡️', type: 'expense' as TransactionType },
  { id: '8', name: '会员订阅', icon: '📺', type: 'expense' as TransactionType },
];

// 日期选项
const DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

export default function AddReminderPage() {
  const [bookType, setBookType] = useState<AccountBookType>('personal');
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [day, setDay] = useState(1);
  const [note, setNote] = useState('');

  const bookColor = bookType === 'personal' ? Colors.personal : Colors.business;
  const typeColor = transactionType === 'expense' ? Colors.expense : Colors.income;

  const handleTemplateSelect = (template: typeof BILL_TEMPLATES[0]) => {
    setName(template.name);
    setTransactionType(template.type);
  };

  const handleSave = () => {
    if (!name.trim()) {
      console.log('请输入账单名称');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      console.log('请输入有效金额');
      return;
    }

    const reminder = {
      bookType,
      transactionType,
      name,
      amount: parseFloat(amount),
      day,
      note,
    };

    console.log('创建提醒:', reminder);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>添加账单提醒</Text>
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

        {/* 类型选择 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>账单类型</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeOption,
                transactionType === 'expense' && { backgroundColor: Colors.expense + '15', borderColor: Colors.expense },
              ]}
              onPress={() => setTransactionType('expense')}
            >
              <Text style={[styles.typeText, transactionType === 'expense' && { color: Colors.expense }]}>
                💸 支出
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeOption,
                transactionType === 'income' && { backgroundColor: Colors.income + '15', borderColor: Colors.income },
              ]}
              onPress={() => setTransactionType('income')}
            >
              <Text style={[styles.typeText, transactionType === 'income' && { color: Colors.income }]}>
                💵 收入
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 常用模板 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>常用模板</Text>
          <View style={styles.templateGrid}>
            {BILL_TEMPLATES.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateItem,
                  name === template.name && { 
                    backgroundColor: typeColor + '15', 
                    borderColor: typeColor,
                  },
                ]}
                onPress={() => handleTemplateSelect(template)}
              >
                <Text style={styles.templateIcon}>{template.icon}</Text>
                <Text style={[styles.templateName, name === template.name && { color: typeColor }]}>
                  {template.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* 账单信息 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>账单信息</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>账单名称</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="例如：房租、信用卡还款"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>金额</Text>
            <View style={styles.amountInput}>
              <Text style={[styles.currencySymbol, { color: typeColor }]}>¥</Text>
              <TextInput
                style={styles.amountField}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={Colors.text.tertiary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>提醒日期（每月）</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.dayScroll}
            >
              <View style={styles.dayGrid}>
                {DAYS.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.dayItem,
                      day === d && { backgroundColor: bookColor, borderColor: bookColor },
                    ]}
                    onPress={() => setDay(d)}
                  >
                    <Text style={[styles.dayText, day === d && { color: Colors.text.inverse }]}>
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <Text style={styles.dayHint}>每月 {day} 日提醒</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>备注（可选）</Text>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="添加备注..."
              placeholderTextColor={Colors.text.tertiary}
              multiline
              numberOfLines={2}
            />
          </View>
        </Card>

        {/* 预览 */}
        {name && amount && (
          <Card style={styles.previewCard}>
            <Text style={styles.previewTitle}>提醒预览</Text>
            <View style={styles.previewContent}>
              <View style={[styles.previewIcon, { backgroundColor: typeColor + '20' }]}>
                <Text style={[styles.previewIconText, { color: typeColor }]}>
                  {transactionType === 'expense' ? '支' : '收'}
                </Text>
              </View>
              <View style={styles.previewInfo}>
                <Text style={styles.previewName}>{name}</Text>
                <Text style={styles.previewDetail}>每月{day}日 · ¥{parseFloat(amount || '0').toLocaleString()}</Text>
              </View>
              <View style={[styles.previewBadge, { backgroundColor: bookColor + '20' }]}>
                <Text style={[styles.previewBadgeText, { color: bookColor }]}>
                  {bookType === 'personal' ? '个人' : '公司'}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* 保存按钮 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient
            colors={Gradients.primary as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveGradient}
          >
            <Text style={styles.saveText}>保存提醒</Text>
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
  // 类型选择
  typeSelector: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  typeOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  typeText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  // 模板
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  templateItem: {
    width: '23%',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  templateIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  templateName: {
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
    fontSize: FontSize.xl,
    marginRight: Spacing.sm,
  },
  amountField: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.xl,
    color: Colors.text.primary,
  },
  // 日期选择
  dayScroll: {
    marginBottom: Spacing.sm,
  },
  dayGrid: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  dayItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  dayHint: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
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
  // 预览
  previewCard: {
    marginBottom: Spacing.md,
  },
  previewTitle: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.md,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  previewIconText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  previewDetail: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
  previewBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  previewBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
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

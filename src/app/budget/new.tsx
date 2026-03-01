/**
 * 攒钱记账 - 添加分类预算页
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

// 分类选项
const CATEGORIES = {
  personal: [
    { id: '1', name: '餐饮', icon: '🍜', color: '#FF6B6B' },
    { id: '2', name: '交通', icon: '🚗', color: '#4CAF50' },
    { id: '3', name: '购物', icon: '🛒', color: '#2196F3' },
    { id: '4', name: '娱乐', icon: '🎮', color: '#9C6ADE' },
    { id: '5', name: '日用', icon: '🏠', color: '#FFB84D' },
    { id: '6', name: '医疗', icon: '🏥', color: '#E91E63' },
    { id: '7', name: '教育', icon: '📚', color: '#00BCD4' },
    { id: '8', name: '通讯', icon: '📱', color: '#607D8B' },
  ],
  business: [
    { id: '9', name: '办公', icon: '📎', color: '#2E7EB5' },
    { id: '10', name: '差旅', icon: '✈️', color: '#4CAF50' },
    { id: '11', name: '招待', icon: '🍽️', color: '#FF6B6B' },
    { id: '12', name: '采购', icon: '📦', color: '#FFB84D' },
    { id: '13', name: '营销', icon: '📢', color: '#9C6ADE' },
    { id: '14', name: '其他', icon: '📋', color: '#607D8B' },
  ],
};

export default function AddBudgetPage() {
  const [bookType, setBookType] = useState<AccountBookType>('personal');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState('80');

  const categories = bookType === 'personal' ? CATEGORIES.personal : CATEGORIES.business;
  const bookColor = bookType === 'personal' ? Colors.personal : Colors.business;
  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  const handleSave = () => {
    if (!selectedCategory) {
      console.log('请选择分类');
      return;
    }
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      console.log('请输入有效的预算金额');
      return;
    }

    const budget = {
      bookType,
      categoryId: selectedCategory,
      amount: parseFloat(budgetAmount),
      alertEnabled,
      alertThreshold: parseInt(alertThreshold),
    };

    console.log('创建预算:', budget);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>添加分类预算</Text>
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
              onPress={() => {
                setBookType('personal');
                setSelectedCategory(null);
              }}
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
              onPress={() => {
                setBookType('business');
                setSelectedCategory(null);
              }}
            >
              <View style={[styles.bookDot, { backgroundColor: Colors.business }]} />
              <Text style={[styles.bookText, bookType === 'business' && { color: Colors.business }]}>
                公司账本
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 分类选择 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>选择分类</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id && { 
                    backgroundColor: category.color + '20', 
                    borderColor: category.color,
                  },
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '30' }]}>
                  <Text style={styles.categoryIconText}>{category.icon}</Text>
                </View>
                <Text style={[
                  styles.categoryLabel, 
                  selectedCategory === category.id && { color: category.color },
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* 预算金额 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>预算金额</Text>
          <View style={styles.amountInput}>
            <Text style={styles.currencySymbol}>¥</Text>
            <TextInput
              style={styles.amountField}
              value={budgetAmount}
              onChangeText={setBudgetAmount}
              placeholder="0.00"
              placeholderTextColor={Colors.text.tertiary}
              keyboardType="decimal-pad"
            />
            <Text style={styles.periodText}>/月</Text>
          </View>

          {/* 快捷金额 */}
          <View style={styles.quickAmounts}>
            {['500', '1000', '2000', '5000'].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.quickAmount,
                  budgetAmount === amount && { backgroundColor: bookColor + '15', borderColor: bookColor },
                ]}
                onPress={() => setBudgetAmount(amount)}
              >
                <Text style={[
                  styles.quickAmountText,
                  budgetAmount === amount && { color: bookColor },
                ]}>
                  ¥{amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* 预算提醒 */}
        <Card style={styles.section}>
          <View style={styles.alertHeader}>
            <View style={styles.alertLeft}>
              <Text style={styles.alertIcon}>⚠️</Text>
              <View>
                <Text style={styles.alertTitle}>预算提醒</Text>
                <Text style={styles.alertSubtitle}>达到阈值时发送提醒</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.alertToggle, alertEnabled && { backgroundColor: bookColor }]}
              onPress={() => setAlertEnabled(!alertEnabled)}
            >
              <View style={[styles.alertToggleThumb, alertEnabled && styles.alertToggleThumbActive]} />
            </TouchableOpacity>
          </View>

          {alertEnabled && (
            <View style={styles.thresholdRow}>
              <Text style={styles.thresholdLabel}>提醒阈值</Text>
              <View style={styles.thresholdInput}>
                <TextInput
                  style={styles.thresholdField}
                  value={alertThreshold}
                  onChangeText={setAlertThreshold}
                  keyboardType="number-pad"
                  maxLength={3}
                />
                <Text style={styles.thresholdUnit}>%</Text>
              </View>
            </View>
          )}
        </Card>

        {/* 预览 */}
        {selectedCategoryData && budgetAmount && (
          <Card style={styles.previewCard}>
            <Text style={styles.previewTitle}>预算预览</Text>
            <View style={styles.previewContent}>
              <View style={[styles.previewIcon, { backgroundColor: selectedCategoryData.color + '30' }]}>
                <Text style={styles.previewIconText}>{selectedCategoryData.icon}</Text>
              </View>
              <View style={styles.previewInfo}>
                <Text style={styles.previewName}>{selectedCategoryData.name}</Text>
                <Text style={styles.previewAmount}>
                  每月预算: ¥{parseFloat(budgetAmount).toLocaleString()}
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
            <Text style={styles.saveText}>保存预算</Text>
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
  // 分类选择
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryItem: {
    width: '23%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  categoryIconText: {
    fontSize: 18,
  },
  categoryLabel: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
  },
  // 预算金额
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  currencySymbol: {
    fontSize: FontSize.xl,
    color: Colors.text.secondary,
    marginRight: Spacing.sm,
  },
  amountField: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: FontSize.xl,
    color: Colors.text.primary,
  },
  periodText: {
    fontSize: FontSize.base,
    color: Colors.text.tertiary,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickAmount: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  // 预算提醒
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  alertIcon: {
    fontSize: 24,
  },
  alertTitle: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
    fontWeight: FontWeight.medium,
  },
  alertSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  alertToggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gray[300],
    justifyContent: 'center',
    padding: 2,
  },
  alertToggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.card,
  },
  alertToggleThumbActive: {
    alignSelf: 'flex-end',
  },
  thresholdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  thresholdLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  thresholdInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  thresholdField: {
    width: 50,
    paddingVertical: Spacing.xs,
    fontSize: FontSize.base,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  thresholdUnit: {
    fontSize: FontSize.base,
    color: Colors.text.secondary,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  previewIconText: {
    fontSize: 22,
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
  previewAmount: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
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

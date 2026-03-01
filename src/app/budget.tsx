/**
 * 攒钱记账 - 预算设置页
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows } from '@/constants/layout';
import { Card } from '@/components/ui';
import { AccountBookType } from '@/types';

// 模拟预算数据
const mockBudgets = {
  personal: {
    totalBudget: 8000,
    spent: 5230,
    categories: [
      { id: '1', name: '餐饮', icon: '🍜', budget: 2000, spent: 1580, color: '#FF6B6B' },
      { id: '2', name: '交通', icon: '🚗', budget: 800, spent: 650, color: '#4CAF50' },
      { id: '3', name: '购物', icon: '🛒', budget: 1500, spent: 1200, color: '#2196F3' },
      { id: '4', name: '娱乐', icon: '🎮', budget: 1000, spent: 800, color: '#9C6ADE' },
      { id: '5', name: '日用', icon: '🏠', budget: 500, spent: 420, color: '#FFB84D' },
    ],
  },
  business: {
    totalBudget: 30000,
    spent: 18500,
    categories: [
      { id: '6', name: '办公', icon: '📎', budget: 5000, spent: 3200, color: '#2E7EB5' },
      { id: '7', name: '差旅', icon: '✈️', budget: 10000, spent: 8500, color: '#4CAF50' },
      { id: '8', name: '招待', icon: '🍽️', budget: 8000, spent: 4800, color: '#FF6B6B' },
    ],
  },
};

// 预算进度条组件
const BudgetProgress: React.FC<{
  spent: number;
  budget: number;
  color: string;
}> = ({ spent, budget, color }) => {
  const percentage = Math.min((spent / budget) * 100, 100);
  const isOverBudget = spent > budget;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { 
              width: `${percentage}%`, 
              backgroundColor: isOverBudget ? Colors.expense : color,
            },
          ]}
        />
      </View>
      <Text style={[styles.progressText, isOverBudget && styles.overBudgetText]}>
        {percentage.toFixed(0)}%
      </Text>
    </View>
  );
};

// 分类预算卡片
const CategoryBudgetCard: React.FC<{
  category: typeof mockBudgets.personal.categories[0];
  onPress: () => void;
}> = ({ category, onPress }) => {
  const remaining = category.budget - category.spent;
  const isOverBudget = remaining < 0;

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryLeft}>
            <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
              <Text style={styles.categoryIconText}>{category.icon}</Text>
            </View>
            <View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categorySpent}>
                已花 ¥{category.spent.toLocaleString()} / ¥{category.budget.toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.categoryRight}>
            <Text style={[styles.remainingAmount, isOverBudget && styles.overBudgetAmount]}>
              {isOverBudget ? '超支' : '剩余'} ¥{Math.abs(remaining).toLocaleString()}
            </Text>
            <Text style={styles.categoryArrow}>›</Text>
          </View>
        </View>
        <BudgetProgress spent={category.spent} budget={category.budget} color={category.color} />
      </Card>
    </TouchableOpacity>
  );
};

export default function BudgetPage() {
  const [activeBook, setActiveBook] = useState<AccountBookType>('personal');
  const [budgetEnabled, setBudgetEnabled] = useState(true);
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState('80');

  const budgetData = activeBook === 'personal' ? mockBudgets.personal : mockBudgets.business;
  const bookColor = activeBook === 'personal' ? Colors.personal : Colors.business;
  const remaining = budgetData.totalBudget - budgetData.spent;
  const percentage = (budgetData.spent / budgetData.totalBudget) * 100;

  const handleEditCategory = (categoryId: string) => {
    console.log('Edit category budget:', categoryId);
  };

  const handleAddCategory = () => {
    router.push('/budget/new' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>预算设置</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 账本切换 */}
      <View style={styles.bookTabs}>
        <TouchableOpacity
          style={[
            styles.bookTab,
            activeBook === 'personal' && { backgroundColor: Colors.personalLight },
          ]}
          onPress={() => setActiveBook('personal')}
        >
          <View style={[styles.bookDot, { backgroundColor: Colors.personal }]} />
          <Text style={[
            styles.bookTabText,
            activeBook === 'personal' && { color: Colors.personal },
          ]}>
            个人账本
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.bookTab,
            activeBook === 'business' && { backgroundColor: Colors.businessLight },
          ]}
          onPress={() => setActiveBook('business')}
        >
          <View style={[styles.bookDot, { backgroundColor: Colors.business }]} />
          <Text style={[
            styles.bookTabText,
            activeBook === 'business' && { color: Colors.business },
          ]}>
            公司账本
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 总预算卡片 */}
        <Card style={styles.totalCard}>
          <View style={styles.totalHeader}>
            <Text style={styles.totalLabel}>本月总预算</Text>
            <Switch
              value={budgetEnabled}
              onValueChange={setBudgetEnabled}
              trackColor={{ false: Colors.gray[200], true: bookColor + '60' }}
              thumbColor={budgetEnabled ? bookColor : Colors.gray[400]}
            />
          </View>
          
          {budgetEnabled && (
            <>
              <View style={styles.totalAmountRow}>
                <Text style={styles.totalAmount}>
                  ¥{budgetData.totalBudget.toLocaleString()}
                </Text>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={[styles.editText, { color: bookColor }]}>编辑</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.totalProgress}>
                <View style={styles.totalProgressBar}>
                  <View
                    style={[
                      styles.totalProgressFill,
                      { 
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: percentage > 100 ? Colors.expense : bookColor,
                      },
                    ]}
                  />
                </View>
              </View>
              
              <View style={styles.totalStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>已花费</Text>
                  <Text style={styles.statValue}>¥{budgetData.spent.toLocaleString()}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>{remaining >= 0 ? '剩余' : '超支'}</Text>
                  <Text style={[styles.statValue, remaining < 0 && styles.overBudgetText]}>
                    ¥{Math.abs(remaining).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>进度</Text>
                  <Text style={[styles.statValue, percentage > 100 && styles.overBudgetText]}>
                    {percentage.toFixed(0)}%
                  </Text>
                </View>
              </View>
            </>
          )}
        </Card>

        {/* 预算提醒设置 */}
        <Card style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <View style={styles.alertLeft}>
              <Text style={styles.alertIcon}>⚠️</Text>
              <View>
                <Text style={styles.alertTitle}>预算提醒</Text>
                <Text style={styles.alertSubtitle}>达到预算比例时提醒</Text>
              </View>
            </View>
            <Switch
              value={alertEnabled}
              onValueChange={setAlertEnabled}
              trackColor={{ false: Colors.gray[200], true: Colors.warning + '60' }}
              thumbColor={alertEnabled ? Colors.warning : Colors.gray[400]}
            />
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

        {/* 分类预算 */}
        {budgetEnabled && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>分类预算</Text>
              <TouchableOpacity onPress={handleAddCategory}>
                <Text style={[styles.addCategoryText, { color: bookColor }]}>+ 添加</Text>
              </TouchableOpacity>
            </View>

            {budgetData.categories.map((category) => (
              <CategoryBudgetCard
                key={category.id}
                category={category}
                onPress={() => handleEditCategory(category.id)}
              />
            ))}
          </>
        )}
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
  // 账本切换
  bookTabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  bookTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray[100],
    gap: Spacing.sm,
  },
  bookDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bookTabText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    fontWeight: FontWeight.medium,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['2xl'],
  },
  // 总预算卡片
  totalCard: {
    marginBottom: Spacing.md,
  },
  totalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  totalLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  totalAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  totalAmount: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  editButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  editText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  totalProgress: {
    marginBottom: Spacing.md,
  },
  totalProgressBar: {
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  totalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  totalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  // 预算提醒
  alertCard: {
    marginBottom: Spacing.lg,
  },
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
  // 分类预算
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
  addCategoryText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  categoryCard: {
    marginBottom: Spacing.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconText: {
    fontSize: 18,
  },
  categoryName: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
    fontWeight: FontWeight.medium,
  },
  categorySpent: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remainingAmount: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginRight: Spacing.sm,
  },
  overBudgetAmount: {
    color: Colors.expense,
  },
  categoryArrow: {
    fontSize: 20,
    color: Colors.text.tertiary,
  },
  // 进度条
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.gray[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    width: 36,
    textAlign: 'right',
  },
  overBudgetText: {
    color: Colors.expense,
  },
});

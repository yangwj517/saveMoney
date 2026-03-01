/**
 * 攒钱记账 - 攒钱目标列表页
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows, Sizes } from '@/constants/layout';
import { Card } from '@/components/ui';
import { AccountBookType, SavingsGoal } from '@/types';
import { getSavingsGoalsByBookType, getDepositsByGoalId } from '@/mocks';

type BookFilter = 'all' | 'personal' | 'business';

// 环形进度条组件
const CircularProgress: React.FC<{
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}> = ({ percentage, size = 60, strokeWidth = 6, color = Colors.primary.default }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: Colors.gray[200],
          position: 'absolute',
        }}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          borderTopColor: 'transparent',
          borderRightColor: 'transparent',
          position: 'absolute',
          transform: [{ rotate: `${(percentage / 100) * 360 - 90}deg` }],
        }}
      />
      <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text.primary }}>
        {percentage.toFixed(0)}%
      </Text>
    </View>
  );
};

// 目标卡片组件
const GoalCard: React.FC<{
  goal: SavingsGoal;
  onPress: () => void;
}> = ({ goal, onPress }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const bookColor = goal.bookType === 'personal' ? Colors.personal : Colors.business;
  const deposits = getDepositsByGoalId(goal.id);
  const lastDeposit = deposits[0];

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 });
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.goalCard}>
        {/* 账本标识 */}
        <View style={[styles.bookIndicator, { backgroundColor: bookColor }]} />
        
        <View style={styles.goalContent}>
          {/* 左侧：图标/封面 */}
          <View style={[styles.goalIcon, { backgroundColor: goal.color || bookColor }]}>
            <Text style={styles.goalIconText}>{goal.name.charAt(0)}</Text>
          </View>
          
          {/* 中间：信息 */}
          <View style={styles.goalInfo}>
            <Text style={styles.goalName}>{goal.name}</Text>
            {goal.deadline && (
              <Text style={styles.goalDeadline}>截止: {goal.deadline}</Text>
            )}
            <Text style={styles.goalAmount}>
              ¥{formatAmount(goal.currentAmount)} / ¥{formatAmount(goal.targetAmount)}
            </Text>
            {lastDeposit && (
              <Text style={styles.lastDeposit}>
                最近存入: ¥{lastDeposit.amount}
              </Text>
            )}
          </View>
          
          {/* 右侧：进度 */}
          <CircularProgress 
            percentage={progress} 
            color={goal.color || bookColor}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default function SavingsListPage() {
  const [bookFilter, setBookFilter] = useState<BookFilter>('all');

  const goals = getSavingsGoalsByBookType(
    bookFilter === 'all' ? undefined : bookFilter
  );

  const handleGoalPress = (goalId: string) => {
    // TODO: Navigate to goal detail
    console.log('View goal:', goalId);
  };

  const handleAddGoal = () => {
    // 跳转到新增目标页
    router.push('/savings/new');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>攒钱目标</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 账本筛选 */}
      <View style={styles.filterContainer}>
        {(['all', 'personal', 'business'] as BookFilter[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterItem,
              bookFilter === filter && styles.filterItemActive,
            ]}
            onPress={() => setBookFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                bookFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter === 'all' ? '全部' : filter === 'personal' ? '个人' : '公司'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 目标列表 */}
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onPress={() => handleGoalPress(goal.id)}
          />
        ))}

        {goals.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyText}>暂无攒钱目标</Text>
            <Text style={styles.emptySubtext}>点击右上角 + 创建您的第一个目标</Text>
          </View>
        )}

        {/* 底部留白 */}
        <View style={styles.bottomSpacer} />
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
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 24,
    color: Colors.text.inverse,
    marginTop: -2,
  },
  // 筛选器
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray[100],
  },
  filterItemActive: {
    backgroundColor: Colors.primary.default,
  },
  filterText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  filterTextActive: {
    color: Colors.text.inverse,
    fontWeight: FontWeight.medium,
  },
  // 内容
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
  },
  // 目标卡片
  goalCard: {
    marginBottom: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  bookIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderBottomLeftRadius: BorderRadius['2xl'],
  },
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.sm,
  },
  goalIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  goalIconText: {
    fontSize: FontSize.xl,
    color: Colors.text.inverse,
    fontWeight: FontWeight.bold,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  goalDeadline: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  goalAmount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
  },
  lastDeposit: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 4,
  },
  // 空状态
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
  // 底部留白
  bottomSpacer: {
    height: 40,
  },
});

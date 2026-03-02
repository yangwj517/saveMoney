/**
 * 攒钱记账 - 首页（今日概览）
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Gradients } from '@/constants/colors';
import { Typography, FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows, Sizes } from '@/constants/layout';
import { Card, GlassCard } from '@/components/ui';
import { AccountBookType, Record as RecordType } from '@/types';
import { useAuthStore } from '@/store/auth';
import * as statisticsService from '@/services/statistics';
import * as recordService from '@/services/record';
import * as savingsService from '@/services/savings';

const { width } = Dimensions.get('window');

// 格式化日期
const formatDate = () => {
  const now = new Date();
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekDay = weekDays[now.getDay()];
  return `${year}年${month}月${day}日 ${weekDay}`;
};

// 格式化金额
const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 });
};

export default function HomePage() {
  const [currentBook, setCurrentBook] = useState<AccountBookType>('personal');
  const [personalOverview, setPersonalOverview] = useState<any>(null);
  const [businessOverview, setBusinessOverview] = useState<any>(null);
  const [recentRecords, setRecentRecords] = useState<any[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  const fetchData = useCallback(async () => {
    try {
      const [pOverview, bOverview, recordsData, goalsData] = await Promise.all([
        statisticsService.getOverview('personal').catch(() => null),
        statisticsService.getOverview('business').catch(() => null),
        recordService.getRecords({ bookType: 'personal', page: 1, pageSize: 5 }).catch(() => ({ list: [] })),
        savingsService.getGoals('personal', false).catch(() => []),
      ]);
      setPersonalOverview(pOverview);
      setBusinessOverview(bOverview);
      setRecentRecords(recordsData?.list || recordsData || []);
      setSavingsGoals(Array.isArray(goalsData) ? goalsData.slice(0, 2) : []);
    } catch (e) {
      console.log('Home fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const personalBalance = personalOverview?.totalBalance || 0;
  const businessBalance = businessOverview?.totalBalance || 0;

  const handleQuickRecord = (type: 'expense' | 'income') => {
    // 跳转到记账页，并传递类型参数
    router.push(`/(tabs)/record?type=${type}` as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 顶部导航 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.nickname?.charAt(0) || '用'}</Text>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.dateText}>{formatDate()}</Text>
          
          <TouchableOpacity style={styles.notificationContainer}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* 账本切换器 */}
        <View style={styles.bookSwitcher}>
          <TouchableOpacity
            style={[
              styles.bookTab,
              currentBook === 'personal' && styles.bookTabActivePersonal,
            ]}
            onPress={() => setCurrentBook('personal')}
          >
            <Text
              style={[
                styles.bookTabText,
                currentBook === 'personal' && styles.bookTabTextActivePersonal,
              ]}
            >
              个人账本
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.bookTab,
              currentBook === 'business' && styles.bookTabActiveBusiness,
            ]}
            onPress={() => setCurrentBook('business')}
          >
            <Text
              style={[
                styles.bookTabText,
                currentBook === 'business' && styles.bookTabTextActiveBusiness,
              ]}
            >
              公司账本
            </Text>
          </TouchableOpacity>
        </View>

        {/* 资产卡片 */}
        <GlassCard style={styles.assetCard} showTopBorder bookType="both" padding="lg">
          <View style={styles.assetContent}>
            <View style={styles.assetItem}>
              <View style={styles.assetLabelRow}>
                <View style={[styles.bookDot, { backgroundColor: Colors.personal }]} />
                <Text style={styles.assetLabel}>个人账本</Text>
              </View>
              <Text style={styles.assetAmount}>¥{formatAmount(personalBalance)}</Text>
              <Text style={styles.assetChange}>今日 +¥{formatAmount(personalOverview?.todayIncome || 0)}</Text>
            </View>
            
            <View style={styles.assetDivider} />
            
            <View style={styles.assetItem}>
              <View style={styles.assetLabelRow}>
                <View style={[styles.bookDot, { backgroundColor: Colors.business }]} />
                <Text style={styles.assetLabel}>公司账本</Text>
              </View>
              <Text style={styles.assetAmount}>¥{formatAmount(businessBalance)}</Text>
              <Text style={styles.assetChange}>今日 +¥{formatAmount(businessOverview?.todayIncome || 0)}</Text>
            </View>
          </View>
        </GlassCard>

        {/* 快速记账 */}
        <View style={styles.quickRecordContainer}>
          <TouchableOpacity
            style={styles.quickRecordButton}
            onPress={() => handleQuickRecord('expense')}
          >
            <View style={[styles.quickRecordIcon, { backgroundColor: Colors.expenseLight }]}>
              <Text style={styles.quickRecordEmoji}>💸</Text>
            </View>
            <Text style={[styles.quickRecordText, { color: Colors.expense }]}>支出</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickRecordButton}
            onPress={() => handleQuickRecord('income')}
          >
            <View style={[styles.quickRecordIcon, { backgroundColor: Colors.incomeLight }]}>
              <Text style={styles.quickRecordEmoji}>💰</Text>
            </View>
            <Text style={[styles.quickRecordText, { color: Colors.income }]}>收入</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.todayCount}>今日已记 3 笔</Text>

        {/* 攒钱进度 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>攒钱目标</Text>
          <TouchableOpacity onPress={() => router.push('/savings' as any)}>
            <Text style={styles.sectionLink}>查看全部</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.savingsScrollContent}
        >
          {savingsGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const bookColor = goal.bookType === 'personal' ? Colors.personal : Colors.business;
            
            return (
              <Card key={goal.id} style={styles.savingsCard}>
                <View style={[styles.savingsBookIndicator, { backgroundColor: bookColor }]} />
                <View style={styles.savingsContent}>
                  <Text style={styles.savingsName}>{goal.name}</Text>
                  <View style={styles.savingsProgressBar}>
                    <LinearGradient
                      colors={Gradients.primary as [string, string]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.savingsProgress, { width: `${progress}%` }]}
                    />
                  </View>
                  <View style={styles.savingsInfo}>
                    <Text style={styles.savingsAmount}>
                      ¥{formatAmount(goal.currentAmount)} / ¥{formatAmount(goal.targetAmount)}
                    </Text>
                    <Text style={styles.savingsPercent}>{progress.toFixed(0)}%</Text>
                  </View>
                  {goal.deadline && (
                    <Text style={styles.savingsDeadline}>截止: {goal.deadline}</Text>
                  )}
                </View>
              </Card>
            );
          })}
        </ScrollView>

        {/* 最近账单 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最近记录</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>查看全部</Text>
          </TouchableOpacity>
        </View>
        
        <Card style={styles.recordsCard}>
          {recentRecords.map((record, index) => {
            const isExpense = record.type === 'expense';
            const bookColor = record.bookType === 'personal' ? Colors.personal : Colors.business;
            
            return (
              <View key={record.id}>
                <View style={styles.recordItem}>
                  <View style={[styles.recordBookIndicator, { backgroundColor: bookColor }]} />
                  <View style={[styles.recordCategoryIcon, { backgroundColor: record.category?.color || Colors.gray[300] }]}>
                    <Text style={styles.recordCategoryEmoji}>
                      {record.category?.name?.charAt(0) || '?'}
                    </Text>
                  </View>
                  <View style={styles.recordInfo}>
                    <Text style={styles.recordCategory}>{record.category?.name || '未分类'}</Text>
                    <Text style={styles.recordNote}>{record.note || '-'}</Text>
                  </View>
                  <View style={styles.recordAmountContainer}>
                    <Text style={[styles.recordAmount, { color: isExpense ? Colors.expense : Colors.income }]}>
                      {isExpense ? '-' : '+'}¥{formatAmount(record.amount)}
                    </Text>
                    <Text style={styles.recordTime}>
                      {new Date(record.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
                {index < recentRecords.length - 1 && <View style={styles.recordDivider} />}
              </View>
            );
          })}
        </Card>

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
  },
  // 顶部导航
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  avatarContainer: {
    padding: Spacing.xs,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.text.inverse,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  dateText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
  },
  notificationContainer: {
    padding: Spacing.xs,
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  // 账本切换器
  bookSwitcher: {
    flexDirection: 'row',
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  bookTab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray[100],
  },
  bookTabActivePersonal: {
    backgroundColor: Colors.personalLight,
    ...Shadows.sm,
  },
  bookTabActiveBusiness: {
    backgroundColor: Colors.businessLight,
    ...Shadows.sm,
  },
  bookTabText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    fontWeight: FontWeight.medium,
  },
  bookTabTextActivePersonal: {
    color: Colors.personal,
  },
  bookTabTextActiveBusiness: {
    color: Colors.business,
  },
  // 资产卡片
  assetCard: {
    marginBottom: Spacing.lg,
  },
  assetContent: {
    flexDirection: 'row',
  },
  assetItem: {
    flex: 1,
  },
  assetLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  bookDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  assetLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  assetAmount: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  assetChange: {
    fontSize: FontSize.xs,
    color: Colors.income,
  },
  assetDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.base,
  },
  // 快速记账
  quickRecordContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  quickRecordButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  quickRecordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  quickRecordEmoji: {
    fontSize: 20,
  },
  quickRecordText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  todayCount: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xl,
  },
  // 通用 Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  sectionLink: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  // 攒钱目标
  savingsScrollContent: {
    paddingRight: Spacing.base,
    paddingBottom: Spacing.base,
  },
  savingsCard: {
    width: width * 0.65,
    marginRight: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  savingsBookIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderBottomLeftRadius: BorderRadius['2xl'],
  },
  savingsContent: {
    paddingLeft: Spacing.sm,
  },
  savingsName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  savingsProgressBar: {
    height: 6,
    backgroundColor: Colors.gray[200],
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  savingsProgress: {
    height: '100%',
    borderRadius: 3,
  },
  savingsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  savingsAmount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
  },
  savingsPercent: {
    fontSize: FontSize.sm,
    color: Colors.primary.default,
    fontWeight: FontWeight.semibold,
  },
  savingsDeadline: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
  // 最近记录
  recordsCard: {
    marginBottom: Spacing.lg,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  recordBookIndicator: {
    width: 3,
    height: 40,
    borderRadius: 2,
    marginRight: Spacing.sm,
  },
  recordCategoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  recordCategoryEmoji: {
    fontSize: 14,
    color: Colors.text.inverse,
    fontWeight: FontWeight.semibold,
  },
  recordInfo: {
    flex: 1,
  },
  recordCategory: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
  },
  recordNote: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  recordAmountContainer: {
    alignItems: 'flex-end',
  },
  recordAmount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  recordTime: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  recordDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 55,
  },
  // 底部留白
  bottomSpacer: {
    height: Sizes.tabBar + 40,
  },
});

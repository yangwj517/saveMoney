/**
 * 攒钱记账 - 个人中心页
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows, Sizes } from '@/constants/layout';
import { Card, GlassCard } from '@/components/ui';
import { useAuthStore } from '@/store/auth';
import * as authServiceApi from '@/services/auth';
import * as statisticsService from '@/services/statistics';
import * as userService from '@/services/user';
import { useFocusEffect } from '@react-navigation/native';

// 菜单项组件
const MenuItem: React.FC<{
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
}> = ({ icon, title, subtitle, onPress, danger }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <View>
        <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
);

// 菜单分组组件
const MenuGroup: React.FC<{
  title?: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <View style={styles.menuGroup}>
    {title && <Text style={styles.menuGroupTitle}>{title}</Text>}
    <Card style={styles.menuCard} padding="none">
      {children}
    </Card>
  </View>
);

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);
  const [personalBalance, setPersonalBalance] = useState(0);
  const [businessBalance, setBusinessBalance] = useState(0);

  const loadBalances = useCallback(async () => {
    try {
      const [pOverview, bOverview] = await Promise.all([
        statisticsService.getOverview('personal').catch(() => null),
        statisticsService.getOverview('business').catch(() => null),
      ]);
      setPersonalBalance(pOverview?.totalBalance || 0);
      setBusinessBalance(bOverview?.totalBalance || 0);
    } catch {}
  }, []);

  // 页面获得焦点时自动刷新数据
  useFocusEffect(
    useCallback(() => {
      loadBalances();
    }, [loadBalances])
  );

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 });
  };

  const handleLogout = async () => {
    try {
      await authServiceApi.logout();
    } catch {}
    logoutStore();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 用户卡片 */}
        <GlassCard style={styles.userCard} padding="lg">
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.nickname?.charAt(0) || '用'}</Text>
            </View>
            <View style={styles.userDetails}>
              <View style={styles.userNameRow}>
                <Text style={styles.userName}>{user?.nickname || '用户'}</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => router.push('/profile/edit')}>
                  <Text style={styles.editText}>编辑资料 ›</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.userId}>ID: {user?.id || '-'}</Text>
            </View>
          </View>
        </GlassCard>

        {/* 账本概览 */}
        <View style={styles.bookOverview}>
          <TouchableOpacity style={styles.bookCard}>
            <View style={[styles.bookIndicator, { backgroundColor: Colors.personal }]} />
            <Text style={styles.bookLabel}>个人总资产</Text>
            <Text style={styles.bookAmount}>¥{formatAmount(personalBalance)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookCard}>
            <View style={[styles.bookIndicator, { backgroundColor: Colors.business }]} />
            <Text style={styles.bookLabel}>公司总资产</Text>
            <Text style={styles.bookAmount}>¥{formatAmount(businessBalance)}</Text>
          </TouchableOpacity>
        </View>

        {/* 功能菜单 */}
        <MenuGroup title="账本管理">
          <MenuItem icon="💳" title="账户管理" subtitle="管理各类账户" onPress={() => router.push('/accounts' as any)} />
          <View style={styles.menuDivider} />
          <MenuItem icon="🏷️" title="收支分类" subtitle="管理收入支出分类" onPress={() => router.push('/categories' as any)} />
          <View style={styles.menuDivider} />
          <MenuItem icon="📊" title="预算设置" subtitle="控制消费支出" onPress={() => router.push('/budget' as any)} />
          <View style={styles.menuDivider} />
          <MenuItem icon="⏰" title="账单提醒" subtitle="定时提醒记账" onPress={() => router.push('/reminders' as any)} />
        </MenuGroup>

        <MenuGroup title="设置">
          <MenuItem icon="🔔" title="消息通知" onPress={() => router.push('/notifications' as any)} />
          <View style={styles.menuDivider} />
          <MenuItem icon="❓" title="帮助与反馈" onPress={() => router.push('/feedback' as any)} />
        </MenuGroup>

        <MenuGroup>
          <MenuItem 
            icon="🚪" 
            title="退出登录" 
            danger 
            onPress={handleLogout}
          />
        </MenuGroup>

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
    paddingTop: Spacing.md,
  },
  // 用户卡片
  userCard: {
    marginBottom: Spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize['2xl'],
    color: Colors.text.inverse,
    fontWeight: FontWeight.bold,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  editButton: {
    padding: Spacing.xs,
  },
  editText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  userId: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
  // 账本概览
  bookOverview: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  bookCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.sm,
  },
  bookIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  bookLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.sm,
  },
  bookAmount: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    paddingLeft: Spacing.sm,
  },
  // 菜单
  menuGroup: {
    marginBottom: Spacing.lg,
  },
  menuGroupTitle: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  menuCard: {
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuTitle: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  menuTitleDanger: {
    color: Colors.error,
  },
  menuSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 20,
    color: Colors.text.tertiary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 52,
  },
  // 底部留白
  bottomSpacer: {
    height: Sizes.tabBar + 40,
  },
});

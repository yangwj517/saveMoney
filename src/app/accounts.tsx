/**
 * 攒钱记账 - 账户管理页
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
import { BorderRadius, Spacing, Shadows } from '@/constants/layout';
import { Card } from '@/components/ui';
import { AccountBookType } from '@/types';

// 模拟账户数据
const mockAccounts = {
  personal: [
    { id: '1', name: '现金', balance: 2580.50, icon: '💵', type: 'cash' },
    { id: '2', name: '支付宝', balance: 15680.00, icon: '📱', type: 'alipay' },
    { id: '3', name: '微信钱包', balance: 8920.30, icon: '💬', type: 'wechat' },
    { id: '4', name: '银行卡', balance: 45000.00, icon: '💳', type: 'bank' },
    { id: '5', name: '信用卡', balance: -3500.00, icon: '💳', type: 'credit' },
  ],
  business: [
    { id: '6', name: '公司备用金', balance: 50000.00, icon: '💰', type: 'cash' },
    { id: '7', name: '对公账户', balance: 128500.00, icon: '🏦', type: 'bank' },
  ],
};

// 账户卡片组件
const AccountCard: React.FC<{
  account: typeof mockAccounts.personal[0];
  bookType: AccountBookType;
  onPress: () => void;
}> = ({ account, bookType, onPress }) => {
  const bookColor = bookType === 'personal' ? Colors.personal : Colors.business;
  const isNegative = account.balance < 0;

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.accountCard}>
        <View style={styles.accountLeft}>
          <View style={[styles.accountIcon, { backgroundColor: bookColor + '15' }]}>
            <Text style={styles.accountIconText}>{account.icon}</Text>
          </View>
          <Text style={styles.accountName}>{account.name}</Text>
        </View>
        <View style={styles.accountRight}>
          <Text style={[styles.accountBalance, isNegative && styles.negativeBalance]}>
            {isNegative ? '-' : ''}¥{Math.abs(account.balance).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.accountArrow}>›</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default function AccountsPage() {
  const [activeBook, setActiveBook] = useState<AccountBookType>('personal');

  const accounts = activeBook === 'personal' ? mockAccounts.personal : mockAccounts.business;
  const bookColor = activeBook === 'personal' ? Colors.personal : Colors.business;

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleAddAccount = () => {
    router.push('/accounts/new' as any);
  };

  const handleAccountPress = (accountId: string) => {
    console.log('Edit account:', accountId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>账户管理</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddAccount}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
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
        {/* 总资产卡片 */}
        <LinearGradient
          colors={activeBook === 'personal' ? ['#9C6ADE', '#7C4DFF'] : ['#2E7EB5', '#1565C0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.totalCard}
        >
          <Text style={styles.totalLabel}>
            {activeBook === 'personal' ? '个人' : '公司'}总资产
          </Text>
          <Text style={styles.totalAmount}>
            ¥{totalBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.totalHint}>
            共 {accounts.length} 个账户
          </Text>
        </LinearGradient>

        {/* 账户列表 */}
        <View style={styles.accountList}>
          <Text style={styles.sectionTitle}>账户列表</Text>
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              bookType={activeBook}
              onPress={() => handleAccountPress(account.id)}
            />
          ))}
        </View>

        {/* 添加账户按钮 */}
        <TouchableOpacity style={styles.addAccountButton} onPress={handleAddAccount}>
          <Text style={[styles.addAccountIcon, { color: bookColor }]}>+</Text>
          <Text style={[styles.addAccountText, { color: bookColor }]}>添加新账户</Text>
        </TouchableOpacity>

        {/* 提示 */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 温馨提示</Text>
          <Text style={styles.tipsText}>
            • 点击账户可以编辑账户信息{'\n'}
            • 信用卡账户余额为负数表示待还款金额{'\n'}
            • 建议定期核对各账户实际余额
          </Text>
        </View>
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
  // 总资产卡片
  totalCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  totalLabel: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.xs,
  },
  totalAmount: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
  },
  totalHint: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.6)',
  },
  // 账户列表
  accountList: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.md,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountIconText: {
    fontSize: 20,
  },
  accountName: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
    fontWeight: FontWeight.medium,
  },
  accountRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountBalance: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
    fontWeight: FontWeight.semibold,
    marginRight: Spacing.sm,
  },
  negativeBalance: {
    color: Colors.expense,
  },
  accountArrow: {
    fontSize: 20,
    color: Colors.text.tertiary,
  },
  // 添加账户
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.borderLight,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  addAccountIcon: {
    fontSize: 20,
  },
  addAccountText: {
    fontSize: FontSize.sm,
  },
  // 提示
  tips: {
    backgroundColor: Colors.primary.default + '10',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  tipsTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  tipsText: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});

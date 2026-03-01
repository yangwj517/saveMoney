/**
 * 攒钱记账 - 账单提醒页
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows } from '@/constants/layout';
import { Card } from '@/components/ui';

// 模拟提醒数据
const mockReminders = [
  {
    id: '1',
    title: '房租',
    amount: 3500,
    day: 1,
    enabled: true,
    type: 'expense',
    bookType: 'personal',
  },
  {
    id: '2',
    title: '信用卡还款',
    amount: 5000,
    day: 15,
    enabled: true,
    type: 'expense',
    bookType: 'personal',
  },
  {
    id: '3',
    title: '工资',
    amount: 15000,
    day: 10,
    enabled: true,
    type: 'income',
    bookType: 'personal',
  },
  {
    id: '4',
    title: '办公室租金',
    amount: 8000,
    day: 5,
    enabled: false,
    type: 'expense',
    bookType: 'business',
  },
];

// 提醒项组件
const ReminderItem: React.FC<{
  reminder: typeof mockReminders[0];
  onToggle: (id: string, enabled: boolean) => void;
  onPress: () => void;
}> = ({ reminder, onToggle, onPress }) => {
  const bookColor = reminder.bookType === 'personal' ? Colors.personal : Colors.business;
  const typeColor = reminder.type === 'expense' ? Colors.expense : Colors.income;

  return (
    <TouchableOpacity style={styles.reminderItem} onPress={onPress}>
      <View style={[styles.reminderIndicator, { backgroundColor: bookColor }]} />
      <View style={styles.reminderContent}>
        <View style={styles.reminderLeft}>
          <View style={[styles.reminderIcon, { backgroundColor: typeColor + '20' }]}>
            <Text style={[styles.reminderIconText, { color: typeColor }]}>
              {reminder.type === 'expense' ? '支' : '收'}
            </Text>
          </View>
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderTitle}>{reminder.title}</Text>
            <Text style={styles.reminderDetail}>
              每月{reminder.day}日 · ¥{reminder.amount.toLocaleString()}
            </Text>
          </View>
        </View>
        <Switch
          value={reminder.enabled}
          onValueChange={(value) => onToggle(reminder.id, value)}
          trackColor={{ false: Colors.gray[200], true: Colors.primary.default + '60' }}
          thumbColor={reminder.enabled ? Colors.primary.default : Colors.gray[400]}
        />
      </View>
    </TouchableOpacity>
  );
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState(mockReminders);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('20:00');

  const handleToggle = (id: string, enabled: boolean) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, enabled } : r
    ));
  };

  const handleAddReminder = () => {
    router.push('/reminders/new' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>账单提醒</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddReminder}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 每日提醒设置 */}
        <Card style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>⏰</Text>
              <View>
                <Text style={styles.settingTitle}>每日记账提醒</Text>
                <Text style={styles.settingSubtitle}>提醒您记录每天的收支</Text>
              </View>
            </View>
            <Switch
              value={dailyReminder}
              onValueChange={setDailyReminder}
              trackColor={{ false: Colors.gray[200], true: Colors.primary.default + '60' }}
              thumbColor={dailyReminder ? Colors.primary.default : Colors.gray[400]}
            />
          </View>
          
          {dailyReminder && (
            <>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.timeSelector}>
                <Text style={styles.timeLabel}>提醒时间</Text>
                <View style={styles.timeRight}>
                  <Text style={styles.timeValue}>{reminderTime}</Text>
                  <Text style={styles.timeArrow}>›</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </Card>

        {/* 周期账单 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>周期账单</Text>
          <Text style={styles.sectionSubtitle}>自动提醒固定收支</Text>
        </View>

        <Card style={styles.reminderList} padding="none">
          {reminders.map((reminder, index) => (
            <View key={reminder.id}>
              {index > 0 && <View style={styles.reminderDivider} />}
              <ReminderItem
                reminder={reminder}
                onToggle={handleToggle}
                onPress={() => console.log('Edit reminder:', reminder.id)}
              />
            </View>
          ))}
        </Card>

        {/* 空状态提示 */}
        {reminders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>暂无周期账单</Text>
            <Text style={styles.emptySubtext}>添加您的固定收支，系统会定时提醒</Text>
          </View>
        )}

        {/* 提示说明 */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 温馨提示</Text>
          <Text style={styles.tipsText}>
            • 周期账单会在到期日当天发送提醒通知{'\n'}
            • 请确保已开启应用通知权限{'\n'}
            • 点击账单可以编辑详情
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['2xl'],
  },
  // 设置卡片
  section: {
    marginBottom: Spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingIcon: {
    fontSize: 24,
  },
  settingTitle: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
    fontWeight: FontWeight.medium,
  },
  settingSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: FontSize.base,
    color: Colors.text.secondary,
  },
  timeRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeValue: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
    marginRight: Spacing.xs,
  },
  timeArrow: {
    fontSize: 20,
    color: Colors.text.tertiary,
  },
  // 周期账单
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  reminderList: {
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  reminderItem: {
    flexDirection: 'row',
    position: 'relative',
  },
  reminderIndicator: {
    width: 4,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  reminderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingLeft: Spacing.lg,
  },
  reminderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginRight: Spacing.md,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderIconText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
    fontWeight: FontWeight.medium,
  },
  reminderDetail: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  reminderDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: Spacing.lg + 40 + Spacing.md,
  },
  // 空状态
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
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

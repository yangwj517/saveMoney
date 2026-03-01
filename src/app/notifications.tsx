/**
 * 攒钱记账 - 消息通知页
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

// 模拟通知消息
const mockNotifications = [
  {
    id: '1',
    type: 'reminder',
    title: '记账提醒',
    content: '今天还没记账哦，别忘了记录今天的收支～',
    time: '20:00',
    date: '今天',
    read: false,
  },
  {
    id: '2',
    type: 'achievement',
    title: '目标达成',
    content: '恭喜！您的「旅行基金」目标已完成 50%！',
    time: '15:30',
    date: '今天',
    read: false,
  },
  {
    id: '3',
    type: 'bill',
    title: '账单提醒',
    content: '明天是您的「信用卡还款日」，请注意按时还款',
    time: '10:00',
    date: '昨天',
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: '系统通知',
    content: '您的账本数据已成功同步到云端',
    time: '09:00',
    date: '昨天',
    read: true,
  },
  {
    id: '5',
    type: 'report',
    title: '周报生成',
    content: '您的上周财务周报已生成，点击查看详情',
    time: '08:00',
    date: '3天前',
    read: true,
  },
];

// 通知图标映射
const notificationIcons: Record<string, string> = {
  reminder: '⏰',
  achievement: '🎯',
  bill: '📅',
  system: '🔔',
  report: '📊',
};

// 通知颜色映射
const notificationColors: Record<string, string> = {
  reminder: Colors.primary.default,
  achievement: Colors.income,
  bill: Colors.warning,
  system: Colors.text.secondary,
  report: Colors.business,
};

// 通知项组件
const NotificationItem: React.FC<{
  notification: typeof mockNotifications[0];
  onPress: () => void;
}> = ({ notification, onPress }) => {
  const icon = notificationIcons[notification.type];
  const color = notificationColors[notification.type];

  return (
    <TouchableOpacity 
      style={[styles.notificationItem, !notification.read && styles.notificationUnread]}
      onPress={onPress}
    >
      <View style={[styles.notificationIcon, { backgroundColor: color + '20' }]}>
        <Text style={styles.notificationIconText}>{icon}</Text>
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationTime}>{notification.date} {notification.time}</Text>
        </View>
        <Text style={styles.notificationText} numberOfLines={2}>
          {notification.content}
        </Text>
      </View>
      {!notification.read && <View style={[styles.unreadDot, { backgroundColor: color }]} />}
    </TouchableOpacity>
  );
};

// 设置项组件
const SettingItem: React.FC<{
  icon: string;
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}> = ({ icon, title, subtitle, value, onValueChange }) => (
  <View style={styles.settingItem}>
    <View style={styles.settingLeft}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <View>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: Colors.gray[200], true: Colors.primary.default + '60' }}
      thumbColor={value ? Colors.primary.default : Colors.gray[400]}
    />
  </View>
);

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showSettings, setShowSettings] = useState(false);
  
  // 通知设置
  const [pushEnabled, setPushEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [billEnabled, setBillEnabled] = useState(true);
  const [achievementEnabled, setAchievementEnabled] = useState(true);
  const [reportEnabled, setReportEnabled] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationPress = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>消息通知</Text>
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={() => setShowSettings(!showSettings)}
        >
          <Text style={styles.settingsIcon}>{showSettings ? '✕' : '⚙️'}</Text>
        </TouchableOpacity>
      </View>

      {showSettings ? (
        // 通知设置
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>通知权限</Text>
            <SettingItem
              icon="🔔"
              title="推送通知"
              subtitle="开启后可接收应用通知"
              value={pushEnabled}
              onValueChange={setPushEnabled}
            />
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>通知类型</Text>
            <SettingItem
              icon="⏰"
              title="记账提醒"
              subtitle="每日记账提醒通知"
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon="📅"
              title="账单提醒"
              subtitle="周期账单到期提醒"
              value={billEnabled}
              onValueChange={setBillEnabled}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon="🎯"
              title="目标达成"
              subtitle="攒钱目标进度提醒"
              value={achievementEnabled}
              onValueChange={setAchievementEnabled}
            />
            <View style={styles.settingDivider} />
            <SettingItem
              icon="📊"
              title="周报月报"
              subtitle="财务报告生成提醒"
              value={reportEnabled}
              onValueChange={setReportEnabled}
            />
          </Card>

          <View style={styles.tips}>
            <Text style={styles.tipsText}>
              关闭推送通知后，您将无法收到任何应用通知
            </Text>
          </View>
        </ScrollView>
      ) : (
        // 消息列表
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 操作栏 */}
          {notifications.length > 0 && (
            <View style={styles.actionBar}>
              <Text style={styles.unreadText}>
                {unreadCount > 0 ? `${unreadCount} 条未读` : '全部已读'}
              </Text>
              <View style={styles.actionButtons}>
                {unreadCount > 0 && (
                  <TouchableOpacity onPress={handleMarkAllRead}>
                    <Text style={styles.actionText}>全部已读</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleClearAll}>
                  <Text style={[styles.actionText, styles.clearText]}>清空</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 通知列表 */}
          {notifications.length > 0 ? (
            <Card style={styles.notificationList} padding="none">
              {notifications.map((notification, index) => (
                <View key={notification.id}>
                  {index > 0 && <View style={styles.notificationDivider} />}
                  <NotificationItem
                    notification={notification}
                    onPress={() => handleNotificationPress(notification.id)}
                  />
                </View>
              ))}
            </Card>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>暂无消息</Text>
              <Text style={styles.emptySubtext}>通知消息将在这里显示</Text>
            </View>
          )}
        </ScrollView>
      )}
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
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['2xl'],
  },
  // 操作栏
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  unreadText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionText: {
    fontSize: FontSize.sm,
    color: Colors.primary.default,
  },
  clearText: {
    color: Colors.text.tertiary,
  },
  // 通知列表
  notificationList: {
    overflow: 'hidden',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    position: 'relative',
  },
  notificationUnread: {
    backgroundColor: Colors.primary.default + '05',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  notificationIconText: {
    fontSize: 20,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
  },
  notificationTime: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
  notificationText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  notificationDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 40 + Spacing.md * 2,
  },
  // 设置
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingIcon: {
    fontSize: 20,
  },
  settingTitle: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  settingSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  settingDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
    marginLeft: 32,
  },
  // 提示
  tips: {
    paddingHorizontal: Spacing.sm,
  },
  tipsText: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
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
});

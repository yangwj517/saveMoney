/**
 * 攒钱记账 - 消息通知页
 */

import React, { useState, useEffect, useCallback } from 'react';
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
import * as notificationService from '@/services/notification';


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
  notification: any;
  onPress: () => void;
}> = ({ notification, onPress }) => {
  const icon = notificationIcons[notification.type];
  const color = notificationColors[notification.type];

  return (
    <TouchableOpacity 
      style={[styles.notificationItem, !(notification.isRead ?? notification.read) && styles.notificationUnread]}
      onPress={onPress}
    >
      <View style={[styles.notificationIcon, { backgroundColor: color + '20' }]}>
        <Text style={styles.notificationIconText}>{icon}</Text>
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationTime}>{new Date(notification.createdAt || '').toLocaleDateString('zh-CN')}</Text>
        </View>
        <Text style={styles.notificationText} numberOfLines={2}>
          {notification.content}
        </Text>
      </View>
      {!notification.isRead && !notification.read && <View style={[styles.unreadDot, { backgroundColor: color }]} />}
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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  
  // 通知设置
  const [pushEnabled, setPushEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [billEnabled, setBillEnabled] = useState(true);
  const [achievementEnabled, setAchievementEnabled] = useState(true);
  const [reportEnabled, setReportEnabled] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getNotifications(1, 50);
      setNotifications(data?.list || data || []);
    } catch (e) {
      setNotifications([]);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const unreadCount = notifications.filter((n: any) => !n.isRead && !n.read).length;

  const handleNotificationPress = async (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true, read: true } : n
    ));
    try { await notificationService.markAsRead(id); } catch {}
  };

  const handleMarkAllRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true, read: true })));
    try { await notificationService.markAllAsRead(); } catch {}
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

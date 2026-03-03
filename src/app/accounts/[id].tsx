/**
 * 攒钱记账 - 账户详情页（编辑/删除）
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing } from '@/constants/layout';
import { Card, AlertModal } from '@/components/ui';
import { AccountBookType } from '@/types';
import * as accountService from '@/services/account';

// 账户类型选项
const ACCOUNT_TYPES = [
  { key: 'cash', icon: '💵', label: '现金', iconKey: 'wallet' },
  { key: 'bank', icon: '💳', label: '银行卡', iconKey: 'credit-card' },
  { key: 'alipay', icon: '📱', label: '支付宝', iconKey: 'mobile' },
  { key: 'wechat', icon: '💬', label: '微信', iconKey: 'comment' },
  { key: 'credit', icon: '💳', label: '信用卡', iconKey: 'credit-card' },
  { key: 'other', icon: '💰', label: '其他', iconKey: 'wallet' },
];

export default function AccountDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 账户数据
  const [account, setAccount] = useState<any>(null);
  const [bookType, setBookType] = useState<AccountBookType>('personal');
  const [accountType, setAccountType] = useState('cash');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // 弹框状态
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error' | 'warning'>('info');
  const [alertCallback, setAlertCallback] = useState<(() => void) | null>(null);

  // 删除确认弹框
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const showAlert = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'error' | 'warning' = 'info',
    callback?: () => void
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertCallback(() => callback || null);
    setAlertVisible(true);
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
    if (alertCallback) {
      alertCallback();
    }
  };

  useEffect(() => {
    loadAccount();
  }, [id]);

  const loadAccount = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // 尝试从两个账本获取账户
      let acc = null;
      try {
        const personalAccounts = await accountService.getAccounts('personal');
        acc = personalAccounts.find((a: any) => a.id === id);
        if (acc) setBookType('personal');
      } catch {}
      
      if (!acc) {
        try {
          const businessAccounts = await accountService.getAccounts('business');
          acc = businessAccounts.find((a: any) => a.id === id);
          if (acc) setBookType('business');
        } catch {}
      }

      if (acc) {
        setAccount(acc);
        setName(acc.name || '');
        setBalance(acc.balance?.toString() || '0');
        setIsDefault(acc.isDefault || false);
        // 根据 icon 确定账户类型
        const typeInfo = ACCOUNT_TYPES.find((t) => t.iconKey === acc.icon);
        if (typeInfo) setAccountType(typeInfo.key);
      } else {
        showAlert('错误', '账户不存在', 'error', () => router.back());
      }
    } catch (e: any) {
      showAlert('加载失败', e.message || '请稍后重试', 'error');
    } finally {
      setLoading(false);
    }
  };

  const bookColor = bookType === 'personal' ? Colors.personal : Colors.business;

  const handleSave = async () => {
    if (!name.trim()) {
      showAlert('提示', '请输入账户名称', 'warning');
      return;
    }

    setSaving(true);
    try {
      const iconMap: Record<string, string> = {
        cash: 'wallet', bank: 'credit-card', alipay: 'mobile',
        wechat: 'comment', credit: 'credit-card', other: 'wallet',
      };
      
      // 如果设置为默认账户，需要先取消该账本下其他账户的默认状态
      if (isDefault) {
        const allAccounts = await accountService.getAccounts(bookType);
        for (const acc of allAccounts) {
          if (acc.id !== id && acc.isDefault) {
            // 取消其他账户的默认状态
            await accountService.updateAccount(acc.id, { isDefault: false });
          }
        }
      }
      
      await accountService.updateAccount(id!, {
        name,
        balance: parseFloat(balance) || 0,
        icon: iconMap[accountType] || 'wallet',
        isDefault,
      });
      showAlert('保存成功', '账户信息已更新', 'success', () => router.back());
    } catch (e: any) {
      showAlert('保存失败', e.message || '请稍后重试', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = () => {
    setDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    setDeleteConfirmVisible(false);
    setDeleting(true);
    try {
      await accountService.deleteAccount(id!);
      showAlert('删除成功', '账户已删除', 'success', () => router.back());
    } catch (e: any) {
      showAlert('删除失败', e.message || '请稍后重试', 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>账户详情</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 账本信息（只读） */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>所属账本</Text>
          <View style={styles.bookInfo}>
            <View style={[styles.bookDot, { backgroundColor: bookColor }]} />
            <Text style={[styles.bookText, { color: bookColor }]}>
              {bookType === 'personal' ? '个人账本' : '公司账本'}
            </Text>
          </View>
        </Card>

        {/* 账户类型 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>账户类型</Text>
          <View style={styles.typeGrid}>
            {ACCOUNT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.typeItem,
                  accountType === type.key && { backgroundColor: bookColor + '15', borderColor: bookColor },
                ]}
                onPress={() => setAccountType(type.key)}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text style={[styles.typeLabel, accountType === type.key && { color: bookColor }]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* 账户信息 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>账户信息</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>账户名称</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="例如：工商银行储蓄卡"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>账户余额</Text>
            <View style={styles.amountInput}>
              <Text style={styles.currencySymbol}>¥</Text>
              <TextInput
                style={styles.amountField}
                value={balance}
                onChangeText={setBalance}
                placeholder="0.00"
                placeholderTextColor={Colors.text.tertiary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* 默认账户开关 */}
          <TouchableOpacity
            style={styles.switchRow}
            onPress={() => setIsDefault(!isDefault)}
          >
            <Text style={styles.switchLabel}>设为默认账户</Text>
            <View style={[styles.switchTrack, isDefault && { backgroundColor: bookColor }]}>
              <View style={[styles.switchThumb, isDefault && styles.switchThumbActive]} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* 保存按钮 */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <LinearGradient
            colors={Gradients.primary as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveGradient}
          >
            <Text style={styles.saveText}>{saving ? '保存中...' : '保存修改'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* 删除按钮 */}
        <TouchableOpacity
          style={[styles.deleteButton, deleting && styles.buttonDisabled]}
          onPress={handleDeleteConfirm}
          disabled={deleting}
        >
          <Text style={styles.deleteText}>{deleting ? '删除中...' : '删除账户'}</Text>
        </TouchableOpacity>

        {/* 提示 */}
        <View style={styles.tips}>
          <Text style={styles.tipsText}>
            ⚠️ 删除账户后，与该账户关联的账单记录将会保留，但不再显示账户信息。
          </Text>
        </View>
      </ScrollView>

      {/* 删除确认弹框 */}
      <AlertModal
        visible={deleteConfirmVisible}
        title="确认删除"
        message={`确定要删除账户「${name}」吗？此操作无法撤销。`}
        type="warning"
        onClose={() => setDeleteConfirmVisible(false)}
      />
      {deleteConfirmVisible && (
        <View style={styles.confirmButtons}>
          <TouchableOpacity
            style={styles.confirmCancel}
            onPress={() => setDeleteConfirmVisible(false)}
          >
            <Text style={styles.confirmCancelText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmDelete} onPress={handleDelete}>
            <Text style={styles.confirmDeleteText}>确认删除</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 通用弹框 */}
      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onClose={handleAlertClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: FontSize.base,
    color: Colors.text.secondary,
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
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.md,
  },
  // 账本信息
  bookInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bookDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  bookText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  // 账户类型
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeItem: {
    width: '31%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  typeLabel: {
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
    fontSize: FontSize.lg,
    color: Colors.text.secondary,
    marginRight: Spacing.sm,
  },
  amountField: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.lg,
    color: Colors.text.primary,
  },
  // 开关
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  switchLabel: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  switchTrack: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.gray[300],
    padding: 2,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  switchThumbActive: {
    transform: [{ translateX: 22 }],
  },
  // 按钮
  saveButton: {
    marginTop: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
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
  deleteButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.error,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: FontSize.base,
    color: Colors.error,
    fontWeight: FontWeight.medium,
  },
  // 提示
  tips: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.error + '10',
    borderRadius: BorderRadius.md,
  },
  tipsText: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  // 确认按钮
  confirmButtons: {
    position: 'absolute',
    bottom: 100,
    left: Spacing.xl,
    right: Spacing.xl,
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  confirmCancel: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
  },
  confirmCancelText: {
    fontSize: FontSize.base,
    color: Colors.text.secondary,
    fontWeight: FontWeight.medium,
  },
  confirmDelete: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.error,
    alignItems: 'center',
  },
  confirmDeleteText: {
    fontSize: FontSize.base,
    color: '#FFFFFF',
    fontWeight: FontWeight.medium,
  },
});

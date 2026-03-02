/**
 * 攒钱记账 - 新增攒钱目标页
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows } from '@/constants/layout';
import { Card, Button } from '@/components/ui';
import { AccountBookType } from '@/types';
import * as savingsService from '@/services/savings';

// 图标选项
const ICONS = ['🎯', '🏠', '🚗', '✈️', '📱', '💻', '👜', '💍', '📚', '🎓', '🏥', '💰'];

// 颜色选项
const COLORS = [
  '#00B4A0', '#4CAF50', '#2196F3', '#9C6ADE', 
  '#FF6B6B', '#FFB84D', '#6C63FF', '#2E7EB5',
];

export default function NewSavingsGoalPage() {
  const [bookType, setBookType] = useState<AccountBookType>('personal');
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎯');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [note, setNote] = useState('');

  const bookColor = bookType === 'personal' ? Colors.personal : Colors.business;

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('提示', '请输入目标名称');
      return;
    }
    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      Alert.alert('提示', '请输入有效的目标金额');
      return;
    }
    try {
      await savingsService.createGoal({
        name,
        targetAmount: parseFloat(targetAmount),
        bookType,
        deadline: deadline || undefined,
        icon: selectedIcon,
        color: selectedColor,
      });
      router.back();
    } catch (e: any) {
      Alert.alert('创建失败', e.message || '请稍后重试');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>新增目标</Text>
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
              onPress={() => setBookType('personal')}
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
              onPress={() => setBookType('business')}
            >
              <View style={[styles.bookDot, { backgroundColor: Colors.business }]} />
              <Text style={[styles.bookText, bookType === 'business' && { color: Colors.business }]}>
                公司账本
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 目标信息 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>目标信息</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>目标名称</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="例如：买房首付、旅行基金"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>目标金额</Text>
            <View style={styles.amountInput}>
              <Text style={styles.currencySymbol}>¥</Text>
              <TextInput
                style={styles.amountField}
                value={targetAmount}
                onChangeText={setTargetAmount}
                placeholder="0.00"
                placeholderTextColor={Colors.text.tertiary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>初始金额（可选）</Text>
            <View style={styles.amountInput}>
              <Text style={styles.currencySymbol}>¥</Text>
              <TextInput
                style={styles.amountField}
                value={initialAmount}
                onChangeText={setInitialAmount}
                placeholder="0.00"
                placeholderTextColor={Colors.text.tertiary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>目标日期（可选）</Text>
            <TouchableOpacity style={styles.dateSelector}>
              <Text style={deadline ? styles.dateText : styles.datePlaceholder}>
                {deadline || '选择截止日期'}
              </Text>
              <Text style={styles.dateArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 图标选择 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>选择图标</Text>
          <View style={styles.iconGrid}>
            {ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconItem,
                  selectedIcon === icon && { backgroundColor: bookColor + '20', borderColor: bookColor },
                ]}
                onPress={() => setSelectedIcon(icon)}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* 颜色选择 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>选择颜色</Text>
          <View style={styles.colorGrid}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorItem,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorItemSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <Text style={styles.colorCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* 备注 */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>备注（可选）</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="添加备注..."
            placeholderTextColor={Colors.text.tertiary}
            multiline
            numberOfLines={3}
          />
        </Card>

        {/* 预览 */}
        <Card style={styles.previewCard}>
          <View style={[styles.previewIndicator, { backgroundColor: selectedColor }]} />
          <View style={styles.previewContent}>
            <View style={[styles.previewIcon, { backgroundColor: selectedColor }]}>
              <Text style={styles.previewIconText}>{selectedIcon}</Text>
            </View>
            <View style={styles.previewInfo}>
              <Text style={styles.previewName}>{name || '目标名称'}</Text>
              <Text style={styles.previewAmount}>
                目标: ¥{targetAmount ? parseFloat(targetAmount).toLocaleString() : '0.00'}
              </Text>
            </View>
          </View>
        </Card>

        {/* 保存按钮 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient
            colors={Gradients.primary as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveGradient}
          >
            <Text style={styles.saveText}>创建目标</Text>
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
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  dateText: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  datePlaceholder: {
    fontSize: FontSize.base,
    color: Colors.text.tertiary,
  },
  dateArrow: {
    fontSize: 20,
    color: Colors.text.tertiary,
  },
  // 图标选择
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  iconItem: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray[50],
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconText: {
    fontSize: 24,
  },
  // 颜色选择
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorItemSelected: {
    borderWidth: 3,
    borderColor: Colors.text.inverse,
    ...Shadows.md,
  },
  colorCheck: {
    fontSize: 18,
    color: Colors.text.inverse,
    fontWeight: FontWeight.bold,
  },
  // 备注
  noteInput: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.base,
    color: Colors.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  // 预览
  previewCard: {
    marginBottom: Spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  previewIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.sm,
  },
  previewIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  previewIconText: {
    fontSize: 24,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  previewAmount: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  // 保存按钮
  saveButton: {
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

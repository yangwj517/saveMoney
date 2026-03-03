/**
 * 攒钱记账 - 收支分类管理页
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows } from '@/constants/layout';
import { Card, AlertModal } from '@/components/ui';
import { AccountBookType, TransactionType } from '@/types';
import * as categoryService from '@/services/category';
import { getDefaultCategories } from '@/constants/defaultCategories';

// 可选颜色
const COLOR_OPTIONS = [
  '#FF9800', '#2196F3', '#E91E63', '#9C27B0', '#4CAF50',
  '#F44336', '#00BCD4', '#795548', '#FFC107', '#3F51B5',
  '#607D8B', '#8D6E63', '#009688', '#EC407A', '#9E9E9E',
];

// 可选图标
const ICON_OPTIONS = [
  '🍜', '🚗', '🛒', '🎮', '🏠', '💡', '📱', '💊', '📚', '🎁',
  '👔', '💄', '⚽', '🐱', '📝', '💰', '🎉', '📈', '💼', '🧧',
  '💵', '🏢', '🖨️', '📢', '✈️', '🍽️', '💻', '🔧', '📋', '🛡️',
  '📦', '🏛️', '↩️',
];

// 分类项组件
const CategoryItem: React.FC<{
  category: any;
  bookColor: string;
  onPress: () => void;
}> = ({ category, bookColor, onPress }) => (
  <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
    <View style={[styles.categoryIcon, { backgroundColor: category.color || bookColor }]}>
      <Text style={styles.categoryIconText}>{category.icon || category.name.charAt(0)}</Text>
    </View>
    <Text style={styles.categoryName}>{category.name}</Text>
    <Text style={styles.categoryArrow}>›</Text>
  </TouchableOpacity>
);

export default function CategoriesPage() {
  const [activeBook, setActiveBook] = useState<AccountBookType>('personal');
  const [activeType, setActiveType] = useState<TransactionType>('expense');
  const [categories, setCategories] = useState<any[]>([]);

  // 编辑弹框状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [editColor, setEditColor] = useState('');
  const [saving, setSaving] = useState(false);

  // 弹框状态
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error' | 'warning'>('info');
  const [alertCallback, setAlertCallback] = useState<(() => void) | null>(null);

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

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryService.getCategories(activeBook, activeType);
      setCategories(data || []);
    } catch {
      // 使用默认分类
      setCategories(getDefaultCategories(activeBook, activeType));
    }
  }, [activeBook, activeType]);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [fetchCategories])
  );

  const bookColor = activeBook === 'personal' ? Colors.personal : Colors.business;

  const handleCategoryPress = (category: any) => {
    // 判断是否是预设分类（id以 p_ 或 b_ 开头）
    const isPreset = category.id?.startsWith('p_') || category.id?.startsWith('b_');
    if (isPreset) {
      showAlert('提示', '预设分类不支持编辑，如需自定义请添加新分类', 'info');
      return;
    }
    setEditingCategory(category);
    setEditName(category.name);
    setEditIcon(category.icon || '');
    setEditColor(category.color || bookColor);
    setEditModalVisible(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setEditName('');
    setEditIcon('📝');
    setEditColor(bookColor);
    setEditModalVisible(true);
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      showAlert('提示', '请输入分类名称', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        // 更新分类
        await categoryService.updateCategory(editingCategory.id, {
          name: editName,
          icon: editIcon,
          color: editColor,
        });
        showAlert('保存成功', '分类已更新', 'success');
      } else {
        // 创建分类
        await categoryService.createCategory({
          name: editName,
          icon: editIcon,
          color: editColor,
          type: activeType,
          bookType: activeBook,
        });
        showAlert('添加成功', '新分类已添加', 'success');
      }
      setEditModalVisible(false);
      fetchCategories();
    } catch (e: any) {
      showAlert('保存失败', e.message || '请稍后重试', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingCategory) return;
    
    setSaving(true);
    try {
      await categoryService.deleteCategory(editingCategory.id);
      showAlert('删除成功', '分类已删除', 'success');
      setEditModalVisible(false);
      fetchCategories();
    } catch (e: any) {
      showAlert('删除失败', e.message || '请稍后重试', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>收支分类</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
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

      {/* 收支类型切换 */}
      <View style={styles.typeTabs}>
        <TouchableOpacity
          style={[styles.typeTab, activeType === 'expense' && styles.typeTabActive]}
          onPress={() => setActiveType('expense')}
        >
          <Text style={[styles.typeTabText, activeType === 'expense' && { color: Colors.expense }]}>
            支出
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeTab, activeType === 'income' && styles.typeTabActive]}
          onPress={() => setActiveType('income')}
        >
          <Text style={[styles.typeTabText, activeType === 'income' && { color: Colors.income }]}>
            收入
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 分类列表 */}
        <Card style={styles.categoryList}>
          {categories.map((category, index) => (
            <View key={category.id}>
              {index > 0 && <View style={styles.divider} />}
              <CategoryItem
                category={category}
                bookColor={bookColor}
                onPress={() => handleCategoryPress(category)}
              />
            </View>
          ))}
        </Card>

        {/* 添加按钮 */}
        <TouchableOpacity style={styles.addCategoryButton} onPress={handleAddCategory}>
          <Text style={[styles.addCategoryIcon, { color: bookColor }]}>+</Text>
          <Text style={[styles.addCategoryText, { color: bookColor }]}>添加新分类</Text>
        </TouchableOpacity>

        {/* 提示 */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 说明</Text>
          <Text style={styles.tipsText}>
            • 预设分类不支持编辑和删除{'\n'}
            • 点击分类可以编辑自定义分类{'\n'}
            • 删除分类不会影响已有的账单记录
          </Text>
        </View>
      </ScrollView>

      {/* 编辑弹框 */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {editingCategory ? '编辑分类' : '添加分类'}
            </Text>

            {/* 分类名称 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>分类名称</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="请输入分类名称"
                placeholderTextColor={Colors.text.tertiary}
              />
            </View>

            {/* 选择图标 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>选择图标</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.iconGrid}>
                  {ICON_OPTIONS.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconOption,
                        editIcon === icon && { backgroundColor: bookColor + '20', borderColor: bookColor },
                      ]}
                      onPress={() => setEditIcon(icon)}
                    >
                      <Text style={styles.iconOptionText}>{icon}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* 选择颜色 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>选择颜色</Text>
              <View style={styles.colorGrid}>
                {COLOR_OPTIONS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      editColor === color && styles.colorOptionSelected,
                    ]}
                    onPress={() => setEditColor(color)}
                  >
                    {editColor === color && <Text style={styles.colorCheck}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 预览 */}
            <View style={styles.preview}>
              <Text style={styles.previewLabel}>预览：</Text>
              <View style={[styles.previewIcon, { backgroundColor: editColor }]}>
                <Text style={styles.previewIconText}>{editIcon || editName.charAt(0) || '?'}</Text>
              </View>
              <Text style={styles.previewName}>{editName || '分类名称'}</Text>
            </View>

            {/* 按钮 */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              {editingCategory && (
                <TouchableOpacity
                  style={styles.deleteButtonModal}
                  onPress={handleDelete}
                  disabled={saving}
                >
                  <Text style={styles.deleteButtonModalText}>删除</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.saveButtonModal, saving && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                <LinearGradient
                  colors={Gradients.primary as [string, string]}
                  style={styles.saveGradient}
                >
                  <Text style={styles.saveButtonModalText}>
                    {saving ? '保存中...' : '保存'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    marginBottom: Spacing.sm,
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
  // 收支类型切换
  typeTabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  typeTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray[50],
    alignItems: 'center',
  },
  typeTabActive: {
    backgroundColor: Colors.card,
    ...Shadows.sm,
  },
  typeTabText: {
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
  // 分类列表
  categoryList: {
    marginBottom: Spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  categoryIconText: {
    fontSize: 18,
  },
  categoryName: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  categoryArrow: {
    fontSize: 20,
    color: Colors.text.tertiary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 56,
  },
  // 添加按钮
  addCategoryButton: {
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
  addCategoryIcon: {
    fontSize: 20,
  },
  addCategoryText: {
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
  // 弹框
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.gray[300],
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
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
  // 图标选择
  iconGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOptionText: {
    fontSize: 20,
  },
  // 颜色选择
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  colorCheck: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: FontWeight.bold,
  },
  // 预览
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  previewLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginRight: Spacing.md,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  previewIconText: {
    fontSize: 18,
  },
  previewName: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
    fontWeight: FontWeight.medium,
  },
  // 按钮
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSize.base,
    color: Colors.text.secondary,
    fontWeight: FontWeight.medium,
  },
  deleteButtonModal: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.error,
    alignItems: 'center',
  },
  deleteButtonModalText: {
    fontSize: FontSize.base,
    color: Colors.error,
    fontWeight: FontWeight.medium,
  },
  saveButtonModal: {
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveGradient: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveButtonModalText: {
    fontSize: FontSize.base,
    color: Colors.text.inverse,
    fontWeight: FontWeight.semibold,
  },
});

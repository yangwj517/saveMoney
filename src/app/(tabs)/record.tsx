/**
 * 攒钱记账 - 记账页
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';
import { Typography, FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows, Sizes } from '@/constants/layout';
import { Button, Card } from '@/components/ui';
import { AccountBookType, TransactionType } from '@/types';
import { getCategoriesByBookAndType } from '@/mocks';

const { width } = Dimensions.get('window');

// 自定义数字键盘
const NumericKeyboard: React.FC<{
  onInput: (value: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onConfirm: () => void;
}> = ({ onInput, onDelete, onClear, onConfirm }) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'del'],
  ];
  
  return (
    <View style={styles.keyboard}>
      <View style={styles.keyboardMain}>
        {keys.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyboardRow}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.keyboardKey,
                  key === 'del' && styles.keyboardKeyDelete,
                ]}
                onPress={() => {
                  if (key === 'del') {
                    onDelete();
                  } else {
                    onInput(key);
                  }
                }}
                onLongPress={() => {
                  if (key === 'del') {
                    onClear();
                  }
                }}
              >
                <Text style={[
                  styles.keyboardKeyText,
                  key === 'del' && styles.keyboardKeyTextDelete,
                ]}>
                  {key === 'del' ? '⌫' : key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.keyboardRight}>
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearText}>清空</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <LinearGradient
            colors={Gradients.primary as [string, string]}
            style={styles.confirmGradient}
          >
            <Text style={styles.confirmText}>完成</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function RecordPage() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  const [bookType, setBookType] = useState<AccountBookType>('personal');
  const [transactionType, setTransactionType] = useState<TransactionType>(
    type === 'income' ? 'income' : 'expense'
  );
  const [amount, setAmount] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isNoteFocused, setIsNoteFocused] = useState(false);

  const categories = getCategoriesByBookAndType(bookType, transactionType);
  const bookColor = bookType === 'personal' ? Colors.personal : Colors.business;

  const handleInput = (value: string) => {
    if (amount === '0' && value !== '.') {
      setAmount(value);
    } else if (value === '.' && amount.includes('.')) {
      return;
    } else if (amount.includes('.') && amount.split('.')[1]?.length >= 2) {
      return;
    } else {
      setAmount(amount + value);
    }
  };

  const handleDelete = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount('0');
    }
  };

  const handleClear = () => {
    setAmount('0');
  };

  const handleConfirm = () => {
    // 保存记录逻辑
    console.log('Save record:', { bookType, transactionType, amount, selectedCategory, note });
    // 重置表单
    setAmount('0');
    setSelectedCategory(null);
    setNote('');
    // 跳转到首页
    router.push('/(tabs)');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setIsNoteFocused(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部标题 */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>记一笔</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 账本选择 */}
        <View style={styles.bookSelector}>
          <TouchableOpacity
            style={[
              styles.bookOption,
              bookType === 'personal' && styles.bookOptionActivePersonal,
            ]}
            onPress={() => setBookType('personal')}
          >
            <Text
              style={[
                styles.bookOptionText,
                bookType === 'personal' && styles.bookOptionTextActivePersonal,
              ]}
            >
              个人
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bookOption,
              bookType === 'business' && styles.bookOptionActiveBusiness,
            ]}
            onPress={() => setBookType('business')}
          >
            <Text
              style={[
                styles.bookOptionText,
                bookType === 'business' && styles.bookOptionTextActiveBusiness,
              ]}
            >
              公司
            </Text>
          </TouchableOpacity>
        </View>

        {/* 收支切换 */}
        <View style={styles.transactionTypeSelector}>
          <TouchableOpacity
            style={[
              styles.transactionTypeOption,
              transactionType === 'expense' && styles.transactionTypeOptionActive,
            ]}
            onPress={() => setTransactionType('expense')}
          >
            <Text
              style={[
                styles.transactionTypeText,
                transactionType === 'expense' && { color: Colors.expense },
              ]}
            >
              支出
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.transactionTypeOption,
              transactionType === 'income' && styles.transactionTypeOptionActive,
            ]}
            onPress={() => setTransactionType('income')}
          >
            <Text
              style={[
                styles.transactionTypeText,
                transactionType === 'income' && { color: Colors.income },
              ]}
            >
              收入
            </Text>
          </TouchableOpacity>
        </View>

        {/* 金额显示 */}
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>¥</Text>
          <Text style={[styles.amountText, { color: transactionType === 'expense' ? Colors.expense : Colors.income }]}>
            {amount}
          </Text>
        </View>

        {/* 分类选择 */}
        <Text style={styles.sectionLabel}>选择分类</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id && {
                    backgroundColor: bookType === 'personal' ? Colors.personalLight : Colors.businessLight,
                  },
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Text style={styles.categoryIconText}>{category.name.charAt(0)}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* 备注 */}
        <View style={styles.noteContainer}>
          <TextInput
            style={[styles.noteInput, isNoteFocused && styles.noteInputFocused]}
            placeholder="添加备注..."
            placeholderTextColor={Colors.text.tertiary}
            value={note}
            onChangeText={setNote}
            onFocus={() => setIsNoteFocused(true)}
            onBlur={() => setIsNoteFocused(false)}
            multiline
          />
          {isNoteFocused && (
            <TouchableOpacity style={styles.noteDoneButton} onPress={dismissKeyboard}>
              <Text style={styles.noteDoneText}>完成</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 日期和账户信息 */}
        <View style={styles.infoRow}>
          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoLabel}>日期</Text>
            <Text style={styles.infoValue}>今天</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoLabel}>账户</Text>
            <Text style={styles.infoValue}>{bookType === 'personal' ? '现金' : '备用金'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 数字键盘 - 备注输入时隐藏 */}
      {!isNoteFocused && (
        <NumericKeyboard
          onInput={handleInput}
          onDelete={handleDelete}
          onClear={handleClear}
          onConfirm={handleConfirm}
        />
      )}
    </SafeAreaView>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const styles: any = StyleSheet.create({
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
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.base,
  },
  // 账本选择
  bookSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  bookOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray[100],
  },
  bookOptionActivePersonal: {
    backgroundColor: Colors.personalLight,
  },
  bookOptionActiveBusiness: {
    backgroundColor: Colors.businessLight,
  },
  bookOptionText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    fontWeight: FontWeight.medium,
  },
  bookOptionTextActivePersonal: {
    color: Colors.personal,
  },
  bookOptionTextActiveBusiness: {
    color: Colors.business,
  },
  // 收支切换
  transactionTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  transactionTypeOption: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  transactionTypeOptionActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary.default,
  },
  transactionTypeText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    fontWeight: FontWeight.medium,
  },
  // 金额
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  currencySymbol: {
    fontSize: FontSize['2xl'],
    color: Colors.text.secondary,
    marginRight: Spacing.xs,
    marginBottom: 4,
  },
  amountText: {
    fontSize: 48,
    fontWeight: FontWeight.bold,
  },
  // 分类
  sectionLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  categoryScroll: {
    marginBottom: Spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    width: 70,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  categoryIconText: {
    fontSize: FontSize.md,
    color: Colors.text.inverse,
    fontWeight: FontWeight.semibold,
  },
  categoryName: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  // 备注
  noteContainer: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    minHeight: 60,
  },
  noteInput: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  noteInputFocused: {
    minHeight: 80,
  },
  noteDoneButton: {
    alignSelf: 'flex-end',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  noteDoneText: {
    fontSize: FontSize.sm,
    color: Colors.primary.default,
    fontWeight: FontWeight.medium,
  },
  // 信息行
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  infoItem: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  infoValue: {
    fontSize: FontSize.sm,
    color: Colors.text.primary,
    fontWeight: FontWeight.medium,
  },
  // 键盘
  keyboard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    paddingTop: Spacing.sm,
    paddingBottom: Sizes.tabBar + 20, // 预留底部 Tab 栏空间
    paddingHorizontal: Spacing.sm,
    ...Shadows.lg,
  },
  keyboardMain: {
    flex: 3,
  },
  keyboardRow: {
    flexDirection: 'row',
  },
  keyboardKey: {
    flex: 1,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
  },
  keyboardKeyDelete: {
    backgroundColor: Colors.gray[100],
  },
  keyboardKeyText: {
    fontSize: FontSize['2xl'],
    color: Colors.text.primary,
    fontWeight: FontWeight.medium,
  },
  keyboardKeyTextDelete: {
    color: Colors.expense,
  },
  keyboardRight: {
    width: 80,
    marginLeft: Spacing.sm,
  },
  clearButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  clearText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  confirmButton: {
    flex: 1,
  },
  confirmGradient: {
    flex: 1,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: FontSize.md,
    color: Colors.text.inverse,
    fontWeight: FontWeight.semibold,
  },
});

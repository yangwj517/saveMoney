/**
 * 攒钱记账 - 记录列表页（全部记录）
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows, Sizes } from '@/constants/layout';
import { Card } from '@/components/ui';
import { AccountBookType } from '@/types';
import * as recordService from '@/services/record';

type BookFilter = 'personal' | 'business';

// 格式化金额
const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 });
};

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

export default function RecordsPage() {
  const params = useLocalSearchParams<{ bookType?: string }>();
  const initialBookType = (params.bookType as BookFilter) || 'personal';
  
  const [bookFilter, setBookFilter] = useState<BookFilter>(initialBookType);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 15; // 每页显示15条

  // 获取记录
  const fetchRecords = useCallback(async (pageNum: number, filter: BookFilter, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await recordService.getRecords({ bookType: filter, page: pageNum, pageSize });
      // 处理后端返回数据格式
      // 后端返回: { list: [], pagination: { total, totalPages, hasNext, ... } }
      const recordsList = Array.isArray(data) ? data : (data?.list || []);
      const pagination = data?.pagination;
      const recordsTotal = pagination?.total || (Array.isArray(data) ? data.length : recordsList.length);
      const pages = pagination?.totalPages || Math.ceil(recordsTotal / pageSize) || 1;
      
      setRecords(recordsList);
      setTotal(recordsTotal);
      setTotalPages(pages);
    } catch (e) {
      console.log('Fetch records error:', e);
      setRecords([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords(page, bookFilter);
  }, [page, bookFilter, fetchRecords]);

  // 切换账本筛选
  const handleFilterChange = (filter: BookFilter) => {
    setBookFilter(filter);
    setPage(1);
    setTotal(0); // 重置总数，等待新数据加载
    setRecords([]); // 清空旧记录
  };

  // 刷新
  const handleRefresh = () => {
    fetchRecords(page, bookFilter, true);
  };

  // 跳转到指定页
  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    }
  };

  // 渲染记录项
  const renderRecordItem = ({ item: record }: { item: any }) => {
    const isExpense = record.type === 'expense';
    const bookColor = record.bookType === 'personal' ? Colors.personal : Colors.business;

    return (
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
            {formatDate(record.date || record.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  // 分页按钮
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
          onPress={() => goToPage(page - 1)}
          disabled={page === 1}
        >
          <Text style={[styles.pageButtonText, page === 1 && styles.pageButtonTextDisabled]}>上一页</Text>
        </TouchableOpacity>

        {startPage > 1 && (
          <>
            <TouchableOpacity style={styles.pageNumber} onPress={() => goToPage(1)}>
              <Text style={styles.pageNumberText}>1</Text>
            </TouchableOpacity>
            {startPage > 2 && <Text style={styles.pageEllipsis}>...</Text>}
          </>
        )}

        {pages.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.pageNumber, p === page && styles.pageNumberActive]}
            onPress={() => goToPage(p)}
          >
            <Text style={[styles.pageNumberText, p === page && styles.pageNumberTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <Text style={styles.pageEllipsis}>...</Text>}
            <TouchableOpacity style={styles.pageNumber} onPress={() => goToPage(totalPages)}>
              <Text style={styles.pageNumberText}>{totalPages}</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={[styles.pageButton, page === totalPages && styles.pageButtonDisabled]}
          onPress={() => goToPage(page + 1)}
          disabled={page === totalPages}
        >
          <Text style={[styles.pageButtonText, page === totalPages && styles.pageButtonTextDisabled]}>下一页</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>‹ 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>全部记录</Text>
        <View style={styles.headerRight} />
      </View>

      {/* 账本筛选 */}
      <View style={styles.filterContainer}>
        {(['personal', 'business'] as BookFilter[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterItem,
              bookFilter === filter && styles.filterItemActive,
            ]}
            onPress={() => handleFilterChange(filter)}
          >
            <Text
              style={[
                styles.filterText,
                bookFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter === 'personal' ? '个人' : '公司'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 统计信息 */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {loading ? '加载中...' : `共 ${total} 条记录`}
        </Text>
      </View>

      {/* 记录列表 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.default} />
        </View>
      ) : records.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyText}>暂无记录</Text>
          <Text style={styles.emptySubtext}>快去记一笔吧</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={records}
            keyExtractor={(item) => item.id}
            renderItem={renderRecordItem}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.recordDivider} />}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
          {renderPagination()}
        </>
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
    padding: Spacing.xs,
  },
  backText: {
    fontSize: FontSize.md,
    color: Colors.primary.default,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  headerRight: {
    width: 60,
  },
  // 筛选
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray[100],
  },
  filterItemActive: {
    backgroundColor: Colors.primary.default,
  },
  filterText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  filterTextActive: {
    color: Colors.text.inverse,
    fontWeight: FontWeight.medium,
  },
  // 统计
  statsContainer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  statsText: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
  // 列表
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    ...Shadows.sm,
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
    height: Spacing.xs,
  },
  // 加载
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 空状态
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.lg,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },
  // 分页
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  pageButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray[100],
  },
  pageButtonDisabled: {
    backgroundColor: Colors.gray[50],
  },
  pageButtonText: {
    fontSize: FontSize.sm,
    color: Colors.text.primary,
  },
  pageButtonTextDisabled: {
    color: Colors.text.tertiary,
  },
  pageNumber: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumberActive: {
    backgroundColor: Colors.primary.default,
  },
  pageNumberText: {
    fontSize: FontSize.sm,
    color: Colors.text.primary,
  },
  pageNumberTextActive: {
    color: Colors.text.inverse,
    fontWeight: FontWeight.medium,
  },
  pageEllipsis: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    paddingHorizontal: Spacing.xs,
  },
});

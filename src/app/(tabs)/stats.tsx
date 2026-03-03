/**
 * 攒钱记账 - 统计页
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows, Sizes } from '@/constants/layout';
import { Card } from '@/components/ui';
import { AccountBookType } from '@/types';
import * as statisticsService from '@/services/statistics';

const { width } = Dimensions.get('window');

type TimeFilter = 'week' | 'month' | 'year';
type BookFilter = 'all' | 'personal' | 'business';

// Helper to get date range
const getDateRange = (filter: TimeFilter) => {
  const now = new Date();
  let startDate: Date;
  const endDate = now;
  switch (filter) {
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
  }
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  return { startDate: fmt(startDate), endDate: fmt(endDate) };
};

// 简单饼图组件
const SimplePieChart: React.FC<{ data: any[] }> = ({ data }) => {
  let currentAngle = 0;
  const total = data.reduce((s: number, i: any) => s + (i.amount || 0), 0);

  return (
    <View style={styles.pieChartContainer}>
      <View style={styles.pieChart}>
        {data.map((item: any, index: number) => {
          const angle = ((item.percentage || 0) / 100) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;
          
          return (
            <View
              key={item.id || index}
              style={[
                styles.pieSlice,
                {
                  backgroundColor: item.color,
                  transform: [{ rotate: `${startAngle}deg` }],
                },
              ]}
            />
          );
        })}
        <View style={styles.pieCenter}>
          <Text style={styles.pieCenterAmount}>¥{total.toLocaleString('zh-CN', { minimumFractionDigits: 0 })}</Text>
          <Text style={styles.pieCenterLabel}>总支出</Text>
        </View>
      </View>
      
      {/* 图例 */}
      <View style={styles.legend}>
        {data.map((item: any, index: number) => (
          <View key={item.id || index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.name}</Text>
            <Text style={styles.legendPercent}>{item.percentage || 0}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// 简单柱状图组件
const SimpleBarChart: React.FC<{ timeFilter: TimeFilter; dailyStats: any[] }> = ({ timeFilter, dailyStats }) => {
  // 根据时间维度聚合数据
  const getChartData = () => {
    if (!dailyStats || dailyStats.length === 0) {
      return [];
    }

    switch (timeFilter) {
      case 'week': {
        // 周视图：直接使用每日数据，显示星期几
        const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return dailyStats.slice(-7).map((item) => {
          const date = new Date(item.date);
          return {
            label: weekDays[date.getDay()],
            expense: Number(item.expense) || 0,
            income: Number(item.income) || 0,
          };
        });
      }
      case 'month': {
        // 月视图：按周聚合数据
        const weeklyData: { [key: string]: { expense: number; income: number } } = {};
        dailyStats.forEach((item) => {
          const date = new Date(item.date);
          const weekNum = Math.ceil(date.getDate() / 7);
          const key = `第${weekNum}周`;
          if (!weeklyData[key]) {
            weeklyData[key] = { expense: 0, income: 0 };
          }
          weeklyData[key].expense += Number(item.expense) || 0;
          weeklyData[key].income += Number(item.income) || 0;
        });
        return Object.entries(weeklyData).map(([label, data]) => ({
          label,
          ...data,
        }));
      }
      case 'year': {
        // 年视图：按月聚合数据
        const monthlyData: { [key: number]: { expense: number; income: number } } = {};
        dailyStats.forEach((item) => {
          const date = new Date(item.date);
          const month = date.getMonth() + 1;
          if (!monthlyData[month]) {
            monthlyData[month] = { expense: 0, income: 0 };
          }
          monthlyData[month].expense += Number(item.expense) || 0;
          monthlyData[month].income += Number(item.income) || 0;
        });
        return Object.entries(monthlyData)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([month, data]) => ({
            label: `${month}月`,
            ...data,
          }));
      }
    }
  };

  const getChartTitle = () => {
    switch (timeFilter) {
      case 'week': return '每日收支对比';
      case 'month': return '每周收支对比';
      case 'year': return '每月收支对比';
    }
  };

  const data = getChartData();
  
  if (data.length === 0) {
    return (
      <View style={styles.barChartContainer}>
        <Text style={styles.emptyText}>暂无数据</Text>
      </View>
    );
  }
  
  const maxValue = Math.max(...data.map(d => Math.max(d.expense, d.income)), 1);
  
  return (
    <View style={styles.barChartContainer}>
      <View style={[styles.barChartContent, timeFilter === 'year' && styles.barChartContentYear]}>
        {data.map((item, index) => (
          <View key={index} style={styles.barGroup}>
            <View style={styles.barsContainer}>
              <View
                style={[
                  styles.bar,
                  styles.expenseBar,
                  { height: (item.expense / maxValue) * 100 || 2 },
                ]}
              />
              {item.income > 0 && (
                <View
                  style={[
                    styles.bar,
                    styles.incomeBar,
                    { height: (item.income / maxValue) * 100 },
                  ]}
                />
              )}
            </View>
            <Text style={[styles.barLabel, timeFilter === 'year' && styles.barLabelYear]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
      
      {/* 图例 */}
      <View style={styles.barLegend}>
        <View style={styles.barLegendItem}>
          <View style={[styles.barLegendDot, { backgroundColor: Colors.expense }]} />
          <Text style={styles.barLegendText}>支出</Text>
        </View>
        <View style={styles.barLegendItem}>
          <View style={[styles.barLegendDot, { backgroundColor: Colors.income }]} />
          <Text style={styles.barLegendText}>收入</Text>
        </View>
      </View>
    </View>
  );
};

export default function StatsPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const [bookFilter, setBookFilter] = useState<BookFilter>('all');
  const [statsData, setStatsData] = useState<any>(null);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const fetchStats = useCallback(async () => {
    try {
      const { startDate, endDate } = getDateRange(timeFilter);
      const bt = bookFilter === 'all' ? 'personal' : bookFilter;
      const data = await statisticsService.getStatistics(bt, startDate, endDate);
      setStatsData(data);
      setTotalExpense(data?.totalExpense || 0);
      setTotalIncome(data?.totalIncome || 0);
      setCategoryStats(data?.categoryStats || []);
      setDailyStats(data?.dailyStats || []);
    } catch (e) {
      console.log('Stats fetch error:', e);
    }
  }, [timeFilter, bookFilter]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>统计</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 账本筛选 */}
        <View style={styles.bookFilter}>
          {(['all', 'personal', 'business'] as BookFilter[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.bookFilterItem,
                bookFilter === filter && styles.bookFilterItemActive,
              ]}
              onPress={() => setBookFilter(filter)}
            >
              <Text
                style={[
                  styles.bookFilterText,
                  bookFilter === filter && styles.bookFilterTextActive,
                ]}
              >
                {filter === 'all' ? '全部' : filter === 'personal' ? '个人' : '公司'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 时间筛选 */}
        <View style={styles.timeFilter}>
          {(['week', 'month', 'year'] as TimeFilter[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.timeFilterItem,
                timeFilter === filter && styles.timeFilterItemActive,
              ]}
              onPress={() => setTimeFilter(filter)}
            >
              <Text
                style={[
                  styles.timeFilterText,
                  timeFilter === filter && styles.timeFilterTextActive,
                ]}
              >
                {filter === 'week' ? '周' : filter === 'month' ? '月' : '年'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 总览卡片 */}
        <View style={styles.overviewCards}>
          <Card style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>总支出</Text>
            <Text style={[styles.overviewAmount, { color: Colors.expense }]}>
              ¥{totalExpense.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </Text>
          </Card>
          <Card style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>总收入</Text>
            <Text style={[styles.overviewAmount, { color: Colors.income }]}>
              ¥{totalIncome.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </Text>
          </Card>
        </View>

        {/* 饼图 */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>支出分类占比</Text>
          <SimplePieChart data={categoryStats.map((s: any, i: number) => ({
            id: s.categoryId || String(i),
            name: s.category?.name || '未分类',
            amount: s.amount || 0,
            percentage: s.percentage || 0,
            color: s.category?.color || '#6B7280',
          }))} />
        </Card>

        {/* 柱状图 */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            {timeFilter === 'week' ? '每日收支对比' : timeFilter === 'month' ? '每周收支对比' : '每月收支对比'}
          </Text>
          <SimpleBarChart timeFilter={timeFilter} dailyStats={dailyStats} />
        </Card>

        {/* 分类明细 */}
        <Card style={styles.detailCard}>
          <Text style={styles.chartTitle}>分类支出</Text>
          {categoryStats.map((item: any, index: number) => (
            <View key={item.categoryId || index} style={styles.detailItem}>
              <View style={styles.detailLeft}>
                <View style={[styles.detailDot, { backgroundColor: item.category?.color || '#6B7280' }]} />
                <Text style={styles.detailName}>{item.category?.name || '未分类'}</Text>
              </View>
              <View style={styles.detailRight}>
                <Text style={styles.detailAmount}>¥{(item.amount || 0).toFixed(2)}</Text>
                <View style={styles.detailProgressBar}>
                  <View
                    style={[
                      styles.detailProgress,
                      { width: `${item.percentage || 0}%`, backgroundColor: item.category?.color || '#6B7280' },
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </Card>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  calendarButton: {
    padding: Spacing.sm,
  },
  calendarIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
  },
  // 账本筛选
  bookFilter: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  bookFilterItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray[100],
  },
  bookFilterItemActive: {
    backgroundColor: Colors.primary.default,
  },
  bookFilterText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  bookFilterTextActive: {
    color: Colors.text.inverse,
    fontWeight: FontWeight.medium,
  },
  // 时间筛选
  timeFilter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.xl,
  },
  timeFilterItem: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  timeFilterItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary.default,
  },
  timeFilterText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
  },
  timeFilterTextActive: {
    color: Colors.primary.default,
    fontWeight: FontWeight.semibold,
  },
  // 总览卡片
  overviewCards: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  overviewCard: {
    flex: 1,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  overviewAmount: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  // 图表卡片
  chartCard: {
    marginBottom: Spacing.lg,
  },
  chartTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  // 饼图
  pieChartContainer: {
    alignItems: 'center',
  },
  pieChart: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  pieSlice: {
    position: 'absolute',
    width: 80,
    height: 160,
    left: 80,
    transformOrigin: 'left center',
  },
  pieCenter: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.card,
    top: 40,
    left: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterAmount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  pieCenterLabel: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
  },
  legendPercent: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
  // 柱状图
  barChartContainer: {
    paddingTop: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  barChartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: Spacing.md,
  },
  barChartContentYear: {
    flexWrap: 'wrap',
    height: 'auto',
    gap: Spacing.xs,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginBottom: Spacing.xs,
  },
  bar: {
    width: 12,
    borderRadius: 2,
    minHeight: 2,
  },
  expenseBar: {
    backgroundColor: Colors.expense,
  },
  incomeBar: {
    backgroundColor: Colors.income,
  },
  barLabel: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
  barLabelYear: {
    fontSize: 10,
  },
  barLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  barLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  barLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  barLegendText: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
  },
  // 分类明细
  detailCard: {
    marginBottom: Spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  detailName: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  detailRight: {
    flex: 1,
    marginLeft: Spacing.lg,
    alignItems: 'flex-end',
  },
  detailAmount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  detailProgressBar: {
    width: 100,
    height: 4,
    backgroundColor: Colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  detailProgress: {
    height: '100%',
    borderRadius: 2,
  },
  // 底部留白
  bottomSpacer: {
    height: Sizes.tabBar + 40,
  },
});

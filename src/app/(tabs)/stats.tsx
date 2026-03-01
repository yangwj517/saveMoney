/**
 * 攒钱记账 - 统计页
 */

import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

type TimeFilter = 'week' | 'month' | 'year';
type BookFilter = 'all' | 'personal' | 'business';

// 模拟统计数据
const mockCategoryStats = [
  { id: '1', name: '餐饮', amount: 1520, percentage: 35, color: '#FF6B6B' },
  { id: '2', name: '交通', amount: 680, percentage: 16, color: '#4ECDC4' },
  { id: '3', name: '购物', amount: 920, percentage: 21, color: '#9C6ADE' },
  { id: '4', name: '娱乐', amount: 450, percentage: 10, color: '#F7B731' },
  { id: '5', name: '其他', amount: 780, percentage: 18, color: '#6B7280' },
];

// 简单饼图组件
const SimplePieChart: React.FC<{ data: typeof mockCategoryStats }> = ({ data }) => {
  let currentAngle = 0;
  
  return (
    <View style={styles.pieChartContainer}>
      <View style={styles.pieChart}>
        {data.map((item, index) => {
          const angle = (item.percentage / 100) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;
          
          return (
            <View
              key={item.id}
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
          <Text style={styles.pieCenterAmount}>¥4,350</Text>
          <Text style={styles.pieCenterLabel}>总支出</Text>
        </View>
      </View>
      
      {/* 图例 */}
      <View style={styles.legend}>
        {data.map((item) => (
          <View key={item.id} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.name}</Text>
            <Text style={styles.legendPercent}>{item.percentage}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// 简单柱状图组件
const SimpleBarChart: React.FC<{ timeFilter: TimeFilter }> = ({ timeFilter }) => {
  // 根据时间维度生成不同的数据
  const getChartData = () => {
    switch (timeFilter) {
      case 'week':
        // 周视图：显示每日数据
        return [
          { label: '周一', expense: 120, income: 0 },
          { label: '周二', expense: 85, income: 320 },
          { label: '周三', expense: 200, income: 0 },
          { label: '周四', expense: 150, income: 0 },
          { label: '周五', expense: 180, income: 0 },
          { label: '周六', expense: 250, income: 0 },
          { label: '周日', expense: 95, income: 8500 },
        ];
      case 'month':
        // 月视图：显示每周数据
        return [
          { label: '第1周', expense: 850, income: 2000 },
          { label: '第2周', expense: 1200, income: 500 },
          { label: '第3周', expense: 980, income: 3500 },
          { label: '第4周', expense: 1320, income: 2820 },
        ];
      case 'year':
        // 年视图：显示每月数据
        return [
          { label: '1月', expense: 4200, income: 8500 },
          { label: '2月', expense: 3800, income: 8200 },
          { label: '3月', expense: 4500, income: 9000 },
          { label: '4月', expense: 4100, income: 8800 },
          { label: '5月', expense: 3900, income: 8500 },
          { label: '6月', expense: 4300, income: 9200 },
          { label: '7月', expense: 4600, income: 8900 },
          { label: '8月', expense: 4400, income: 9100 },
          { label: '9月', expense: 4200, income: 8700 },
          { label: '10月', expense: 4000, income: 8600 },
          { label: '11月', expense: 4350, income: 8820 },
          { label: '12月', expense: 4800, income: 9500 },
        ];
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
  const maxValue = Math.max(...data.map(d => Math.max(d.expense, d.income)));
  
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
            <Text style={styles.overviewLabel}>本月支出</Text>
            <Text style={[styles.overviewAmount, { color: Colors.expense }]}>
              ¥4,350.00
            </Text>
          </Card>
          <Card style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>本月收入</Text>
            <Text style={[styles.overviewAmount, { color: Colors.income }]}>
              ¥8,820.00
            </Text>
          </Card>
        </View>

        {/* 饼图 */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>支出分类占比</Text>
          <SimplePieChart data={mockCategoryStats} />
        </Card>

        {/* 柱状图 */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            {timeFilter === 'week' ? '每日收支对比' : timeFilter === 'month' ? '每周收支对比' : '每月收支对比'}
          </Text>
          <SimpleBarChart timeFilter={timeFilter} />
        </Card>

        {/* 分类明细 */}
        <Card style={styles.detailCard}>
          <Text style={styles.chartTitle}>分类支出</Text>
          {mockCategoryStats.map((item) => (
            <View key={item.id} style={styles.detailItem}>
              <View style={styles.detailLeft}>
                <View style={[styles.detailDot, { backgroundColor: item.color }]} />
                <Text style={styles.detailName}>{item.name}</Text>
              </View>
              <View style={styles.detailRight}>
                <Text style={styles.detailAmount}>¥{item.amount.toFixed(2)}</Text>
                <View style={styles.detailProgressBar}>
                  <View
                    style={[
                      styles.detailProgress,
                      { width: `${item.percentage}%`, backgroundColor: item.color },
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

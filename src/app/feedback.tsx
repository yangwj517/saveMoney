/**
 * 攒钱记账 - 帮助与反馈页
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows } from '@/constants/layout';
import { Card } from '@/components/ui';

// 常见问题数据
const faqList = [
  {
    id: '1',
    question: '如何添加新账户？',
    answer: '进入「个人中心」→「账户管理」，点击右上角的「+」按钮即可添加新账户。支持添加现金、银行卡、支付宝、微信等多种账户类型。',
  },
  {
    id: '2',
    question: '如何设置每月预算？',
    answer: '进入「个人中心」→「预算设置」，开启预算功能后，可以设置总预算和各分类预算。系统会自动追踪您的消费情况并在接近预算时提醒您。',
  },
  {
    id: '3',
    question: '如何切换个人/公司账本？',
    answer: '在首页顶部或记账页面顶部，点击账本切换按钮即可在个人账本和公司账本之间切换。两个账本的数据完全独立。',
  },
  {
    id: '4',
    question: '如何创建攒钱目标？',
    answer: '在首页点击「攒钱目标」区域的「查看全部」，进入目标列表后点击右上角「+」按钮即可创建新的攒钱目标。',
  },
  {
    id: '5',
    question: '数据会同步到云端吗？',
    answer: '是的，您的数据会自动同步到云端，确保数据安全。即使更换设备，登录账号后也能恢复所有数据。',
  },
  {
    id: '6',
    question: '如何修改或删除已记录的账单？',
    answer: '在首页的「最近账单」列表中，点击需要修改的账单即可进入编辑页面。左滑账单项可以删除该条记录。',
  },
];

// FAQ项组件
const FAQItem: React.FC<{
  faq: typeof faqList[0];
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ faq, isExpanded, onToggle }) => (
  <TouchableOpacity onPress={onToggle}>
    <Card style={styles.faqCard}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Text style={[styles.faqArrow, isExpanded && styles.faqArrowExpanded]}>
          ›
        </Text>
      </View>
      {isExpanded && (
        <Text style={styles.faqAnswer}>{faq.answer}</Text>
      )}
    </Card>
  </TouchableOpacity>
);

// 联系方式项组件
const ContactItem: React.FC<{
  icon: string;
  title: string;
  value: string;
  onPress?: () => void;
}> = ({ icon, title, value, onPress }) => (
  <TouchableOpacity style={styles.contactItem} onPress={onPress}>
    <Text style={styles.contactIcon}>{icon}</Text>
    <View style={styles.contactInfo}>
      <Text style={styles.contactTitle}>{title}</Text>
      <Text style={styles.contactValue}>{value}</Text>
    </View>
    <Text style={styles.contactArrow}>›</Text>
  </TouchableOpacity>
);

export default function FeedbackPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'suggestion' | 'other'>('suggestion');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const handleSubmitFeedback = () => {
    if (!feedbackContent.trim()) {
      console.log('Please enter feedback content');
      return;
    }
    console.log('Submit feedback:', { feedbackType, feedbackContent, contactInfo });
    // 重置表单
    setFeedbackContent('');
    setContactInfo('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>帮助与反馈</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 常见问题 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>常见问题</Text>
          {faqList.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isExpanded={expandedFAQ === faq.id}
              onToggle={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
            />
          ))}
        </View>

        {/* 意见反馈 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>意见反馈</Text>
          <Card style={styles.feedbackCard}>
            {/* 反馈类型 */}
            <Text style={styles.inputLabel}>反馈类型</Text>
            <View style={styles.typeSelector}>
              {[
                { key: 'bug', label: '🐛 问题反馈' },
                { key: 'suggestion', label: '💡 功能建议' },
                { key: 'other', label: '📝 其他' },
              ].map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.typeOption,
                    feedbackType === type.key && styles.typeOptionActive,
                  ]}
                  onPress={() => setFeedbackType(type.key as any)}
                >
                  <Text style={[
                    styles.typeText,
                    feedbackType === type.key && styles.typeTextActive,
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 反馈内容 */}
            <Text style={styles.inputLabel}>反馈内容</Text>
            <TextInput
              style={styles.feedbackInput}
              value={feedbackContent}
              onChangeText={setFeedbackContent}
              placeholder="请详细描述您遇到的问题或建议..."
              placeholderTextColor={Colors.text.tertiary}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            {/* 联系方式 */}
            <Text style={styles.inputLabel}>联系方式（可选）</Text>
            <TextInput
              style={styles.contactInput}
              value={contactInfo}
              onChangeText={setContactInfo}
              placeholder="邮箱或手机号，方便我们回复您"
              placeholderTextColor={Colors.text.tertiary}
            />

            {/* 提交按钮 */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback}>
              <LinearGradient
                colors={Gradients.primary as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                <Text style={styles.submitText}>提交反馈</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Card>
        </View>

        {/* 联系我们 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>联系我们</Text>
          <Card style={styles.contactCard} padding="none">
            <ContactItem
              icon="📧"
              title="客服邮箱"
              value="support@zanqian.com"
              onPress={() => console.log('Open email')}
            />
            <View style={styles.contactDivider} />
            <ContactItem
              icon="💬"
              title="在线客服"
              value="工作时间 9:00-18:00"
              onPress={() => console.log('Open chat')}
            />
            <View style={styles.contactDivider} />
            <ContactItem
              icon="📱"
              title="官方微信"
              value="zanqian_app"
              onPress={() => console.log('Copy wechat')}
            />
          </Card>
        </View>

        {/* 版本信息 */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>攒钱记账 v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 攒钱记账 All Rights Reserved</Text>
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
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.md,
  },
  // FAQ
  faqCard: {
    marginBottom: Spacing.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.text.primary,
    fontWeight: FontWeight.medium,
    marginRight: Spacing.md,
  },
  faqArrow: {
    fontSize: 20,
    color: Colors.text.tertiary,
    transform: [{ rotate: '90deg' }],
  },
  faqArrowExpanded: {
    transform: [{ rotate: '270deg' }],
  },
  faqAnswer: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 22,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  // 反馈表单
  feedbackCard: {
    paddingVertical: Spacing.lg,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  typeOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
  },
  typeOptionActive: {
    backgroundColor: Colors.primary.default + '15',
  },
  typeText: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
  },
  typeTextActive: {
    color: Colors.primary.default,
    fontWeight: FontWeight.medium,
  },
  feedbackInput: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.base,
    color: Colors.text.primary,
    minHeight: 120,
    marginBottom: Spacing.lg,
  },
  contactInput: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.base,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
  submitGradient: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  submitText: {
    fontSize: FontSize.base,
    color: Colors.text.inverse,
    fontWeight: FontWeight.semibold,
  },
  // 联系我们
  contactCard: {
    overflow: 'hidden',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: FontSize.base,
    color: Colors.text.primary,
    fontWeight: FontWeight.medium,
  },
  contactValue: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  contactArrow: {
    fontSize: 20,
    color: Colors.text.tertiary,
  },
  contactDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 48,
  },
  // 版本信息
  versionInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  versionText: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
  },
  copyrightText: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
});

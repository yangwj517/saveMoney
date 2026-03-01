/**
 * 攒钱记账 - Tab 导航布局
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { Sizes, Shadows } from '@/constants/layout';

// Tab 图标组件
const TabIcon: React.FC<{ 
  name: string; 
  focused: boolean;
  label: string;
}> = ({ name, focused, label }) => {
  const iconMap: Record<string, { outline: string; filled: string }> = {
    home: { outline: '🏠', filled: '🏡' },
    record: { outline: '✏️', filled: '📝' },
    stats: { outline: '📊', filled: '📈' },
    profile: { outline: '👤', filled: '👤' },
  };

  const icon = iconMap[name] || { outline: '•', filled: '•' };

  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
        {focused ? icon.filled : icon.outline}
      </Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
        {label}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary.default,
        tabBarInactiveTintColor: Colors.text.tertiary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} label="首页" />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: '记账',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="record" focused={focused} label="记账" />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '统计',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="stats" focused={focused} label="统计" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="profile" focused={focused} label="我的" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: Sizes.tabBar + (Platform.OS === 'ios' ? 20 : 0),
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    backgroundColor: Colors.card,
    borderTopWidth: 0,
    ...Shadows.lg,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  tabIconFocused: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
  },
  tabLabelFocused: {
    color: Colors.primary.default,
    fontWeight: FontWeight.medium,
  },
});

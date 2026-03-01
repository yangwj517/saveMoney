/**
 * 攒钱记账 - 攒钱目标布局
 */

import { Stack } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function SavingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}

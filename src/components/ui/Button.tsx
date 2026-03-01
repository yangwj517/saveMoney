/**
 * 攒钱记账 - 渐变按钮组件
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { BorderRadius, Shadows, Sizes, Spacing } from '@/constants/layout';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'expense' | 'income';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}) => {
  const buttonHeight = Sizes.button[size];
  const isGradient = variant === 'primary';
  const isDisabled = disabled || loading;

  const getBackgroundColor = () => {
    if (isDisabled) return Colors.gray[200];
    switch (variant) {
      case 'secondary':
        return Colors.gray[100];
      case 'outline':
      case 'ghost':
        return 'transparent';
      case 'expense':
        return Colors.expenseLight;
      case 'income':
        return Colors.incomeLight;
      default:
        return Colors.primary.default;
    }
  };

  const getTextColor = () => {
    if (isDisabled) return Colors.gray[400];
    switch (variant) {
      case 'primary':
        return Colors.text.inverse;
      case 'secondary':
        return Colors.text.primary;
      case 'outline':
        return Colors.primary.default;
      case 'ghost':
        return Colors.text.secondary;
      case 'expense':
        return Colors.expense;
      case 'income':
        return Colors.income;
      default:
        return Colors.text.inverse;
    }
  };

  const getBorderStyle = (): ViewStyle => {
    if (variant === 'outline') {
      return {
        borderWidth: 1.5,
        borderColor: isDisabled ? Colors.gray[300] : Colors.primary.default,
      };
    }
    return {};
  };

  const getGradientColors = (): [string, string] => {
    if (isDisabled) return [Colors.gray[200], Colors.gray[200]];
    switch (variant) {
      case 'expense':
        return Gradients.expense as [string, string];
      case 'income':
        return Gradients.income as [string, string];
      default:
        return Gradients.primary as [string, string];
    }
  };

  const containerStyle: ViewStyle = {
    height: buttonHeight,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...(fullWidth ? { width: '100%' } : {}),
    ...style,
  };

  const buttonStyle: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    ...(!isGradient ? { backgroundColor: getBackgroundColor() } : {}),
    ...getBorderStyle(),
    ...Shadows.sm,
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <React.Fragment>{icon}</React.Fragment>
          )}
          <Text
            style={[
              styles.text,
              Typography.button,
              { color: getTextColor() },
              icon ? (iconPosition === 'left' ? styles.textWithLeftIcon : styles.textWithRightIcon) : {},
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <React.Fragment>{icon}</React.Fragment>
          )}
        </>
      )}
    </>
  );

  if (isGradient && !isDisabled) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={isDisabled}
        style={containerStyle}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[buttonStyle, { borderRadius: BorderRadius.lg }]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={isDisabled}
      style={[containerStyle, buttonStyle]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
  textWithLeftIcon: {
    marginLeft: Spacing.sm,
  },
  textWithRightIcon: {
    marginRight: Spacing.sm,
  },
});

export default Button;

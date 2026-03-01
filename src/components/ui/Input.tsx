/**
 * 攒钱记账 - 输入框组件
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';
import { Typography, FontSize } from '@/constants/typography';
import { BorderRadius, Spacing, Sizes } from '@/constants/layout';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  editable = true,
  style,
  inputStyle,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const containerStyle: ViewStyle = {
    opacity: editable ? 1 : 0.6,
    ...style,
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[styles.label, Typography.label]}>{label}</Text>
      )}
      
      <View style={styles.inputWrapper}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.tertiary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            Typography.body,
            leftIcon ? styles.inputWithLeftIcon : {},
            rightIcon ? styles.inputWithRightIcon : {},
            multiline ? styles.multilineInput : {},
            inputStyle,
          ]}
        />
        
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      
      {/* 底部线条 */}
      <View style={styles.lineContainer}>
        {isFocused ? (
          <LinearGradient
            colors={error ? [Colors.error, Colors.error] : (Gradients.primary as [string, string])}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientLine}
          />
        ) : (
          <View 
            style={[
              styles.line, 
              error ? styles.errorLine : {}
            ]} 
          />
        )}
      </View>
      
      {error && (
        <Text style={[styles.errorText, Typography.caption]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Sizes.input.md,
  },
  input: {
    flex: 1,
    color: Colors.text.primary,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
  },
  inputWithLeftIcon: {
    paddingLeft: Spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: Spacing.sm,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  leftIcon: {
    marginRight: Spacing.xs,
  },
  rightIcon: {
    marginLeft: Spacing.xs,
  },
  lineContainer: {
    height: 2,
    backgroundColor: Colors.gray[200],
  },
  line: {
    height: 1,
    backgroundColor: Colors.gray[300],
  },
  gradientLine: {
    height: 2,
  },
  errorLine: {
    backgroundColor: Colors.error,
    height: 2,
  },
  errorText: {
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});

export default Input;

import React from 'react';
import { TextInput, type TextInputProps, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useKeyboardHandler } from 'react-native-keyboard-controller';

interface Props extends TextInputProps {
  /** Distance from screen bottom to input bottom at rest */
  bottomY: number;
  /** Gap between input and keyboard when floating (default 0) */
  keyboardGap?: number;
  /** How much wider the input gets when floating (default 30) */
  expandWidth?: number;
  /** Border radius when at rest (default 12) */
  borderRadius?: number;
  /** Border radius when floating (default 24) */
  floatingBorderRadius?: number;
  /** Duration of the return animation in ms (default 200) */
  returnDuration?: number;
  /** Offset from input position before it starts moving (default 15) */
  threshold?: number;
  /** Parent's keyboard offset (shared value) to compensate for parent moving */
  parentOffset?: SharedValue<number>;
  /** Style for the wrapper */
  wrapperStyle?: ViewStyle;
}

export default function BubbleTextInput({
  bottomY,
  keyboardGap = 0,
  expandWidth = 30,
  borderRadius = 12,
  floatingBorderRadius = 24,
  returnDuration = 200,
  threshold = 15,
  parentOffset,
  wrapperStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const kbHeight = useSharedValue(0);
  const focused = useSharedValue(false);
  const moveThreshold = bottomY - threshold;

  useKeyboardHandler(
    {
      onStart: e => {
        'worklet';
        if (!focused.value) return;
        if (e.height === 0 && kbHeight.value > 0) {
          kbHeight.value = withTiming(0, { duration: returnDuration });
          focused.value = false;
        }
      },
      onMove: e => {
        'worklet';
        if (!focused.value) return;
        if (e.height < moveThreshold) return;
        if (e.height >= kbHeight.value) {
          kbHeight.value = e.height;
        }
      },
      onEnd: e => {
        'worklet';
        if (!focused.value) return;
        kbHeight.value = e.height;
      },
    },
    [],
  );

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    if (kbHeight.value === 0) {
      return {
        transform: [{ translateY: 0 }],
        marginHorizontal: 0,
        borderRadius,
      };
    }

    const progress = Math.min(kbHeight.value / 100, 1);
    const parentY = parentOffset ? parentOffset.value : 0;
    const targetY = focused.value
      ? -(kbHeight.value + keyboardGap - bottomY + 10) - parentY
      : 0;

    return {
      transform: [{ translateY: focused.value ? targetY : 0 }],
      marginHorizontal: focused.value ? -expandWidth * progress : 0,
      borderRadius: focused.value
        ? borderRadius + (floatingBorderRadius - borderRadius) * progress
        : borderRadius,
    };
  });

  return (
    <Animated.View style={[wrapperStyle, { borderRadius }, animatedStyle]}>
      <TextInput
        {...rest}
        style={style}
        onFocus={e => {
          focused.value = true;

          onFocus?.(e);
        }}
        onBlur={e => {
          onBlur?.(e);
        }}
      />
    </Animated.View>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { EaseView } from 'react-native-ease';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';

function useOrbitStyle(
  progress: SharedValue<number>,
  w: SharedValue<number>,
  h: SharedValue<number>,
  size: number,
  visibility: SharedValue<number>,
) {
  return useAnimatedStyle(() => {
    'worklet';
    const wVal = w.value;
    const hVal = h.value;
    if (wVal === 0) return { opacity: 0 };

    const p = progress.value % 1;
    const perimeter = 2 * (wVal + hVal);
    const dist = p * perimeter;

    let x = 0;
    let y = 0;
    if (dist < wVal) {
      x = dist; y = 0;
    } else if (dist < wVal + hVal) {
      x = wVal; y = dist - wVal;
    } else if (dist < 2 * wVal + hVal) {
      x = wVal - (dist - wVal - hVal); y = hVal;
    } else {
      x = 0; y = hVal - (dist - 2 * wVal - hVal);
    }

    return {
      transform: [
        { translateX: x - size / 2 },
        { translateY: y - size / 2 },
      ],
      opacity: visibility.value,
    };
  });
}

function PulsingStar({ size, color, pulse }: {
  size: number;
  color: string;
  pulse: number;
}) {
  const isOn = pulse % 2 === 0;
  return (
    <EaseView
      animate={{
        opacity: isOn ? 1 : 0.3,
        scale: isOn ? 1.2 : 0.5,
        rotate: isOn ? 0 : 45,
      }}
      transition={{
        transform: { type: 'timing', duration: 800, easing: 'easeInOut' },
        opacity: { type: 'timing', duration: 800, easing: 'easeInOut' },
      }}
      style={{ width: size, height: size }}
    >
      <View style={{
        position: 'absolute',
        top: size * 0.35,
        left: 0,
        width: size,
        height: size * 0.3,
        borderRadius: size * 0.15,
        backgroundColor: color,
      }} />
      <View style={{
        position: 'absolute',
        top: 0,
        left: size * 0.35,
        width: size * 0.3,
        height: size,
        borderRadius: size * 0.15,
        backgroundColor: color,
      }} />
    </EaseView>
  );
}

type Props = {
  showStars: boolean;
  children: React.ReactNode;
  style?: any;
};

export default function OrbitStarView({ showStars, children, style }: Props) {
  const progress1 = useSharedValue(0.15);
  const progress2 = useSharedValue(0.65);
  const starOpacity = useSharedValue(0);
  const dimW = useSharedValue(0);
  const dimH = useSharedValue(0);
  const measured = useRef(false);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (showStars && measured.current) {
      progress1.value = 0.15;
      progress2.value = 0.65;
      starOpacity.value = withTiming(1, { duration: 300 });
      progress1.value = withRepeat(
        withTiming(1.15, { duration: 8000, easing: Easing.linear }), -1,
      );
      progress2.value = withRepeat(
        withTiming(1.65, { duration: 10000, easing: Easing.linear }), -1,
      );
    } else {
      starOpacity.value = withTiming(0, { duration: 200 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showStars]);

  useEffect(() => {
    if (!showStars) return;
    const t = setInterval(() => setPulse(p => p + 1), 1200);
    return () => clearInterval(t);
  }, [showStars]);

  const star1Style = useOrbitStyle(progress1, dimW, dimH, 8, starOpacity);
  const star2Style = useOrbitStyle(progress2, dimW, dimH, 6, starOpacity);

  return (
    <View
      style={style}
      onLayout={(e) => {
        if (!measured.current) {
          const { width, height } = e.nativeEvent.layout;
          dimW.value = width;
          dimH.value = height;
          measured.current = true;
        }
      }}
    >
      {children}
      <Animated.View style={[styles.wrap, star1Style]}>
        <PulsingStar size={8} color="#FFFFFF" pulse={pulse} />
      </Animated.View>
      <Animated.View style={[styles.wrap, star2Style]}>
        <PulsingStar size={6} color="rgba(255,255,255,0.8)" pulse={pulse + 1} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    zIndex: 10,
  },
});

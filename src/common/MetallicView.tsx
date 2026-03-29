import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {EaseView} from 'react-native-ease';
import EaseGradient from './EaseGradient';

type Props = {
  children: React.ReactNode;
  style?: any;
  borderRadius?: number;
  borderWidth?: number;
  baseColor?: string;
  shineColor?: string;
  active?: boolean;
  /** Delay before shine animation starts in ms (default 0) */
  delay?: number;
};

function ShineStreak({
  width,
  height,
  delay,
  duration,
  color,
  startX,
  endX,
  direction,
}: {
  width: number;
  height: number;
  delay: number;
  duration: number;
  color: string;
  startX: number;
  endX: number;
  direction: 'horizontal' | 'vertical';
}) {
  return (
    <EaseView
      initialAnimate={{
        translateX: direction === 'horizontal' ? startX : 0,
        translateY: direction === 'vertical' ? startX : 0,
        opacity: 0.8,
      }}
      animate={{
        translateX: direction === 'horizontal' ? endX : 0,
        translateY: direction === 'vertical' ? endX : 0,
        opacity: 0.8,
      }}
      transition={{
        transform: {type: 'timing', duration, easing: 'easeInOut', delay, loop: 'reverse'},
        opacity: {type: 'timing', duration, easing: 'easeInOut', delay, loop: 'reverse'},
      }}
      style={styles.streak}>
      <EaseGradient
        width={width}
        height={height}
        color={color}
        segments={60}
        direction={direction}
        minOpacity={0}
        maxOpacity={0.5}
      />
    </EaseView>
  );
}

export default function MetallicView({
  children,
  style,
  borderRadius = 20,
  borderWidth = 1,
  baseColor = '#2A2A4A',
  shineColor = 'rgba(255,255,255,0.5)',
  active = true,
  delay = 0,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const showShine = active && mounted;

  return (
    <View style={[{position: 'relative', borderRadius, borderWidth, borderColor: baseColor}, style, {overflow: 'visible'}]}>
      {children}

      {/* Shine overlay — positioned exactly on top of the border */}
      {showShine && (
        <View
          style={[styles.overlay, {borderRadius, top: -borderWidth, left: -borderWidth, right: -borderWidth, bottom: -borderWidth}]}
          pointerEvents="none">
          {/* Top */}
          <View style={[styles.edgeH, {top: 0, height: borderWidth}]}>
            <ShineStreak width={100} height={borderWidth} delay={delay} duration={5000} color={shineColor} startX={-120} endX={380} direction="horizontal" />
          </View>

          {/* Right */}
          <View style={[styles.edgeV, {right: 0, width: borderWidth}]}>
            <ShineStreak width={borderWidth} height={70} delay={delay + 4500} duration={3500} color={shineColor} startX={-80} endX={280} direction="vertical" />
          </View>

          {/* Bottom */}
          <View style={[styles.edgeH, {bottom: 0, height: borderWidth}]}>
            <ShineStreak width={100} height={borderWidth} delay={delay + 7800} duration={5000} color={shineColor} startX={380} endX={-120} direction="horizontal" />
          </View>

          {/* Left */}
          <View style={[styles.edgeV, {left: 0, width: borderWidth}]}>
            <ShineStreak width={borderWidth} height={70} delay={delay + 12500} duration={3500} color={shineColor} startX={280} endX={-80} direction="vertical" />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 10,
  },
  streak: {
    position: 'absolute',
  },
  edgeH: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  edgeV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    overflow: 'hidden',
  },
});

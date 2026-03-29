import React from 'react';
import {View} from 'react-native';

type Props = {
  width: number;
  height: number;
  color?: string;
  segments?: number;
  direction?: 'horizontal' | 'vertical';
  minOpacity?: number;
  maxOpacity?: number;
};

export default function EaseGradient({
  width,
  height,
  color = '#FFFFFF',
  segments = 60,
  direction = 'horizontal',
  minOpacity = 0,
  maxOpacity = 0.9,
}: Props) {
  const isHorizontal = direction === 'horizontal';

  return (
    <View
      style={{
        width,
        height,
        flexDirection: isHorizontal ? 'row' : 'column',
      }}>
      {Array.from({length: segments}, (_, i) => {
        const t = i / (segments - 1);
        const curve = Math.sin(t * Math.PI);
        const opacity = minOpacity + curve * (maxOpacity - minOpacity);

        return (
          <View
            key={i}
            style={{
              flex: 1,
              backgroundColor: color,
              opacity,
            }}
          />
        );
      })}
    </View>
  );
}

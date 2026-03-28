import React, {useState, useCallback} from 'react';
import {StyleSheet, View, type GestureResponderEvent} from 'react-native';
import {EaseView} from 'react-native-ease';

type Tap = {id: number; x: number; y: number};
let nextId = 0;

function TapDot({x, y}: {x: number; y: number}) {
  return (
    <EaseView
      initialAnimate={{scale: 0.2, opacity: 0.7}}
      animate={{scale: 1.2, opacity: 0}}
      transition={{
        transform: {type: 'timing', duration: 400, easing: 'easeOut'},
        opacity: {type: 'timing', duration: 400, easing: 'easeOut'},
      }}
      style={[styles.dot, {left: x - 12, top: y - 12}]}
    />
  );
}

export default function TouchVisualizer({children}: {children: React.ReactNode}) {
  const [taps, setTaps] = useState<Tap[]>([]);

  const onTap = useCallback((e: GestureResponderEvent) => {
    const {pageX, pageY} = e.nativeEvent;
    const id = ++nextId;
    setTaps(prev => [...prev, {id, x: pageX, y: pageY}]);
    setTimeout(() => setTaps(prev => prev.filter(t => t.id !== id)), 500);
  }, []);

  return (
    <View
      style={styles.fill}
      onStartShouldSetResponder={() => true}
      onResponderStart={onTap}>
      {children}
      {taps.map(t => (
        <TapDot key={t.id} x={t.x} y={t.y} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  dot: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    zIndex: 99999,
    pointerEvents: 'none',
  },
});

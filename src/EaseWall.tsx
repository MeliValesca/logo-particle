import React, {useState, useEffect, useRef, useMemo} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {EaseView} from 'react-native-ease';
import {
  buildParticles,
  CUBE_VIEW_SIZE,
  type Particle,
} from './cube';

function Dot({p, wave}: {p: Particle; wave: number}) {
  const delay = p.dist * 40;
  const isActive = wave % 2 === 0;

  // Explode outward from center based on distance
  const explodeX = isActive ? 0 : (p.px - CUBE_VIEW_SIZE / 2) * 0.4;
  const explodeY = isActive ? 0 : (p.py - CUBE_VIEW_SIZE / 2) * 0.4;

  return (
    <EaseView
      animate={{
        scale: isActive ? 1 : 0.15,
        opacity: isActive ? 0.85 : 0.08,
        translateX: explodeX,
        translateY: explodeY,
        rotate: isActive ? 0 : 180,
      }}
      transition={{
        transform: {type: 'spring', damping: 7, stiffness: 90, delay},
        opacity: {type: 'timing', duration: 600, easing: 'easeOut', delay},
      }}
      style={[
        styles.particle,
        {
          left: p.px - p.size / 2,
          top: p.py - p.size / 2,
          width: p.size,
          height: p.size,
          borderRadius: p.size / 2,
          backgroundColor: p.color,
        },
      ]}
    />
  );
}

function blockJSThread(ms: number) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    Math.random() * Math.random();
  }
}

export default function EaseWall() {
  const [wave, setWave] = useState(0);
  const [jsLoad, setJsLoad] = useState(false);
  const [auto, setAuto] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const particles = useMemo(() => buildParticles(), []);

  useEffect(() => {
    if (jsLoad) {
      intervalRef.current = setInterval(() => blockJSThread(50), 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [jsLoad]);

  useEffect(() => {
    if (auto) {
      autoRef.current = setInterval(() => setWave(w => w + 1), 2000);
    } else if (autoRef.current) {
      clearInterval(autoRef.current);
    }
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [auto]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Particle Cube</Text>
          <Text style={styles.sub}>
            {particles.length} particles · EaseView
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>EaseView</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.btn} onPress={() => setWave(w => w + 1)}>
          <Text style={styles.btnText}>Wave</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, auto && styles.btnGreen]}
          onPress={() => setAuto(a => !a)}>
          <Text style={styles.btnText}>Auto {auto ? 'ON' : 'OFF'}</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, jsLoad && styles.btnRed]}
          onPress={() => setJsLoad(l => !l)}>
          <Text style={styles.btnText}>JS Load {jsLoad ? 'ON' : 'OFF'}</Text>
        </Pressable>
      </View>

      {jsLoad && (
        <Text style={styles.warning}>
          JS thread blocked — animations stay smooth with EaseView
        </Text>
      )}

      <View style={styles.cubeContainer}>
        <View style={styles.glow} />
        <View style={[styles.cube, {width: CUBE_VIEW_SIZE, height: CUBE_VIEW_SIZE}]}>
          {particles.map((p, i) => (
            <Dot key={i} p={p} wave={wave} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#08080F', paddingTop: 60},
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  title: {fontSize: 26, fontWeight: '800', color: '#FFF'},
  sub: {fontSize: 12, color: '#6C6C8A', marginTop: 2},
  badge: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {color: '#FFF', fontSize: 12, fontWeight: '700'},
  controls: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  btn: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  btnGreen: {backgroundColor: '#00B894', borderColor: '#00B894'},
  btnRed: {backgroundColor: '#D63031', borderColor: '#D63031'},
  btnText: {color: '#FFF', fontWeight: '600', fontSize: 13},
  warning: {
    color: '#FF7675',
    fontSize: 11,
    paddingHorizontal: 20,
    marginTop: 10,
    fontStyle: 'italic',
  },
  cubeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#6C5CE7',
    opacity: 0.06,
  },
  cube: {position: 'relative'},
  particle: {position: 'absolute'},
});

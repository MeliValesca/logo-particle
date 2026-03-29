import React, {useMemo, useEffect, useRef} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {EaseView} from 'react-native-ease';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {LOGO_POINTS, type LogoPoint} from './data/logoPoints';
import {useParticles} from './ParticleContext';
import BootSplash from 'react-native-bootsplash';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const LOGO_VIEW_SIZE = SCREEN_WIDTH - 40;
const DOT_SIZE = 6;
const CENTER = LOGO_VIEW_SIZE / 2;

type DotData = {
  px: number;
  py: number;
  brightness: number;
  dist: number;
  scatterX: number;
  scatterY: number;
  galaxyX: number;
  galaxyY: number;
};

type StarData = {
  x: number;
  y: number;
  size: number;
  delay: number;
  brightness: number;
};

function buildDots(): DotData[] {
  return LOGO_POINTS.map((p: LogoPoint) => {
    const px = p.x * LOGO_VIEW_SIZE;
    const py = p.y * LOGO_VIEW_SIZE;
    const dx = px - CENTER;
    const dy = py - CENTER;
    const dist = Math.sqrt(dx * dx + dy * dy) / (LOGO_VIEW_SIZE / 2);
    const angle = Math.random() * Math.PI * 2;
    const spread = 60 + Math.random() * 120;
    const galaxyAngle = Math.random() * Math.PI * 2;
    const galaxySpread = 80 + Math.random() * SCREEN_WIDTH * 0.6;
    return {
      px, py, brightness: p.brightness, dist,
      scatterX: Math.cos(angle) * spread,
      scatterY: Math.sin(angle) * spread,
      galaxyX: Math.cos(galaxyAngle) * galaxySpread,
      galaxyY: Math.sin(galaxyAngle) * galaxySpread,
    };
  });
}

function buildStars(count: number): StarData[] {
  return Array.from({length: count}, () => ({
    x: Math.random() * SCREEN_WIDTH,
    y: Math.random() * SCREEN_HEIGHT,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 600,
    brightness: 0.3 + Math.random() * 0.7,
  }));
}

function Dot({p, wave, phase}: {p: DotData; wave: number; phase: string}) {
  const delay = p.dist * 40;
  const dotStyle = [
    styles.dot,
    {
      left: p.px - DOT_SIZE / 2,
      top: p.py - DOT_SIZE / 2,
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: DOT_SIZE / 2,
    },
  ];

  if (phase === 'revealing') {
    return (
      <EaseView
        animate={{
          translateX: p.galaxyX,
          translateY: p.galaxyY,
          scale: 0.3 + Math.random() * 0.5,
          opacity: 0.15 + Math.random() * 0.4,
          rotate: 360,
        }}
        transition={{
          transform: {type: 'spring', damping: 8, stiffness: 40, delay: delay * 0.8},
          opacity: {type: 'timing', duration: 800, easing: 'easeOut', delay: delay * 0.8},
        }}
        style={dotStyle}
      />
    );
  }

  if (phase === 'scattering') {
    return (
      <EaseView
        animate={{
          translateX: p.scatterX,
          translateY: p.scatterY,
          scale: 0.4,
          opacity: 0.15,
          rotate: 180,
        }}
        transition={{
          transform: {type: 'spring', damping: 10, stiffness: 70, delay: delay * 0.5},
          opacity: {type: 'timing', duration: 400, easing: 'easeOut', delay: delay * 0.5},
        }}
        style={dotStyle}
      />
    );
  }

  if (phase === 'welcome' || phase === 'authenticating') {
    return (
      <EaseView
        animate={{
          scale: 1,
          opacity: p.brightness,
          translateX: 0,
          translateY: 0,
          rotate: 0,
        }}
        transition={{
          transform: {type: 'spring', damping: 12, stiffness: 80, delay},
          opacity: {type: 'timing', duration: 500, easing: 'easeOut', delay},
        }}
        style={dotStyle}
      />
    );
  }

  // Splash — pulsing
  const isActive = wave % 2 === 0;
  const explodeX = isActive ? 0 : (p.px - CENTER) * 0.08;
  const explodeY = isActive ? 0 : (p.py - CENTER) * 0.08;

  return (
    <EaseView
      animate={{
        scale: isActive ? 1 : 0.7,
        opacity: isActive ? p.brightness : 0.3,
        translateX: explodeX,
        translateY: explodeY,
        rotate: isActive ? 0 : 90,
      }}
      transition={{
        transform: {type: 'spring', damping: 7, stiffness: 90, delay},
        opacity: {type: 'timing', duration: 600, easing: 'easeOut', delay},
      }}
      style={dotStyle}
    />
  );
}

function Star({s, twinkle}: {s: StarData; twinkle: boolean}) {
  return (
    <EaseView
      initialAnimate={{opacity: 0, scale: 0}}
      animate={{
        opacity: twinkle ? s.brightness : s.brightness * 0.3,
        scale: twinkle ? 1 : 0.5,
      }}
      transition={{
        transform: {type: 'spring', damping: 8, stiffness: 60, delay: s.delay},
        opacity: {type: 'timing', duration: 500, easing: 'easeOut', delay: s.delay},
      }}
      style={[
        styles.star,
        {
          left: s.x,
          top: s.y,
          width: s.size,
          height: s.size,
          borderRadius: s.size / 2,
        },
      ]}
    />
  );
}

export default function ParticleBackground() {
  const {phase, wave, setWave, autoRef} = useParticles();
  const [starTwinkle, setStarTwinkle] = React.useState(0);
  const twinkleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dots = useMemo(() => buildDots(), []);
  const behindStars = useMemo(() => buildStars(40), []);
  const frontStars = useMemo(() => buildStars(25), []);

  const containerX = useSharedValue(0);
  const containerY = useSharedValue(0);
  const containerScale = useSharedValue(1);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: containerX.value},
      {translateY: containerY.value},
      {scale: containerScale.value},
    ],
  }));

  // Splash pulsing + hide boot splash
  useEffect(() => {
    BootSplash.hide({fade: true});
    autoRef.current = setInterval(() => setWave(w => w + 1), 1200);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [autoRef, setWave]);

  // Splash -> welcome transition
  useEffect(() => {
    if (wave >= 4 && wave % 2 === 0 && phase === 'splash') {
      if (autoRef.current) {
        clearInterval(autoRef.current);
        autoRef.current = null;
      }
    }
  }, [wave, phase, autoRef]);

  // Container animations driven by phase
  useEffect(() => {
    if (phase === 'scattering') {
      containerX.value = withSequence(
        withTiming(SCREEN_WIDTH, {
          duration: 600,
          easing: Easing.in(Easing.cubic),
        }),
        withTiming(-SCREEN_WIDTH, {duration: 0}),
        withTiming(0, {
          duration: 900,
          easing: Easing.out(Easing.cubic),
        }),
      );
    }

    if (phase === 'welcome') {
      containerY.value = withTiming(-140, {
        duration: 900,
        easing: Easing.out(Easing.cubic),
      });
      containerScale.value = withTiming(0.65, {
        duration: 900,
        easing: Easing.out(Easing.cubic),
      });
    }

    if (phase === 'authenticating') {
      // Will be pulsed by EaseWall via setWave
    }

    if (phase === 'revealing') {
      containerScale.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      containerY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Star twinkle during revealing
  useEffect(() => {
    if (phase === 'revealing') {
      twinkleRef.current = setInterval(() => setStarTwinkle(t => t + 1), 800);
    }
    return () => {
      if (twinkleRef.current) {
        clearInterval(twinkleRef.current);
        twinkleRef.current = null;
      }
    };
  }, [phase]);

  const showStars = phase === 'revealing';

  return (
    <>
      {/* Behind stars */}
      {showStars && (
        <View style={styles.starsLayer} pointerEvents="none">
          {behindStars.map((s, i) => (
            <Star key={`b-${i}`} s={s} twinkle={starTwinkle % 2 === 0} />
          ))}
        </View>
      )}

      {/* Logo dots */}
      <View style={styles.logoContainer} pointerEvents="none">
        <Animated.View style={containerStyle}>
          <View style={styles.glow} />
          <View style={[styles.logoFrame, {width: LOGO_VIEW_SIZE, height: LOGO_VIEW_SIZE}]}>
            {dots.map((d, i) => (
              <Dot key={i} p={d} wave={wave} phase={phase} />
            ))}
          </View>
        </Animated.View>
      </View>

      {/* Front stars */}
      {showStars && (
        <View style={styles.starsLayerFront} pointerEvents="none">
          {frontStars.map((s, i) => (
            <Star key={`f-${i}`} s={s} twinkle={starTwinkle % 2 === 1} />
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#6C5CE7',
    opacity: 0.06,
    alignSelf: 'center',
    top: LOGO_VIEW_SIZE / 2 - 100,
  },
  logoFrame: {position: 'relative'},
  dot: {position: 'absolute', backgroundColor: '#FFFFFF'},
  star: {position: 'absolute', backgroundColor: '#FFFFFF'},
  starsLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  starsLayerFront: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});

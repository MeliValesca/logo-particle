import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {EaseView} from 'react-native-ease';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {LOGO_POINTS, type LogoPoint} from './logoPoints';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const LOGO_VIEW_SIZE = SCREEN_WIDTH - 40;
const DOT_SIZE = 6;
const CENTER = LOGO_VIEW_SIZE / 2;

type Phase = 'splash' | 'scattering' | 'welcome' | 'authenticating' | 'revealing' | 'home';

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
    const spread = 30 + Math.random() * 60;
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

function Dot({p, wave, phase}: {p: DotData; wave: number; phase: Phase}) {
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

function MockHomeScreen() {
  return (
    <View style={styles.homeScreen}>
      <View style={styles.homeHeader}>
        <Text style={styles.homeGreeting}>Good morning</Text>
        <Text style={styles.homeUser}>John</Text>
      </View>
      <View style={styles.homeCards}>
        <View style={styles.homeCard}>
          <Text style={styles.homeCardTitle}>Dashboard</Text>
          <Text style={styles.homeCardSub}>3 new notifications</Text>
        </View>
        <View style={styles.homeCard}>
          <Text style={styles.homeCardTitle}>Projects</Text>
          <Text style={styles.homeCardSub}>12 active</Text>
        </View>
        <View style={styles.homeCard}>
          <Text style={styles.homeCardTitle}>Messages</Text>
          <Text style={styles.homeCardSub}>5 unread</Text>
        </View>
      </View>
    </View>
  );
}

export default function EaseWall() {
  const [wave, setWave] = useState(0);
  const [phase, setPhase] = useState<Phase>('splash');
  const [starTwinkle, setStarTwinkle] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const twinkleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dots = useMemo(() => buildDots(), []);
  const behindStars = useMemo(() => buildStars(40), []);
  const frontStars = useMemo(() => buildStars(25), []);

  const containerX = useSharedValue(0);
  const containerY = useSharedValue(0);
  const loginOpacity = useSharedValue(0);
  const loginTranslateY = useSharedValue(30);
  const homeOpacity = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: containerX.value},
      {translateY: containerY.value},
    ],
  }));

  const loginStyle = useAnimatedStyle(() => ({
    opacity: loginOpacity.value,
    transform: [{translateY: loginTranslateY.value}],
  }));

  const homeStyle = useAnimatedStyle(() => ({
    opacity: homeOpacity.value,
  }));

  // Splash pulsing
  useEffect(() => {
    autoRef.current = setInterval(() => setWave(w => w + 1), 1200);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, []);

  // Splash -> welcome transition
  useEffect(() => {
    if (wave >= 4 && wave % 2 === 0 && phase === 'splash') {
      if (autoRef.current) {
        clearInterval(autoRef.current);
        autoRef.current = null;
      }

      setPhase('scattering');

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

      setTimeout(() => {
        setPhase('welcome');
        containerY.value = withTiming(-100, {
          duration: 900,
          easing: Easing.out(Easing.cubic),
        });
      }, 600);

      setTimeout(() => {
        loginOpacity.value = withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.ease),
        });
        loginTranslateY.value = withTiming(0, {
          duration: 400,
          easing: Easing.out(Easing.ease),
        });
      }, 1500);
    }
  }, [wave, phase]);

  // Auto-type username and password, then login
  useEffect(() => {
    if (phase === 'welcome') {
      const typeUsername = 'john';
      const typePassword = '••••';
      let i = 0;
      let interval: ReturnType<typeof setInterval>;
      const delay = setTimeout(() => {
        interval = setInterval(() => {
          if (i < typeUsername.length) {
            setUsername(typeUsername.slice(0, i + 1));
          } else if (i < typeUsername.length + typePassword.length) {
            setPassword(typePassword.slice(0, i - typeUsername.length + 1));
          } else {
            clearInterval(interval);
            setTimeout(() => handleLogin(), 500);
          }
          i++;
        }, 200);
      }, 3000);
      return () => {
        clearTimeout(delay);
        clearInterval(interval);
      };
    }
  }, [phase]);

  // Star twinkle loop during revealing
  useEffect(() => {
    if (phase === 'revealing') {
      twinkleRef.current = setInterval(
        () => setStarTwinkle(t => t + 1),
        800,
      );
    }
    return () => {
      if (twinkleRef.current) {
        clearInterval(twinkleRef.current);
        twinkleRef.current = null;
      }
    };
  }, [phase]);

  const handleLogin = () => {
    setPhase('authenticating');

    // After 1s "loading", reveal
    setTimeout(() => {
      setPhase('revealing');

      // Fade out login card
      loginOpacity.value = withTiming(0, {
        duration: 400,
        easing: Easing.in(Easing.ease),
      });

      // Fade in home screen behind the particles
      setTimeout(() => {
        homeOpacity.value = withTiming(1, {
          duration: 800,
          easing: Easing.out(Easing.ease),
        });
      }, 600);

      // Stay in revealing — keep particles and stars visible
    }, 1000);
  };

  const showLogin = phase === 'welcome' || phase === 'authenticating' || phase === 'revealing';
  const showParticles = true;
  const showStars = phase === 'revealing';
  const showHome = phase === 'revealing';

  return (
    <View style={styles.screen}>
      {/* Mock home screen fades in behind everything */}
      {showHome && (
        <Animated.View style={[styles.homeLayer, homeStyle]}>
          <MockHomeScreen />
        </Animated.View>
      )}

      {/* Behind stars */}
      {showStars && (
        <View style={styles.starsLayer}>
          {behindStars.map((s, i) => (
            <Star key={`b-${i}`} s={s} twinkle={starTwinkle % 2 === 0} />
          ))}
        </View>
      )}

      {/* Logo dots */}
      {showParticles && (
        <View style={styles.logoContainer}>
          <Animated.View style={containerStyle}>
            <View style={styles.glow} />
            <View style={[styles.logoFrame, {width: LOGO_VIEW_SIZE, height: LOGO_VIEW_SIZE}]}>
              {dots.map((d, i) => (
                <Dot key={i} p={d} wave={wave} phase={phase} />
              ))}
            </View>
          </Animated.View>
        </View>
      )}

      {/* Login card */}
      {showLogin && (
        <Animated.View style={[styles.loginContainer, loginStyle]}>
          <View style={styles.loginCard}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#8E8E93"
              autoCapitalize="none"
              value={username}
              editable={false}
              showSoftInputOnFocus={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#8E8E93"
              value={password}
              editable={false}
              showSoftInputOnFocus={false}
            />
            <Pressable
              style={styles.loginBtn}
              onPress={handleLogin}
              disabled={phase !== 'welcome'}>
              {phase === 'authenticating' ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.loginBtnText}>Log In</Text>
              )}
            </Pressable>
          </View>
        </Animated.View>
      )}

      {/* Front stars (above login card) */}
      {showStars && (
        <View style={styles.starsLayerFront}>
          {frontStars.map((s, i) => (
            <Star key={`f-${i}`} s={s} twinkle={starTwinkle % 2 === 1} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#08080F'},
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
    pointerEvents: 'none',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  homeLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  loginContainer: {
    position: 'absolute',
    bottom: 120,
    left: 30,
    right: 30,
    zIndex: 5,
  },
  loginCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 24,
  },
  input: {
    backgroundColor: '#2A2A4A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  loginBtn: {
    backgroundColor: '#4A5568',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    height: 52,
    justifyContent: 'center',
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Mock home screen
  homeScreen: {
    flex: 1,
    backgroundColor: '#08080F',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  homeHeader: {
    marginBottom: 30,
  },
  homeGreeting: {
    fontSize: 16,
    color: '#6C6C8A',
  },
  homeUser: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  homeCards: {
    gap: 14,
  },
  homeCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  homeCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  homeCardSub: {
    fontSize: 14,
    color: '#6C6C8A',
    marginTop: 4,
  },
});

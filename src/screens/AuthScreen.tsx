import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { useParticles } from '../ParticleContext';
import MetallicView from '../common/MetallicView';
import BubbleTextInput from '../common/BubbleTextInput';
import {colors} from '../common/colors';

// Calculate input positions from known layout
// Input: paddingVertical(14)*2 + fontSize lineHeight(~20) + borderWidth(1)*2 = ~50
const inputHeight = 50;
const marginBottom = 12;
const cardPadding = 24 + 1; // padding + MetallicView border
const passwordBottom = 170 + cardPadding + inputHeight;
const usernameBottom = passwordBottom + marginBottom + inputHeight;

export default function AuthScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { phase, setPhase, wave, setWave } = useParticles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [kbOpen, setKbOpen] = useState(false);

  const loginOpacity = useSharedValue(0);
  const loginTranslateY = useSharedValue(30);
  const cardKbOffset = useSharedValue(0);

  useKeyboardHandler(
    {
      onStart: e => {
        'worklet';
        if (e.height > 0) {
          // Keyboard opening — slide card down
          cardKbOffset.value = withTiming(200, { duration: 250 });
        } else {
          // Keyboard closing — slide card back
          cardKbOffset.value = withTiming(0, { duration: 200 });
        }
      },
    },
    [],
  );

  const loginStyle = useAnimatedStyle(() => ({
    opacity: loginOpacity.value,
    transform: [{ translateY: loginTranslateY.value + cardKbOffset.value }],
  }));

  useEffect(() => {
    if (wave >= 4 && wave % 2 === 0 && phase === 'splash') {
      setPhase('scattering');

      setTimeout(() => setPhase('welcome'), 600);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wave, phase]);

  const handleLogin = () => {
    Keyboard.dismiss();
    setPhase('authenticating');

    setTimeout(() => {
      setWave(w => w + 1);

      loginOpacity.value = withTiming(0, {
        duration: 250,
        easing: Easing.in(Easing.ease),
      });

      setTimeout(() => {
        setPhase('revealing');
        setTimeout(() => navigation.navigate('Home'), 800);
      }, 150);
    }, 1000);
  };

  const showLogin =
    phase === 'welcome' || phase === 'authenticating' || phase === 'revealing';

  return (
    <View style={styles.screen}>
      {showLogin && (
        <Animated.View style={[styles.loginContainer, loginStyle]}>
          <MetallicView style={styles.loginCard} active={!kbOpen}>
            <Text style={styles.welcomeTitle}>Welcome</Text>
            <BubbleTextInput
              bottomY={usernameBottom}
              parentOffset={cardKbOffset}
              wrapperStyle={styles.inputWrap}
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={colors.placeholder}
              autoCapitalize="none"
              threshold={50}
              keyboardAppearance="dark"
              value={username}
              onChangeText={setUsername}
              onFocus={() => setKbOpen(true)}
              onBlur={() => setKbOpen(false)}
            />
            <BubbleTextInput
              bottomY={passwordBottom}
              parentOffset={cardKbOffset}
              wrapperStyle={styles.inputWrap}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.placeholder}
              secureTextEntry
              keyboardAppearance="dark"
              textContentType="none"
              autoComplete="off"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setKbOpen(true)}
              onBlur={() => setKbOpen(false)}
            />
            <View style={styles.loginBtnOuter}>
              <Pressable
                style={({ pressed }) => [
                  styles.loginBtn,
                  pressed && { transform: [{ translateY: 2 }] },
                ]}
                onPress={handleLogin}
                disabled={phase !== 'welcome'}
              >
                {phase === 'authenticating' ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.loginBtnText}>Log In</Text>
                )}
              </Pressable>
            </View>
          </MetallicView>
          <Text style={styles.registerText}>
            Don't have an account? <Text style={styles.registerLink}>Register</Text>
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  loginContainer: {
    position: 'absolute',
    bottom: 130,
    left: 30,
    right: 30,
    zIndex: 5,
  },
  loginCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
  },
  inputWrap: {
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  input: {
    backgroundColor: colors.input,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  loginBtnOuter: {
    backgroundColor: colors.buttonDepth,
    borderRadius: 12,
    paddingBottom: 3,
    marginTop: 4,
  },
  loginBtn: {
    backgroundColor: colors.button,
    borderRadius: 11,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  welcomeTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  registerText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
  },
  registerLink: {
    color: colors.link,
    fontWeight: '600',
  },
});

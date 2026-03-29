import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {useParticles} from '../ParticleContext';

export default function AuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {phase, setPhase, wave, setWave} = useParticles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginOpacity = useSharedValue(0);
  const loginTranslateY = useSharedValue(30);

  const loginStyle = useAnimatedStyle(() => ({
    opacity: loginOpacity.value,
    transform: [{translateY: loginTranslateY.value}],
  }));

  // Trigger scattering after splash pulses
  useEffect(() => {
    if (wave >= 4 && wave % 2 === 0 && phase === 'splash') {
      setPhase('scattering');

      setTimeout(() => {
        setPhase('welcome');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wave, phase]);

  const handleLogin = () => {
    setPhase('authenticating');

    setTimeout(() => {
      // Trigger one pulse
      setWave(w => w + 1);

      loginOpacity.value = withTiming(0, {
        duration: 250,
        easing: Easing.in(Easing.ease),
      });

      setTimeout(() => {
        setPhase('revealing');

        setTimeout(() => {
          navigation.navigate('Home');
        }, 800);
      }, 150);
    }, 1000);
  };

  const showLogin =
    phase === 'welcome' || phase === 'authenticating' || phase === 'revealing';

  return (
    <View style={styles.screen}>
      {showLogin && (
        <Animated.View style={[styles.loginContainer, loginStyle]}>
          <View style={styles.loginCard}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#8E8E93"
              autoCapitalize="none"
              keyboardAppearance="dark"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#8E8E93"
              secureTextEntry
              keyboardAppearance="dark"
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.loginBtnOuter}>
              <Pressable
                style={({pressed}) => [styles.loginBtn, pressed && {marginTop: 3}]}
                onPress={handleLogin}
                disabled={phase !== 'welcome'}>
                {phase === 'authenticating' ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.loginBtnText}>Log In</Text>
                )}
              </Pressable>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: 'transparent'},
  loginContainer: {
    position: 'absolute',
    bottom: 170,
    left: 30,
    right: 30,
    zIndex: 5,
  },
  loginCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  input: {
    backgroundColor: '#2A2A4A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A5A',
  },
  loginBtnOuter: {
    backgroundColor: '#3A4558',
    borderRadius: 12,
    paddingBottom: 3,
    marginTop: 4,
  },
  loginBtn: {
    backgroundColor: '#4A5568',
    borderRadius: 11,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

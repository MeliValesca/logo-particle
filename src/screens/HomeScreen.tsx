import React from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import {EaseView} from 'react-native-ease';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation';
import {useParticles} from '../ParticleContext';
import MetallicView from '../common/MetallicView';
import {colors} from '../common/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({navigation}: Props) {
  const {setPhase, setWave, autoRef} = useParticles();

  const handleBack = () => {
    setPhase('splash');
    setWave(0);
    autoRef.current = setInterval(() => setWave(w => w + 1), 1200);
    navigation.reset({index: 0, routes: [{name: 'Auth'}]});
  };

  return (
    <EaseView
      initialAnimate={{opacity: 0, translateY: 20}}
      animate={{opacity: 1, translateY: 0}}
      transition={{
        opacity: {type: 'timing', duration: 600, easing: 'easeOut'},
        transform: {type: 'timing', duration: 600, easing: 'easeOut'},
      }}
      style={styles.screen}>
      <Pressable onPress={handleBack} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Back</Text>
      </Pressable>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning</Text>
        <Text style={styles.user}>John</Text>
      </View>
      <View style={styles.cards}>
        <MetallicView style={styles.card} borderRadius={16}>
          <Text style={styles.cardTitle}>Dashboard</Text>
          <Text style={styles.cardSub}>3 new notifications</Text>
        </MetallicView>
        <MetallicView style={styles.card} borderRadius={16} delay={650}>
          <Text style={styles.cardTitle}>Projects</Text>
          <Text style={styles.cardSub}>12 active</Text>
        </MetallicView>
        <MetallicView style={styles.card} borderRadius={16} delay={300}>
          <Text style={styles.cardTitle}>Messages</Text>
          <Text style={styles.cardSub}>5 unread</Text>
        </MetallicView>
      </View>
    </EaseView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  backBtn: {
    marginBottom: 20,
  },
  backBtnText: {
    color: colors.textMuted,
    fontSize: 16,
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: colors.textMuted,
  },
  user: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  cards: {
    gap: 14,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  cardSub: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
});

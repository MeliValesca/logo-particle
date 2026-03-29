import React from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation';
import {useParticles} from '../ParticleContext';
import MetallicView from '../common/MetallicView';

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
    <View style={styles.screen}>
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
        <MetallicView style={styles.card} borderRadius={16}>
          <Text style={styles.cardTitle}>Projects</Text>
          <Text style={styles.cardSub}>12 active</Text>
        </MetallicView>
        <MetallicView style={styles.card} borderRadius={16}>
          <Text style={styles.cardTitle}>Messages</Text>
          <Text style={styles.cardSub}>5 unread</Text>
        </MetallicView>
      </View>
    </View>
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
    color: '#6C6C8A',
    fontSize: 16,
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: '#6C6C8A',
  },
  user: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  cards: {
    gap: 14,
  },
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardSub: {
    fontSize: 14,
    color: '#6C6C8A',
    marginTop: 4,
  },
});

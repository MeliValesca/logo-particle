import React, {useState} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import EaseWall from './src/EaseWall';
import ReanimatedWall from './src/ReanimatedWall';

type Tab = 'ease' | 'reanimated';

export default function App() {
  const [tab, setTab] = useState<Tab>('ease');

  return (
    <View style={styles.container}>
      {tab === 'ease' ? <EaseWall /> : <ReanimatedWall />}

      <View style={styles.tabBar}>
        <Pressable
          style={styles.tab}
          onPress={() => setTab('ease')}>
          <Text
            style={[styles.tabLabel, tab === 'ease' && styles.tabLabelActive]}>
            EaseView
          </Text>
          <Text style={styles.tabSub}>Core Animation</Text>
        </Pressable>
        <Pressable
          style={styles.tab}
          onPress={() => setTab('reanimated')}>
          <Text
            style={[
              styles.tabLabel,
              tab === 'reanimated' && styles.tabLabelActive,
            ]}>
            Reanimated
          </Text>
          <Text style={styles.tabSub}>Worklets</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0F0F1A'},
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1A1A2E',
    borderTopWidth: 1,
    borderTopColor: '#2A2A4A',
    paddingBottom: 28,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  tabLabel: {fontSize: 14, fontWeight: '700', color: '#6C6C8A'},
  tabLabelActive: {color: '#6C5CE7'},
  tabSub: {fontSize: 10, color: '#4A4A6A', marginTop: 2},
});

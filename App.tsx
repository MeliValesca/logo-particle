import React from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {ParticleProvider} from './src/ParticleContext';
import ParticleBackground from './src/ParticleBackground';
import Navigation from './src/navigation';
import TouchVisualizer from './src/TouchVisualizer';

export default function App() {
  return (
    <KeyboardProvider>
      <TouchVisualizer>
        <ParticleProvider>
          <View style={styles.container}>
            <ParticleBackground />
            <Navigation />
          </View>
        </ParticleProvider>
      </TouchVisualizer>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08080F',
  },
});

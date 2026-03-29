# Logo Particle Animation

A React Native demo app showcasing animated logo particles, fluid screen transitions, and custom UI components built with **react-native-ease** and **Reanimated**.

## Features

- **Particle Logo** — 662 dots extracted from a PNG logo, animated with EaseView (Core Animation)
- **Splash Screen** — Pulsing particle animation with native bootsplash
- **Screen Transitions** — Dots scatter and reassemble between splash and login screens
- **Login Screen** — Floating inputs above keyboard, metallic card border, 3D button effect
- **Galaxy Explosion** — Particles explode into a star field on login, persisting across navigation
- **MetallicView** — Reusable component with animated shine border effect
- **BubbleTextInput** — Reusable input that floats above keyboard with spring animation
- **EaseGradient** — Fake gradient using stacked Views (no native gradient library needed)

## Stack

- React Native 0.84 (New Architecture / Fabric)
- [react-native-ease](https://github.com/AppAndFlow/react-native-ease) — Core Animation powered animations
- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated) — UI thread animations
- [react-native-keyboard-controller](https://github.com/kirillzyusko/react-native-keyboard-controller) — Frame-accurate keyboard tracking
- [@react-navigation/native-stack](https://reactnavigation.org/) — Screen navigation
- [react-native-bootsplash](https://github.com/zoontek/react-native-bootsplash) — Native splash screen

## Project Structure

```
src/
  common/
    BubbleTextInput.tsx   — Floating input component
    MetallicView.tsx      — Animated metallic border wrapper
    EaseGradient.tsx      — Fake gradient with stacked Views
    OrbitStarView.tsx     — Orbiting star dots component
    colors.ts             — Shared color palette
  screens/
    AuthScreen.tsx        — Login screen with particle animations
    HomeScreen.tsx        — Mock home screen with metallic cards
  data/
    logoPoints.ts         — Pre-extracted dot positions from logo
  ParticleBackground.tsx  — Global particle layer (persists across screens)
  ParticleContext.tsx      — Shared animation state between components
  navigation.tsx          — React Navigation stack setup
  TouchVisualizer.tsx     — Tap indicator for screen recordings
```

## Getting Started

```bash
npm install
cd ios && pod install && cd ..
npx react-native run-ios
```

## Generating Logo Dots

To extract dot positions from a different logo:

```bash
node scripts/extract-dots.mjs
```

This reads `src/assets/logo.png` and outputs `src/data/logoPoints.ts` with normalized coordinates.

## Credits

- [react-native-ease](https://github.com/AppAndFlow/react-native-ease) by [@AppAndFlow](https://github.com/AppAndFlow)
- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated) by [Software Mansion](https://github.com/software-mansion)
- [react-native-keyboard-controller](https://github.com/kirillzyusko/react-native-keyboard-controller) by [@kirillzyusko](https://github.com/kirillzyusko)
- [react-native-bootsplash](https://github.com/zoontek/react-native-bootsplash) by [@zoontek](https://github.com/zoontek)

# react-native-ease Example

A 3D particle cube demo comparing **react-native-ease** (EaseView) against **Reanimated CSS Transitions**.

~2000 particles animated in a wave pattern with spring physics, opacity, scale, rotation, and explode effects.

## The Comparison

**EaseView** runs animations directly on Core Animation (iOS) and ObjectAnimator (Android). Zero JS thread involvement.

**Reanimated CSS Transitions** uses its C++ worklet engine on the UI thread.

Both tabs render the same 3D cube. Toggle **JS Load** to block the JS thread and see how each engine handles it.

## Stack

- React Native 0.84 (New Architecture / Fabric)
- [react-native-ease](https://github.com/AppAndFlow/react-native-ease) by App & Flow
- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated) v4.3

## Getting Started

```bash
npm install
cd ios && pod install && cd ..
yarn ios
```

## Credits

- [react-native-ease](https://github.com/AppAndFlow/react-native-ease) by [@AppAndFlow](https://github.com/AppAndFlow)
- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated) by [Software Mansion](https://github.com/software-mansion)

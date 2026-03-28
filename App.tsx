import React from 'react';
import EaseWall from './src/EaseWall';
import TouchVisualizer from './src/TouchVisualizer';

export default function App() {
  return (
    <TouchVisualizer>
      <EaseWall />
    </TouchVisualizer>
  );
}

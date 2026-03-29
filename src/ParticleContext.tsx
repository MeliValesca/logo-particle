import React, {createContext, useContext, useState, useRef} from 'react';

export type ParticlePhase =
  | 'splash'
  | 'scattering'
  | 'welcome'
  | 'authenticating'
  | 'revealing';

type ParticleContextType = {
  phase: ParticlePhase;
  setPhase: (phase: ParticlePhase) => void;
  wave: number;
  setWave: React.Dispatch<React.SetStateAction<number>>;
  autoRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>;
};

const ParticleContext = createContext<ParticleContextType>({
  phase: 'splash',
  setPhase: () => {},
  wave: 0,
  setWave: () => {},
  autoRef: {current: null},
});

export function ParticleProvider({children}: {children: React.ReactNode}) {
  const [phase, setPhase] = useState<ParticlePhase>('splash');
  const [wave, setWave] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  return (
    <ParticleContext.Provider value={{phase, setPhase, wave, setWave, autoRef}}>
      {children}
    </ParticleContext.Provider>
  );
}

export function useParticles() {
  return useContext(ParticleContext);
}

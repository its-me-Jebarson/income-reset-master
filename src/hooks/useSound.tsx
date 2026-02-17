import { createContext, useContext, useState, type ReactNode } from "react";

interface SoundContextType {
  soundOn: boolean;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType>({ soundOn: true, toggleSound: () => {} });

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundOn, setSoundOn] = useState(() => {
    const stored = localStorage.getItem("kds-sound");
    return stored ? stored === "on" : true;
  });

  const toggleSound = () => {
    setSoundOn(prev => {
      const next = !prev;
      localStorage.setItem("kds-sound", next ? "on" : "off");
      return next;
    });
  };

  return (
    <SoundContext.Provider value={{ soundOn, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);

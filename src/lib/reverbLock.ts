import { useEffect, useState } from "react";

const KEY = "reverb-unlocked";
const EVENT = "reverb-unlocked-change";

export const isUnlocked = (): boolean => {
  try {
    return localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
};

export const setUnlocked = (value: boolean) => {
  try {
    if (value) localStorage.setItem(KEY, "true");
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
};

/** Global unlock state for hidden/unlockable Reverb profiles. */
export const useReverbUnlocked = () => {
  const [unlocked, setState] = useState(false);

  useEffect(() => {
    setState(isUnlocked());
    const sync = () => setState(isUnlocked());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return unlocked;
};

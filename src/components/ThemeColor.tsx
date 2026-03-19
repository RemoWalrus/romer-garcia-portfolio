import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const COLORS = {
  light: '#ffffff',
  dark: '#0a0a0a',
  paradoxxiaYellow: '#ffcc00',
  charGenLight: '#ffffff',
  charGenDark: '#020817',
};

export const ThemeColor = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [paradoxxiaPhase, setParadoxxiaPhase] = useState(0);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Reset phase when leaving Paradoxxia
  useEffect(() => {
    if (location.pathname !== '/paradoxxia') {
      setParadoxxiaPhase(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: Event) => {
      setParadoxxiaPhase((e as CustomEvent<number>).detail);
    };
    window.addEventListener('paradoxxia-phase-change', handler as EventListener);
    return () => window.removeEventListener('paradoxxia-phase-change', handler as EventListener);
  }, []);

  useEffect(() => {
    let color: string;

    if (location.pathname === '/paradoxxia' && (paradoxxiaPhase === 2 || paradoxxiaPhase === 3)) {
      color = COLORS.paradoxxiaYellow;
    } else {
      color = isDark ? COLORS.dark : COLORS.light;
    }

    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = color;
  }, [location.pathname, isDark, paradoxxiaPhase]);

  return null;
};

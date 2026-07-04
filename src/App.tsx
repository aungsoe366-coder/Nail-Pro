import React, { Suspense, useEffect } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';

const AppCore = React.lazy(() => import('./AppCore'));

export default function App() {
  useEffect(() => {
    // Hide the native splash screen as soon as the initial React tree is mounted
    SplashScreen.hide().catch((err) => {
      console.warn('Splash screen hide error (expected in web):', err);
    });

    // Apply saved theme
    const savedTheme = localStorage.getItem('luxury-theme') || 'gold';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Listen for theme changes from other components
    const handleThemeChange = (e: CustomEvent) => {
      const newTheme = e.detail;
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('luxury-theme', newTheme);
    };

    window.addEventListener('theme:change' as any, handleThemeChange);
    return () => {
      window.removeEventListener('theme:change' as any, handleThemeChange);
    };
  }, []);

  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AppCore />
    </Suspense>
  );
}

import React, { Suspense, useEffect } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import ErrorBoundary from './components/ErrorBoundary';

const AppCore = React.lazy(() => import('./AppCore'));

export default function App() {
  useEffect(() => {
    // Hide the native splash screen as soon as the initial React tree is mounted
    try {
      SplashScreen.hide().catch((err) => {
        console.warn('Splash screen hide error (expected in web):', err);
      });
    } catch (e) {
      console.warn('Splash screen synchronous error:', e);
    }

    // Apply saved theme
    try {
      const savedTheme = localStorage.getItem('luxury-theme') || 'gold';
      document.documentElement.setAttribute('data-theme', savedTheme);
    } catch (e) {
      console.warn('Local storage error:', e);
    }

    // Listen for theme changes from other components
    const handleThemeChange = (e: CustomEvent) => {
      try {
        const newTheme = e.detail;
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('luxury-theme', newTheme);
      } catch (err) {
        console.warn('Failed to apply theme:', err);
      }
    };

    window.addEventListener('theme:change' as any, handleThemeChange);
    return () => {
      window.removeEventListener('theme:change' as any, handleThemeChange);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF5F5' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <style>{"@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }"}</style>
        </div>
      }>
        <AppCore />
      </Suspense>
    </ErrorBoundary>
  );
}


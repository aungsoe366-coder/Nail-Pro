import React, { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import AppErrorBoundary from './AppErrorBoundary';

const AppCore = React.lazy(() => import('./AppCore'));

export default function App() {
  return (
    <AppErrorBoundary>
      <HashRouter>
        <Suspense fallback={
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF5F5' }}>
            <div style={{ width: '48px', height: '48px', border: '4px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{"@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }"}</style>
          </div>
        }>
          <AppCore />
        </Suspense>
      </HashRouter>
    </AppErrorBoundary>
  );
}



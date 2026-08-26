import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from "motion/react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong loading the app.</h2>
          <motion.button whileTap={{ scale: 0.97 }} 
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', marginTop: '10px' }}
          >
            Reload App
          </motion.button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;

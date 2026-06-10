import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsed = JSON.parse(this.state.error?.message || "");
        if (parsed.error && parsed.operationType) {
          errorMessage = `Firestore Error: ${parsed.operationType} on ${parsed.path} failed. ${parsed.error}`;
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-[#2d2d2d] p-8 rounded-3xl border border-[#ff4444] w-full max-w-[400px] space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-[#ff4444]/10 rounded-full flex items-center justify-center mx-auto text-[#ff4444]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h2 className="text-[#ff4444] text-xl font-bold">Application Error</h2>
            <p className="text-[#888] text-sm break-words">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-[#ff4444] text-white font-bold py-3 rounded-xl shadow-lg active:scale-[0.98] transition-all"
            >
              RELOAD APP
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

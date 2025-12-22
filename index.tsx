import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Fixed TS error: Properly handle props and state by using a constructor.
 * This ensures that property inheritance from React.Component is correctly 
 * recognized by the TypeScript compiler.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicitly defining the constructor fixes "Property 'props' does not exist" errors
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // Accessing this.state works with the constructor initialized state
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
          <div className="text-center max-w-md bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-red-500">Something went wrong</h2>
            <p className="text-slate-300 mb-6">We're sorry, but the application encountered an unexpected error.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    // Accessing this.props.children now works with explicit inheritance handling
    return this.props.children;
  }
}

// Check for stored theme preference or default to dark
if (typeof document !== 'undefined') {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // Default or explicitly dark
    document.documentElement.classList.add('dark');
  }
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
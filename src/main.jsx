// D.I.K Doctor Portal Main Entry
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application runtime error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
          <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-950/30 p-8 rounded-3xl shadow-xl max-w-md w-full space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center text-xl mx-auto">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h1 className="text-base font-black text-slate-900 dark:text-slate-100">Application Error</h1>
            <p className="text-xs text-slate-500">
              Something went wrong loading the portal. Try clearing browser cache or reset application data.
            </p>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }} 
              className="w-full py-2 bg-red-500 hover:bg-red-650 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              Reset Application Data & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

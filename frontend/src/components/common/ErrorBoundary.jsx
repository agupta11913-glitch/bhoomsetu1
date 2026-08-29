import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('BhoomiSetu Component Error Caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-200">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black text-slate-900">
              {this.props.fallbackTitle || 'Something went wrong while rendering this section.'}
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {this.state.error?.message || 'A runtime rendering error occurred. Please refresh or return to the main dashboard.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-2 transition shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again / Refresh</span>
              </button>
              <a
                href="/"
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

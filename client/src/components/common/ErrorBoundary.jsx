import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-center">
          <div className="bg-white rounded-3xl shadow-sm p-10 max-w-md w-full border border-gray-100">
            <h2 className="font-display text-2xl text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-500 text-sm mb-8">
              We encountered an unexpected error. Please try refreshing the page or navigating back to safety.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()} 
                className="w-full bg-[#1A1A1A] text-white py-3 rounded-full font-medium hover:bg-[#D95D39] transition-colors"
              >
                Refresh Page
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'} 
                className="w-full bg-gray-100 text-gray-900 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

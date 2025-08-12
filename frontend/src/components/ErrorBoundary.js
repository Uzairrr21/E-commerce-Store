import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      error: error.message || error.toString()
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card border-danger">
                <div className="card-header bg-danger text-white">
                  <h2 className="h4 mb-0">
                    <i className="bi bi-exclamation-octagon-fill me-2"></i>
                    Something went wrong
                  </h2>
                </div>
                <div className="card-body">
                  <h3 className="h5 text-danger mb-3">
                    {this.state.error}
                  </h3>
                  
                  {process.env.NODE_ENV === 'development' && (
                    <details className="mb-4">
                      <summary>Error details</summary>
                      <pre className="bg-light p-3 small">
                        {this.state.errorInfo?.componentStack}
                      </pre>
                    </details>
                  )}

                  <div className="d-flex gap-2">
                    <button 
                      onClick={this.handleReset}
                      className="btn btn-primary"
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Try Again
                    </button>
                    
                    <button 
                      onClick={() => window.location.href = '/'}
                      className="btn btn-outline-secondary"
                    >
                      <i className="bi bi-house-door me-2"></i>
                      Return Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher Order Component version for functional components
export const withErrorBoundary = (Component) => (props) => (
  <ErrorBoundary>
    <Component {...props} />
  </ErrorBoundary>
);

export default ErrorBoundary;
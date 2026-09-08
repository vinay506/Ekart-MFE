import React, { Suspense } from 'react';

class RemoteErrorBoundary extends React.Component {
  state = { crashed: false };

  static getDerivedStateFromError() {
    return { crashed: true };
  }

  render() {
    if (this.state.crashed) {
      return this.props.errorFallback || (
        <div style={{ padding: '1rem', color: '#c0392b' }}>
          Remote module failed to load.
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Wraps a lazy-loaded Module Federation component with an error boundary
 * so a crashed remote never takes down the host shell.
 */
const RemoteLoader = ({ component: Component, fallback, errorFallback }) => (
  <RemoteErrorBoundary errorFallback={errorFallback}>
    <Suspense fallback={fallback || <div>Loading remote...</div>}>
      <Component />
    </Suspense>
  </RemoteErrorBoundary>
);

export default RemoteLoader;

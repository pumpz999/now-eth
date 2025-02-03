import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './store/store';
import { ThemeProvider } from './theme/ThemeProvider';
import Layout from './components/layout/Layout';
import { ErrorBoundaryProvider } from './components/ErrorBoundary';
import { useEffect } from 'react';
import { logger } from './utils/logger';
import { performanceMonitor } from './utils/performance';

function App() {
  useEffect(() => {
    // Initialize monitoring
    logger.initialize('YOUR_SENTRY_DSN'); // Replace with actual DSN
    performanceMonitor.startTimer('app-mount');

    return () => {
      performanceMonitor.endTimer('app-mount');
    };
  }, []);

  return (
    <ErrorBoundaryProvider>
      <Provider store={store}>
        <ThemeProvider>
          <Router>
            <Layout />
          </Router>
        </ThemeProvider>
      </Provider>
    </ErrorBoundaryProvider>
  );
}

export default App;

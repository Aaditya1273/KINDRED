import { registerRootComponent } from 'expo';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';

const App = () => (
  <ErrorBoundary>
    <AppNavigator />
  </ErrorBoundary>
);

registerRootComponent(App);

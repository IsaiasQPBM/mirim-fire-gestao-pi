
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import RouteHandler from '@/components/RouteHandler';
import RouterConfig from '@/components/RouterConfig';

function App() {
  return (
    <AuthProvider>
      <Router>
        <RouterConfig>
          <RouteHandler />
        </RouterConfig>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;

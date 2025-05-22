import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteLoggerProps {
  onRouteChange?: (path: string, timestamp: number) => void;
}

/**
 * Component that logs route changes and 404 attempts
 */
const RouteLogger: React.FC<RouteLoggerProps> = ({ onRouteChange }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Get current timestamp
    const timestamp = Date.now();
    
    // Log the route change
    console.log(`Route changed: ${location.pathname} at ${new Date(timestamp).toISOString()}`);
    
    // Check if it's a 404 route (this is a simplified check - in a real app this would be more robust)
    const is404 = document.title.includes('404') || 
                 location.pathname.includes('not-found') || 
                 document.body.textContent?.includes('Página não encontrada');
    
    // Log 404s
    if (is404) {
      console.warn(`404 error encountered: ${location.pathname} at ${new Date(timestamp).toISOString()}`);
      
      // Store in localStorage for analytics
      const notFoundLog = JSON.parse(localStorage.getItem('notFoundLog') || '[]');
      notFoundLog.push({ 
        path: location.pathname, 
        timestamp,
        referrer: document.referrer
      });
      
      // Keep only the last 100 entries to avoid localStorage size issues
      if (notFoundLog.length > 100) {
        notFoundLog.shift();
      }
      
      localStorage.setItem('notFoundLog', JSON.stringify(notFoundLog));
    }
    
    // Call the callback if provided
    if (onRouteChange) {
      onRouteChange(location.pathname, timestamp);
    }
    
    // For development purposes, add a global function to get 404 logs
    if (typeof window !== 'undefined') {
      (window as any).get404Logs = () => {
        return JSON.parse(localStorage.getItem('notFoundLog') || '[]');
      };
    }
  }, [location, onRouteChange]);

  // This component doesn't render anything
  return null;
};

export default RouteLogger;

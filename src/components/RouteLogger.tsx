
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface RouteLoggerProps {
  onRouteChange?: (path: string, timestamp: number) => void;
}

/**
 * Component that logs route changes, 404 attempts and monitors route integrity
 */
const RouteLogger: React.FC<RouteLoggerProps> = ({ onRouteChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

      // If the path is expected to exist but doesn't, try to redirect to the closest matching route
      if (location.pathname.startsWith('/curriculum/')) {
        // Extract the resource type (like 'disciplines', 'classes')
        const segments = location.pathname.split('/');
        if (segments.length >= 3) {
          const resource = segments[2];
          // Check if there's a direct route available
          if (['disciplines', 'classes', 'courses'].includes(resource)) {
            // Redirect to the direct route
            const directPath = `/${resource}`;
            toast({
              title: "Redirecionamento",
              description: `A página não foi encontrada. Redirecionando para ${directPath}`,
              variant: "default",
            });
            setTimeout(() => navigate(directPath), 1500);
          }
        }
      }
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
      
      // Add a function to clear 404 logs
      (window as any).clear404Logs = () => {
        localStorage.setItem('notFoundLog', JSON.stringify([]));
        return "404 logs cleared";
      };
    }
  }, [location, onRouteChange, navigate, toast]);

  // This component doesn't render anything
  return null;
};

export default RouteLogger;

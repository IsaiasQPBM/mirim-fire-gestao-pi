
import React from 'react';
import { cn } from '@/lib/utils';
import { getTimelineEventsByStudentId } from '@/data/studentTypes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar,
  FileText,
  Bell,
  CheckCircle,
  Activity,
  MessageSquare,
  FileEdit,
  Trophy
} from 'lucide-react';

interface TimelineProps {
  studentId: string;
}

const Timeline: React.FC<TimelineProps> = ({ studentId }) => {
  const events = getTimelineEventsByStudentId(studentId);
  
  if (events.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Nenhum evento na linha do tempo.
      </div>
    );
  }
  
  // Sort events by date (newest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'academic':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'attendance':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'observation':
        return <FileEdit className="h-5 w-5 text-amber-500" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-purple-500" />;
      case 'communication':
        return <MessageSquare className="h-5 w-5 text-indigo-500" />;
      case 'administrative':
        return <Bell className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getEventColor = (type: string) => {
    switch(type) {
      case 'academic':
        return 'border-blue-200 bg-blue-50';
      case 'attendance':
        return 'border-green-200 bg-green-50';
      case 'observation':
        return 'border-amber-200 bg-amber-50';
      case 'achievement':
        return 'border-purple-200 bg-purple-50';
      case 'communication':
        return 'border-indigo-200 bg-indigo-50';
      case 'administrative':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="relative space-y-6">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      {sortedEvents.map((event, index) => (
        <div key={event.id} className="relative flex items-start gap-4 ml-2">
          <div className={cn(
            "z-10 w-10 h-10 rounded-full flex items-center justify-center border-2",
            getEventColor(event.type)
          )}>
            {getEventIcon(event.type)}
          </div>
          
          <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-start justify-between">
              <h4 className="font-medium">{event.title}</h4>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar size={12} className="mr-1" />
                {formatDate(event.date)}
              </div>
            </div>
            <p className="mt-2 text-gray-700">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;

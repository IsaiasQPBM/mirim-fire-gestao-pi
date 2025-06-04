
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  event_type: 'lesson' | 'exam' | 'event';
  description?: string;
}

interface CalendarViewProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateSelect,
  events,
  onEventClick
}) => {
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'lesson':
        return 'bg-blue-500';
      case 'exam':
        return 'bg-red-500';
      case 'event':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-cbmepi-black">
              <CalendarIcon className="mr-2 h-5 w-5 text-cbmepi-orange" />
              Calendário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-cbmepi-black">
              {selectedDate ? (
                <>Eventos - {selectedDate.toLocaleDateString('pt-BR')}</>
              ) : (
                'Selecione uma data'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge className={`${getEventTypeColor(event.event_type)} text-white text-xs`}>
                        {event.event_type === 'lesson' ? 'Aula' : 
                         event.event_type === 'exam' ? 'Avaliação' : 'Evento'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(event.start_date).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    {event.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">
                {selectedDate ? 'Nenhum evento nesta data' : 'Selecione uma data para ver os eventos'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import EventDialog from '@/components/calendar/EventDialog';
import CalendarView from '@/components/calendar/CalendarView';
import EventFilters from '@/components/calendar/EventFilters';
import { calendarService } from '@/services/calendarService';
import { useToast } from '@/hooks/use-toast';

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      navigate('/');
      return;
    }
    fetchEvents();
  }, [navigate]);

  useEffect(() => {
    if (eventTypeFilter === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.event_type === eventTypeFilter));
    }
  }, [events, eventTypeFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await calendarService.getEvents();
      setEvents(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar eventos',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const eventCounts = {
    total: events.length,
    lessons: events.filter(e => e.event_type === 'lesson').length,
    exams: events.filter(e => e.event_type === 'exam').length,
    events: events.filter(e => e.event_type === 'event').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-cbmepi-black">Calendário de Eventos</h1>
          <EventDialog selectedDate={selectedDate} onEventCreated={fetchEvents} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <CalendarView
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              events={filteredEvents}
            />
          </div>
          
          <div>
            <EventFilters
              eventTypeFilter={eventTypeFilter}
              onEventTypeFilterChange={setEventTypeFilter}
              eventCounts={eventCounts}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calendar;

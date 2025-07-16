
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import EventModal from '@/components/calendar/EventModal';
import { toast } from '@/hooks/use-toast';
import { CalendarDays, Plus, BookOpen, PenLine, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarEvent } from '@/data/curriculumTypes';
import { calendarService } from '@/services/api';

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
    
    // Buscar eventos reais do Supabase
    calendarService.getAll()
      .then(data => setEvents(data))
      .catch(() => setEvents([]));
  }, [navigate]);

  // Update selectedDateEvents when date or events change
  useEffect(() => {
    if (!date || !events.length) return;

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.startDate);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === selectedDate.getTime();
    });

    setSelectedDateEvents(filteredEvents);
  }, [date, events]);

  const handleSaveEvent = (newEvent: CalendarEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  // Function to get dates with events as a Set (for the modifiers)
  const getEventDates = () => {
    const eventDates = events.map(event => {
      const date = new Date(event.startDate);
      // Reset time part for comparison
      date.setHours(0, 0, 0, 0);
      return date;
    });
    return eventDates;
  };

  // Create a modifier for days that have events
  const modifiers = {
    hasEvent: getEventDates(),
  };

  // Create styles for the modifiers to highlight days with events
  const modifiersStyles = {
    hasEvent: { 
      fontWeight: 'bold',
      textDecoration: 'underline',
      backgroundColor: 'rgba(255, 87, 34, 0.1)' // Slight orange background
    }
  };

  // Function to get badge color based on event type
  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'lesson':
        return 'bg-blue-500';
      case 'exam':
        return 'bg-red-500';
      case 'event':
        return 'bg-green-500';
      default:
        return '';
    }
  };

  // Function to get event icon based on type
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return <BookOpen className="h-4 w-4" />;
      case 'exam':
        return <PenLine className="h-4 w-4" />;
      case 'event':
        return <CalendarIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const isAdmin = userRole === 'admin' || userRole === 'instructor';

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title="Calendário Acadêmico" 
        userRole={userRole} 
        userName={userName} 
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <CalendarDays className="h-6 w-6 text-cbmepi-red mr-2" />
              <h1 className="text-2xl font-bold text-cbmepi-black">Calendário Acadêmico</h1>
            </div>
            
            {isAdmin && (
              <Button 
                onClick={() => setIsEventModalOpen(true)}
                className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Evento
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Selecione uma Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    className="rounded-md border"
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                  />
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                      <span className="text-sm text-gray-600">Aulas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                      <span className="text-sm text-gray-600">Avaliações</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                      <span className="text-sm text-gray-600">Eventos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="border border-gray-200 shadow-sm h-full">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Eventos em {date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum evento</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Não há eventos programados para esta data.
                      </p>
                      {isAdmin && (
                        <div className="mt-6">
                          <Button 
                            className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Evento
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Tabs defaultValue="all">
                        <TabsList>
                          <TabsTrigger value="all">Todos</TabsTrigger>
                          <TabsTrigger value="lesson">Aulas</TabsTrigger>
                          <TabsTrigger value="exam">Avaliações</TabsTrigger>
                          <TabsTrigger value="event">Eventos</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="all" className="space-y-4 mt-4">
                          {selectedDateEvents.map(event => (
                            <div 
                              key={event.id}
                              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-3">
                                  <div className={`p-2 rounded-lg ${getEventBadgeColor(event.type)} text-white`}>
                                    {getEventIcon(event.type)}
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                                    <p className="text-sm text-gray-600">{event.description}</p>
                                  </div>
                                </div>
                                
                                <Badge className={getEventBadgeColor(event.type)}>
                                  {event.type === 'lesson' ? 'Aula' : 
                                   event.type === 'exam' ? 'Avaliação' : 'Evento'}
                                </Badge>
                              </div>
                              
                              <div className="mt-3 pl-10 text-sm text-gray-500">
                                Horário: {new Date(event.startDate).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})} - 
                                {new Date(event.endDate).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                              </div>
                              
                              {(event.classId || event.disciplineId) && (
                                <div className="mt-1 pl-10">
                                  <Badge variant="outline" className="mr-2">
                                    {event.classId ? 'Turma' : ''}
                                  </Badge>
                                  <Badge variant="outline">
                                    {event.disciplineId ? 'Disciplina' : ''}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          ))}
                        </TabsContent>
                        
                        <TabsContent value="lesson" className="space-y-4 mt-4">
                          {selectedDateEvents
                            .filter(event => event.type === 'lesson')
                            .map(event => (
                              <div 
                                key={event.id}
                                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start space-x-3">
                                    <div className="p-2 rounded-lg bg-blue-500 text-white">
                                      <BookOpen className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                                      <p className="text-sm text-gray-600">{event.description}</p>
                                    </div>
                                  </div>
                                  <Badge className="bg-blue-500">Aula</Badge>
                                </div>
                                <div className="mt-3 pl-10 text-sm text-gray-500">
                                  Horário: {new Date(event.startDate).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})} - 
                                  {new Date(event.endDate).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                                </div>
                              </div>
                          ))}
                        </TabsContent>
                        
                        <TabsContent value="exam" className="space-y-4 mt-4">
                          {selectedDateEvents
                            .filter(event => event.type === 'exam')
                            .map(event => (
                              <div 
                                key={event.id}
                                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start space-x-3">
                                    <div className="p-2 rounded-lg bg-red-500 text-white">
                                      <PenLine className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                                      <p className="text-sm text-gray-600">{event.description}</p>
                                    </div>
                                  </div>
                                  <Badge className="bg-red-500">Avaliação</Badge>
                                </div>
                                <div className="mt-3 pl-10 text-sm text-gray-500">
                                  Horário: {new Date(event.startDate).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})} - 
                                  {new Date(event.endDate).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                                </div>
                              </div>
                          ))}
                        </TabsContent>
                        
                        <TabsContent value="event" className="space-y-4 mt-4">
                          {selectedDateEvents
                            .filter(event => event.type === 'event')
                            .map(event => (
                              <div 
                                key={event.id}
                                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start space-x-3">
                                    <div className="p-2 rounded-lg bg-green-500 text-white">
                                      <CalendarIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                                      <p className="text-sm text-gray-600">{event.description}</p>
                                    </div>
                                  </div>
                                  <Badge className="bg-green-500">Evento</Badge>
                                </div>
                                <div className="mt-3 pl-10 text-sm text-gray-500">
                                  Horário: {new Date(event.startDate).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})} - 
                                  {new Date(event.endDate).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                                </div>
                              </div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        selectedDate={date}
      />
    </div>
  );
};

export default Calendar;

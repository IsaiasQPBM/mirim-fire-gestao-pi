
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Download, 
  FileText,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import Header from '@/components/Header';
import { getStudentById } from '@/data/studentTypes';
import { useToast } from '@/hooks/use-toast';
import { PDFService } from '@/components/PDFService';

const StudentSchedule: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(0);
  
  const userRole = localStorage.getItem('userRole') as 'admin' | 'instructor' | 'student' || 'student';
  const userName = localStorage.getItem('userName') || '';

  useEffect(() => {
    if (id) {
      const foundStudent = getStudentById(id);
      setStudent(foundStudent);
      setLoading(false);
    }
  }, [id]);

  // Mock schedule data
  const weeklySchedule = [
    {
      day: 'Segunda-feira',
      classes: [
        {
          time: '08:00 - 10:00',
          subject: 'Técnicas de Resgate e Salvamento',
          instructor: 'Maria Oliveira',
          room: 'Sala 101',
          type: 'Teoria'
        },
        {
          time: '10:30 - 12:00',
          subject: 'Educação Física',
          instructor: 'Carlos Santos',
          room: 'Quadra',
          type: 'Prática'
        }
      ]
    },
    {
      day: 'Terça-feira',
      classes: [
        {
          time: '08:00 - 09:30',
          subject: 'Primeiros Socorros',
          instructor: 'Pedro Santos',
          room: 'Laboratório',
          type: 'Prática'
        },
        {
          time: '10:00 - 11:30',
          subject: 'Prevenção de Incêndios',
          instructor: 'Ana Costa',
          room: 'Sala 102',
          type: 'Teoria'
        }
      ]
    },
    {
      day: 'Quarta-feira',
      classes: [
        {
          time: '08:00 - 10:00',
          subject: 'Técnicas de Resgate e Salvamento',
          instructor: 'Maria Oliveira',
          room: 'Campo de Treinamento',
          type: 'Prática'
        }
      ]
    },
    {
      day: 'Quinta-feira',
      classes: [
        {
          time: '08:00 - 09:30',
          subject: 'Primeiros Socorros',
          instructor: 'Pedro Santos',
          room: 'Sala 101',
          type: 'Teoria'
        },
        {
          time: '10:00 - 12:00',
          subject: 'Simulação de Emergências',
          instructor: 'Maria Oliveira',
          room: 'Campo de Treinamento',
          type: 'Prática'
        }
      ]
    },
    {
      day: 'Sexta-feira',
      classes: [
        {
          time: '08:00 - 10:00',
          subject: 'Avaliação Prática',
          instructor: 'Equipe Docente',
          room: 'Campo de Treinamento',
          type: 'Avaliação'
        }
      ]
    }
  ];

  const upcomingEvents = [
    {
      date: '2024-02-15',
      title: 'Simulação de Resgate',
      time: '14:00 - 17:00',
      location: 'Campo de Treinamento',
      type: 'Prática'
    },
    {
      date: '2024-02-20',
      title: 'Prova Final - Primeiros Socorros',
      time: '08:00 - 10:00',
      location: 'Sala 101',
      type: 'Avaliação'
    },
    {
      date: '2024-02-25',
      title: 'Cerimônia de Formatura',
      time: '19:00 - 21:00',
      location: 'Auditório',
      type: 'Evento'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Teoria':
        return 'bg-blue-100 text-blue-800';
      case 'Prática':
        return 'bg-green-100 text-green-800';
      case 'Avaliação':
        return 'bg-red-100 text-red-800';
      case 'Evento':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportPDF = () => {
    // Mock PDF export for schedule
    const scheduleData = {
      studentName: student?.fullName,
      schedule: weeklySchedule,
      events: upcomingEvents
    };

    console.log('Exporting schedule PDF:', scheduleData);
    
    toast({
      title: "PDF exportado",
      description: "O cronograma foi gerado com sucesso.",
    });
  };

  const handleExportExcel = () => {
    // Mock Excel export for schedule
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Dia,Horário,Disciplina,Instrutor,Local,Tipo\n" +
      weeklySchedule.map(day => 
        day.classes.map(cls => 
          `${day.day},${cls.time},${cls.subject},${cls.instructor},${cls.room},${cls.type}`
        ).join('\n')
      ).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cronograma_${student?.fullName || 'aluno'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Excel exportado",
      description: "O arquivo de cronograma foi baixado com sucesso.",
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cbmepi-orange"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6">
        <Header title="Cronograma do Aluno" userRole={userRole} userName={userName} />
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-red-600">Aluno não encontrado</h2>
          <Button 
            className="mt-4 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            onClick={() => navigate('/students')}
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title="Cronograma do Aluno" userRole={userRole} userName={userName} />
      
      <div className="max-w-7xl mx-auto mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/students/${id}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Voltar ao Perfil
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-cbmepi-black">{student.fullName}</h1>
              <p className="text-gray-600">Cronograma de Aulas</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportExcel}>
              <Download size={16} className="mr-2" />
              Excel
            </Button>
            <Button 
              onClick={handleExportPDF}
              className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            >
              <FileText size={16} className="mr-2" />
              PDF
            </Button>
          </div>
        </div>

        <Tabs defaultValue="weekly" className="space-y-6">
          <TabsList>
            <TabsTrigger value="weekly">Cronograma Semanal</TabsTrigger>
            <TabsTrigger value="upcoming">Próximos Eventos</TabsTrigger>
            <TabsTrigger value="calendar">Visão Mensal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {weeklySchedule.map((day, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar size={18} className="text-cbmepi-orange" />
                      {day.day}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {day.classes.length > 0 ? (
                      <div className="space-y-4">
                        {day.classes.map((cls, clsIndex) => (
                          <div key={clsIndex} className="p-3 border rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={getTypeColor(cls.type)}>
                                {cls.type}
                              </Badge>
                              <span className="text-sm text-gray-600 flex items-center gap-1">
                                <Clock size={14} />
                                {cls.time}
                              </span>
                            </div>
                            <h4 className="font-medium text-sm mb-1">{cls.subject}</h4>
                            <div className="space-y-1 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <User size={12} />
                                {cls.instructor}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin size={12} />
                                {cls.room}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">Sem aulas programadas</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                      <div className="w-12 h-12 bg-cbmepi-orange rounded-lg flex items-center justify-center text-white font-bold">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <Badge className={getTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Visão Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-100 rounded">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, index) => {
                    const day = index - 6; // Start from a Monday
                    const isCurrentMonth = day > 0 && day <= 31;
                    const hasClass = isCurrentMonth && [1, 2, 3, 4, 5, 8, 9, 10, 11, 12].includes(day);
                    const hasEvent = isCurrentMonth && [15, 20, 25].includes(day);
                    
                    return (
                      <div 
                        key={index} 
                        className={`
                          p-2 h-16 border rounded text-center text-sm
                          ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                          ${hasClass ? 'border-cbmepi-orange bg-orange-50' : ''}
                          ${hasEvent ? 'border-purple-500 bg-purple-50' : ''}
                        `}
                      >
                        {isCurrentMonth && (
                          <>
                            <div className="font-medium">{day}</div>
                            {hasClass && (
                              <div className="w-2 h-2 bg-cbmepi-orange rounded-full mx-auto mt-1"></div>
                            )}
                            {hasEvent && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto mt-1"></div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-cbmepi-orange rounded-full"></div>
                    <span>Aulas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Eventos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentSchedule;

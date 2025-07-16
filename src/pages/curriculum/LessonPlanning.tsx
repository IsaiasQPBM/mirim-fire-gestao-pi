
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import LessonModal from '@/components/lessons/LessonModal';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Calendar, Clock, Plus, Edit, Eye, Save, Search } from 'lucide-react';

const LessonPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [lessons, setLessons] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
    
    // Load mock lessons
    setLessons([
      {
        id: 'lesson-1',
        title: 'Introdução aos Primeiros Socorros',
        description: 'Conceitos básicos de primeiros socorros',
        content: 'Aula teórica sobre os fundamentos dos primeiros socorros...',
        classId: 'class-1',
        disciplineId: 'disc-1',
        lessonDate: '2024-07-01',
        startTime: '08:00',
        endTime: '10:00',
        status: 'planned',
        resources: ['Projetor', 'Boneco de treino'],
      },
      {
        id: 'lesson-2',
        title: 'Prevenção de Incêndios',
        description: 'Técnicas de prevenção e combate a incêndios',
        content: 'Aula prática sobre uso de extintores...',
        classId: 'class-2',
        disciplineId: 'disc-2',
        lessonDate: '2024-07-02',
        startTime: '14:00',
        endTime: '16:00',
        status: 'completed',
        resources: ['Extintores', 'Área de treino'],
      },
    ]);
  }, [navigate]);

  const handleCreateLesson = () => {
    setModalMode('create');
    setSelectedLesson(null);
    setIsLessonModalOpen(true);
  };

  const handleEditLesson = (lesson: any) => {
    setModalMode('edit');
    setSelectedLesson(lesson);
    setIsLessonModalOpen(true);
  };

  const handleViewDetails = (lesson: any) => {
    toast({
      title: "Detalhes da Aula",
      description: `Visualizando: ${lesson.title}`,
    });
    // Here you could open a detailed view modal
  };

  const handleSaveLesson = (lessonData: any) => {
    if (modalMode === 'create') {
      setLessons(prev => [...prev, lessonData]);
    } else {
      setLessons(prev => prev.map(l => l.id === lessonData.id ? lessonData : l));
    }
  };

  const handleSavePlanning = () => {
    toast({
      title: "Planejamento salvo",
      description: "O planejamento de aulas foi salvo com sucesso.",
    });
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || lesson.classId === filterClass;
    return matchesSearch && matchesClass;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge className="bg-blue-100 text-blue-800">Planejada</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800">Em Andamento</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluída</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Indefinido</Badge>;
    }
  };

  const isAdmin = userRole === 'admin' || userRole === 'instructor';

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title="Planejamento de Aulas" 
        userRole={userRole} 
        userName={userName} 
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-cbmepi-red mr-2" />
              <h1 className="text-2xl font-bold text-cbmepi-black">Planejamento de Aulas</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <>
                  <Button 
                    onClick={handleSavePlanning}
                    variant="outline"
                    className="border-cbmepi-orange text-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Planejamento
                  </Button>
                  <Button 
                    onClick={handleCreateLesson}
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Aula
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar aulas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrar por turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Turmas</SelectItem>
                    <SelectItem value="class-1">Turma A - Manhã</SelectItem>
                    <SelectItem value="class-2">Turma B - Tarde</SelectItem>
                    <SelectItem value="class-3">Turma C - Noite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lessons List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLessons.map(lesson => (
              <Card key={lesson.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    {getStatusBadge(lesson.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{lesson.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(lesson.lessonDate).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      {lesson.startTime} - {lesson.endTime}
                    </div>
                  </div>
                  
                  {lesson.resources && lesson.resources.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {lesson.resources.map((resource: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(lesson)}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Ver Detalhes
                    </Button>
                    
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditLesson(lesson)}
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Editar Plano
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredLessons.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma aula encontrada</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterClass !== 'all' 
                    ? 'Nenhuma aula corresponde aos filtros aplicados.' 
                    : 'Nenhuma aula foi planejada ainda.'}
                </p>
                {isAdmin && (
                  <Button 
                    onClick={handleCreateLesson}
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeira Aula
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Lesson Modal */}
      <LessonModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onSave={handleSaveLesson}
        mode={modalMode}
        lessonData={selectedLesson}
      />
    </div>
  );
};

export default LessonPlanning;

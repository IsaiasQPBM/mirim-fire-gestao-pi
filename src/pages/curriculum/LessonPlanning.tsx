import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import { toast } from '@/hooks/use-toast';
import { PenLine, Plus, Search, Calendar, Clock, BookOpen } from 'lucide-react';
import { mockLessons, mockClasses, mockDisciplines } from '@/data/mockCurriculumData';

const LessonPlanning: React.FC = () => {
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [lessons, setLessons] = useState<any[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Check if user is logged in
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/');
      return;
    }

    // Only admin and instructors can access this page
    if (storedUserRole !== 'admin' && storedUserRole !== 'instructor') {
      navigate('/dashboard');
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar o planejamento de aulas",
        variant: "destructive"
      });
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
    
    // Enhance lessons with class and discipline information
    const enhancedLessons = mockLessons.map(lesson => {
      const classInfo = mockClasses.find(c => c.id === lesson.classId);
      const disciplineInfo = mockDisciplines.find(d => d.id === lesson.disciplineId);
      
      return {
        ...lesson,
        className: classInfo?.name || 'Turma desconhecida',
        disciplineName: disciplineInfo?.name || 'Disciplina desconhecida',
      };
    });
    
    setLessons(enhancedLessons);
    setFilteredLessons(enhancedLessons);
  }, [navigate]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLessons(lessons);
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    const filtered = lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(lowerCaseQuery) ||
      lesson.description.toLowerCase().includes(lowerCaseQuery) ||
      lesson.className.toLowerCase().includes(lowerCaseQuery) ||
      lesson.disciplineName.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredLessons(filtered);
  }, [searchQuery, lessons]);

  const getLessonStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge className="bg-blue-500">Planejada</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Concluída</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelada</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <PenLine className="h-6 w-6 text-cbmepi-red" />
              <h1 className="text-2xl font-bold text-cbmepi-black">Planejamento de Aulas</h1>
            </div>
            
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Pesquisar aulas..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button 
                className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Aula
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="upcoming">Próximas Aulas</TabsTrigger>
              <TabsTrigger value="completed">Aulas Concluídas</TabsTrigger>
              <TabsTrigger value="planning">Criar Planejamento</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons
                  .filter(lesson => lesson.status === 'planned')
                  .map(lesson => (
                    <Card 
                      key={lesson.id}
                      className="border border-gray-200 shadow-sm"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{lesson.title}</CardTitle>
                            <div className="text-sm text-gray-500">{lesson.disciplineName}</div>
                          </div>
                          {getLessonStatusBadge(lesson.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{lesson.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{new Date(lesson.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{lesson.startTime} - {lesson.endTime}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{lesson.className}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-cbmepi-orange border-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
                          >
                            Editar Plano
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                
                {filteredLessons.filter(lesson => lesson.status === 'planned').length === 0 && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 bg-white rounded-lg shadow">
                    <PenLine className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma aula planejada</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchQuery ? `Não foram encontradas aulas com "${searchQuery}".` : 'Não há aulas planejadas no momento.'}
                    </p>
                    <div className="mt-6">
                      <Button 
                        className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Planejar Aula
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons
                  .filter(lesson => lesson.status === 'completed')
                  .map(lesson => (
                    <Card 
                      key={lesson.id}
                      className="border border-gray-200 shadow-sm"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{lesson.title}</CardTitle>
                            <div className="text-sm text-gray-500">{lesson.disciplineName}</div>
                          </div>
                          {getLessonStatusBadge(lesson.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{lesson.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{new Date(lesson.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{lesson.startTime} - {lesson.endTime}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{lesson.className}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            Ver Detalhes
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                
                {filteredLessons.filter(lesson => lesson.status === 'completed').length === 0 && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 bg-white rounded-lg shadow">
                    <PenLine className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma aula concluída</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchQuery ? `Não foram encontradas aulas com "${searchQuery}".` : 'Não há aulas concluídas registradas no sistema.'}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="planning" className="space-y-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Criar Novo Plano de Aula</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Título da Aula
                      </label>
                      <Input id="title" placeholder="Ex: Introdução à Prevenção de Incêndios" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                          Turma
                        </label>
                        <select
                          id="class"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cbmepi-orange"
                        >
                          <option value="">Selecione uma turma</option>
                          {mockClasses.map(classItem => (
                            <option key={classItem.id} value={classItem.id}>
                              {classItem.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="discipline" className="block text-sm font-medium text-gray-700 mb-1">
                          Disciplina
                        </label>
                        <select
                          id="discipline"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cbmepi-orange"
                        >
                          <option value="">Selecione uma disciplina</option>
                          {mockDisciplines.map(discipline => (
                            <option key={discipline.id} value={discipline.id}>
                              {discipline.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                          Data
                        </label>
                        <Input id="date" type="date" />
                      </div>
                      
                      <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                          Hora de Início
                        </label>
                        <Input id="startTime" type="time" />
                      </div>
                      
                      <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                          Hora de Término
                        </label>
                        <Input id="endTime" type="time" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição da Aula
                      </label>
                      <Textarea
                        id="description"
                        placeholder="Descreva o conteúdo e objetivos da aula"
                        className="min-h-24 resize-y"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Conteúdo Programático
                      </label>
                      <Textarea
                        id="content"
                        placeholder="Detalhe os tópicos que serão abordados na aula"
                        className="min-h-32 resize-y"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="resources" className="block text-sm font-medium text-gray-700 mb-1">
                        Recursos Necessários
                      </label>
                      <Textarea
                        id="resources"
                        placeholder="Liste os materiais e recursos necessários para a aula"
                        className="min-h-24 resize-y"
                      />
                    </div>
                    
                    <div className="pt-4 flex justify-end space-x-3">
                      <Button 
                        type="button" 
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="button" 
                        className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                      >
                        Salvar Planejamento
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default LessonPlanning;

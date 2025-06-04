import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import { toast } from '@/hooks/use-toast';
import { PenLine, Plus, Search, Calendar, Clock, BookOpen } from 'lucide-react';
import { lessonsService, Lesson } from '@/services/lessonsService';
import { mockClasses, mockDisciplines } from '@/data/mockCurriculumData';
import LessonDialog from '@/components/lessons/LessonDialog';

const LessonPlanning: React.FC = () => {
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [lessons, setLessons] = useState<any[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'edit' | 'view'>('edit');
  const [loading, setLoading] = useState(true);
  
  // Form state for creating new lessons
  const [formData, setFormData] = useState<Partial<Lesson>>({
    title: '',
    description: '',
    lesson_date: '',
    start_time: '',
    end_time: '',
    class_id: '',
    discipline_id: '',
    content: '',
    resources: [],
    status: 'planned'
  });
  
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
    
    fetchLessons();
  }, [navigate]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await lessonsService.getLessons();
      setLessons(data);
      setFilteredLessons(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar aulas',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLessons(lessons);
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    const filtered = lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(lowerCaseQuery) ||
      lesson.description?.toLowerCase().includes(lowerCaseQuery) ||
      lesson.classes?.name.toLowerCase().includes(lowerCaseQuery) ||
      lesson.disciplines?.name.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredLessons(filtered);
  }, [searchQuery, lessons]);

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await lessonsService.createLesson(formData as Lesson);
      toast({
        title: 'Aula criada',
        description: 'O planejamento foi salvo com sucesso!',
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        lesson_date: '',
        start_time: '',
        end_time: '',
        class_id: '',
        discipline_id: '',
        content: '',
        resources: [],
        status: 'planned'
      });
      
      fetchLessons();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar aula',
        description: error.message,
      });
    }
  };

  const handleEditLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleViewLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setDialogMode('view');
    setDialogOpen(true);
  };

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
                            <div className="text-sm text-gray-500">{lesson.disciplines?.name}</div>
                          </div>
                          {getLessonStatusBadge(lesson.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{lesson.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{new Date(lesson.lesson_date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{lesson.start_time} - {lesson.end_time}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{lesson.classes?.name}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-cbmepi-orange border-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
                            onClick={() => handleEditLesson(lesson)}
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
                            <div className="text-sm text-gray-500">{lesson.disciplines?.name}</div>
                          </div>
                          {getLessonStatusBadge(lesson.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{lesson.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{new Date(lesson.lesson_date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{lesson.start_time} - {lesson.end_time}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{lesson.classes?.name}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewLesson(lesson)}
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
                  <form onSubmit={handleCreateLesson} className="space-y-6">
                    <div>
                      <Label htmlFor="title">Título da Aula</Label>
                      <Input 
                        id="title" 
                        placeholder="Ex: Introdução à Prevenção de Incêndios"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="class_id">Turma</Label>
                        <Select
                          value={formData.class_id}
                          onValueChange={(value) => setFormData({ ...formData, class_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma turma" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockClasses.map(classItem => (
                              <SelectItem key={classItem.id} value={classItem.id}>
                                {classItem.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="discipline_id">Disciplina</Label>
                        <Select
                          value={formData.discipline_id}
                          onValueChange={(value) => setFormData({ ...formData, discipline_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma disciplina" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockDisciplines.map(discipline => (
                              <SelectItem key={discipline.id} value={discipline.id}>
                                {discipline.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="lesson_date">Data</Label>
                        <Input 
                          id="lesson_date" 
                          type="date"
                          value={formData.lesson_date}
                          onChange={(e) => setFormData({ ...formData, lesson_date: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="start_time">Hora de Início</Label>
                        <Input 
                          id="start_time" 
                          type="time"
                          value={formData.start_time}
                          onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="end_time">Hora de Término</Label>
                        <Input 
                          id="end_time" 
                          type="time"
                          value={formData.end_time}
                          onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Descrição da Aula</Label>
                      <Textarea
                        id="description"
                        placeholder="Descreva o conteúdo e objetivos da aula"
                        className="min-h-24 resize-y"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">Conteúdo Programático</Label>
                      <Textarea
                        id="content"
                        placeholder="Detalhe os tópicos que serão abordados na aula"
                        className="min-h-32 resize-y"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="resources">Recursos Necessários</Label>
                      <Textarea
                        id="resources"
                        placeholder="Liste os materiais e recursos necessários para a aula (um por linha)"
                        className="min-h-24 resize-y"
                        value={formData.resources?.join('\n') || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          resources: e.target.value.split('\n').filter(r => r.trim()) 
                        })}
                      />
                    </div>
                    
                    <div className="pt-4 flex justify-end space-x-3">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setFormData({
                          title: '',
                          description: '',
                          lesson_date: '',
                          start_time: '',
                          end_time: '',
                          class_id: '',
                          discipline_id: '',
                          content: '',
                          resources: [],
                          status: 'planned'
                        })}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                      >
                        Salvar Planejamento
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <LessonDialog
        lesson={selectedLesson}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onLessonUpdated={fetchLessons}
        mode={dialogMode}
      />
    </div>
  );
};

export default LessonPlanning;

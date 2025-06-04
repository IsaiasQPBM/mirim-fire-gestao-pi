
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import LessonCard from '@/components/lessons/LessonCard';
import LessonPlanningForm from '@/components/lessons/LessonPlanningForm';
import LessonDialog from '@/components/lessons/LessonDialog';
import { useToast } from '@/hooks/use-toast';
import { PenLine, Plus, Search } from 'lucide-react';
import { lessonsService, Lesson } from '@/services/lessonsService';

const LessonPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userRole, setUserRole] = useState<string>('');
  const [lessons, setLessons] = useState<any[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'edit' | 'view'>('edit');
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  
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
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/');
      return;
    }

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
    fetchLessons();
  }, [navigate, toast]);

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

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await lessonsService.getLessons();
      setLessons(data);
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

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setFormLoading(true);
      await lessonsService.createLesson(formData as Lesson);
      toast({
        title: 'Aula criada',
        description: 'O planejamento foi salvo com sucesso!',
      });
      
      resetForm();
      fetchLessons();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar aula',
        description: error.message,
      });
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex items-center space-x-2">
            <PenLine className="h-6 w-6 text-cbmepi-red" />
            <h1 className="text-2xl font-bold text-cbmepi-black">Planejamento de Aulas</h1>
          </div>
          
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
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onEdit={handleEditLesson}
                    onView={handleViewLesson}
                  />
                ))}
              
              {filteredLessons.filter(lesson => lesson.status === 'planned').length === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 bg-white rounded-lg shadow">
                  <PenLine className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma aula planejada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery ? `Não foram encontradas aulas com "${searchQuery}".` : 'Não há aulas planejadas no momento.'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons
                .filter(lesson => lesson.status === 'completed')
                .map(lesson => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onEdit={handleEditLesson}
                    onView={handleViewLesson}
                  />
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
            <LessonPlanningForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateLesson}
              onCancel={resetForm}
              loading={formLoading}
            />
          </TabsContent>
        </Tabs>
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

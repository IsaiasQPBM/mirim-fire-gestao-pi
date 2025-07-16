
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListOrdered, ChevronDown, ChevronRight, Clock, Search } from 'lucide-react';
import { courseService, disciplineService } from '@/services/api';
import { Input } from '@/components/ui/input';

interface CurriculumItem {
  courseId: string;
  courseName: string;
  totalHours: number;
  isActive: boolean;
  disciplines: {
    id: string;
    name: string;
    theoryHours: number;
    practiceHours: number;
    totalHours: number;
    isActive: boolean;
  }[];
}

const CurriculumView: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCurriculum, setFilteredCurriculum] = useState<CurriculumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

    // Buscar cursos e disciplinas do Supabase
    setLoading(true);
    setError(null);
    Promise.all([courseService.getAll(), disciplineService.getAll()])
      .then(([courses, disciplines]) => {
        // Montar currículo
        const curriculumData: CurriculumItem[] = courses.map((course: any) => {
          const courseDisciplines = disciplines.filter((d: any) => d.course_id === course.id);
          const formattedDisciplines = courseDisciplines.map((discipline: any) => ({
            id: discipline.id,
            name: discipline.name,
            theoryHours: discipline.theory_hours,
            practiceHours: discipline.practice_hours,
            totalHours: (discipline.theory_hours || 0) + (discipline.practice_hours || 0),
            isActive: discipline.is_active
          }));
          const calculatedTotalHours = formattedDisciplines.reduce((total, d) => total + d.totalHours, 0);
          return {
            courseId: course.id,
            courseName: course.name,
            totalHours: calculatedTotalHours || course.total_hours,
            isActive: course.is_active,
            disciplines: formattedDisciplines
          };
        });
        setCurriculum(curriculumData);
        setFilteredCurriculum(curriculumData);
        // Inicializar estado expandido
        const initialExpandedState: Record<string, boolean> = {};
        curriculumData.forEach(item => {
          initialExpandedState[item.courseId] = false;
        });
        setExpandedCourses(initialExpandedState);
      })
      .catch((err) => {
        setError('Erro ao carregar currículo: ' + (err.message || err));
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCurriculum(curriculum);
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    // Filter curriculum based on search query
    const filtered = curriculum
      .map(course => {
        // Check if course name matches
        const courseMatches = course.courseName.toLowerCase().includes(lowerCaseQuery);
        
        // Filter disciplines that match the query
        const matchingDisciplines = course.disciplines.filter(
          discipline => discipline.name.toLowerCase().includes(lowerCaseQuery)
        );
        
        // If course matches or has matching disciplines, include it
        if (courseMatches) {
          return course; // Include the whole course
        } else if (matchingDisciplines.length > 0) {
          // Include only the course with matching disciplines
          return {
            ...course,
            disciplines: matchingDisciplines
          };
        }
        
        return null;
      })
      .filter(Boolean) as CurriculumItem[]; // Filter out nulls
    
    setFilteredCurriculum(filtered);
    
    // Expand courses with matching disciplines
    if (filtered.length > 0) {
      const newExpandedState = { ...expandedCourses };
      filtered.forEach(course => {
        newExpandedState[course.courseId] = true;
      });
      setExpandedCourses(newExpandedState);
    }
  }, [searchQuery, curriculum]);

  const toggleCourseExpand = (courseId: string) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const handleViewDiscipline = (disciplineId: string) => {
    navigate(`/disciplines/${disciplineId}/edit`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title="Grade Curricular" 
        userRole={userRole} 
        userName={userName} 
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <ListOrdered className="h-6 w-6 text-cbmepi-red" />
              <h1 className="text-2xl font-bold text-cbmepi-black">Grade Curricular</h1>
            </div>
            
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Buscar na grade..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="tree" className="space-y-6">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="tree">Visualização em Árvore</TabsTrigger>
              <TabsTrigger value="chart">Visualização em Gráfico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tree" className="space-y-6">
              {loading ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500">Carregando currículo...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : filteredCurriculum.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <ListOrdered className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum conteúdo encontrado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery ? `Não foram encontrados cursos ou disciplinas com "${searchQuery}".` : 'Não há cursos cadastrados no sistema.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCurriculum.map((course) => (
                    <Card key={course.courseId} className="border border-gray-200 shadow-sm">
                      <CardHeader 
                        className="pb-3 cursor-pointer"
                        onClick={() => toggleCourseExpand(course.courseId)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {expandedCourses[course.courseId] ? 
                              <ChevronDown className="h-5 w-5 mr-2 text-cbmepi-orange" /> : 
                              <ChevronRight className="h-5 w-5 mr-2 text-cbmepi-orange" />}
                            <CardTitle className="text-lg">{course.courseName}</CardTitle>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant={course.isActive ? 'default' : 'outline'} className={course.isActive ? 'bg-green-500' : ''}>
                              {course.isActive ? 'Ativo' : 'Inativo'}
                            </Badge>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{course.totalHours} horas</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      {expandedCourses[course.courseId] && (
                        <CardContent>
                          {course.disciplines.length > 0 ? (
                            <div className="pl-6 border-l-2 border-cbmepi-orange/30">
                              <div className="space-y-3">
                                {course.disciplines.map((discipline) => (
                                  <div 
                                    key={discipline.id}
                                    className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleViewDiscipline(discipline.id)}
                                  >
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <h3 className="font-medium text-cbmepi-black">{discipline.name}</h3>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                        <Badge variant={discipline.isActive ? 'default' : 'outline'} className={discipline.isActive ? 'bg-green-500' : ''}>
                                          {discipline.isActive ? 'Ativa' : 'Inativa'}
                                        </Badge>
                                        <div className="text-sm text-gray-600">
                                          {discipline.totalHours} horas
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-500">
                                      <div>Teoria: {discipline.theoryHours}h</div>
                                      <div>Prática: {discipline.practiceHours}h</div>
                                      <div>Total: {discipline.totalHours}h</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="mt-4 flex justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewCourse(course.courseId);
                                  }}
                                  className="text-cbmepi-orange border-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
                                >
                                  Ver Detalhes do Curso
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="pl-6 border-l-2 border-gray-200">
                              <p className="text-gray-500 italic">Este curso não possui disciplinas cadastradas.</p>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="chart" className="space-y-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Visualização em Gráfico</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">
                      Visualização em gráfico em desenvolvimento.
                    </p>
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

export default CurriculumView;

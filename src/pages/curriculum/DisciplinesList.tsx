
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { mockDisciplines, mockCourses } from '@/data/mockCurriculumData';
import { Discipline } from '@/data/curriculumTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Search, BookPlus, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DisciplinesList: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [filteredDisciplines, setFilteredDisciplines] = useState<Discipline[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  
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
    
    // Fetch disciplines (mock data)
    // Add courseName to each discipline
    const disciplinesWithCourseNames = mockDisciplines.map(discipline => {
      const course = mockCourses.find(c => c.id === discipline.courseId);
      return {
        ...discipline,
        courseName: course ? course.name : 'Curso Desconhecido'
      };
    });
    
    setDisciplines(disciplinesWithCourseNames);
    setFilteredDisciplines(disciplinesWithCourseNames);
  }, [navigate]);

  useEffect(() => {
    let filtered = disciplines;
    
    // Apply course filter
    if (courseFilter !== 'all') {
      filtered = filtered.filter(discipline => discipline.courseId === courseFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(discipline => 
        discipline.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (discipline.courseName && discipline.courseName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        discipline.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredDisciplines(filtered);
  }, [searchQuery, courseFilter, disciplines]);

  const handleCreateDiscipline = () => {
    navigate('/disciplines/create');
  };

  const handleEditDiscipline = (disciplineId: string) => {
    navigate(`/disciplines/${disciplineId}/edit`);
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title="Disciplinas" 
        userRole={userRole} 
        userName={userName}
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <BookPlus className="h-6 w-6 text-cbmepi-red" />
              <h1 className="text-2xl font-bold text-cbmepi-black">Gerenciamento de Disciplinas</h1>
            </div>
            
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Pesquisar disciplinas..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cbmepi-orange"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                <option value="all">Todos os Cursos</option>
                {mockCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              
              {isAdmin && (
                <Button 
                  onClick={handleCreateDiscipline}
                  className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                >
                  <PlusCircle className="mr-2" size={16} />
                  Nova Disciplina
                </Button>
              )}
            </div>
          </div>
          
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Lista de Disciplinas</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredDisciplines.length === 0 ? (
                <div className="text-center py-12">
                  <BookPlus className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma disciplina encontrada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery || courseFilter !== 'all' ? 
                      `Não foram encontradas disciplinas com os filtros atuais.` : 
                      'Não há disciplinas cadastradas no sistema.'}
                  </p>
                  {isAdmin && (
                    <div className="mt-6">
                      <Button 
                        onClick={handleCreateDiscipline}
                        className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                      >
                        <PlusCircle className="mr-2" size={16} />
                        Criar Primeira Disciplina
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Curso</TableHead>
                        <TableHead className="text-center">Carga Horária<br />(Teoria)</TableHead>
                        <TableHead className="text-center">Carga Horária<br />(Prática)</TableHead>
                        <TableHead className="text-center">Carga Horária<br />(Total)</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        {isAdmin && <TableHead className="text-right">Ações</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDisciplines.map((discipline) => (
                        <TableRow key={discipline.id}>
                          <TableCell className="font-medium">{discipline.name}</TableCell>
                          <TableCell>{discipline.courseName}</TableCell>
                          <TableCell className="text-center">{discipline.theoryHours}h</TableCell>
                          <TableCell className="text-center">{discipline.practiceHours}h</TableCell>
                          <TableCell className="text-center">{discipline.theoryHours + discipline.practiceHours}h</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={discipline.isActive ? 'default' : 'outline'} className={discipline.isActive ? 'bg-green-500' : ''}>
                              {discipline.isActive ? 'Ativa' : 'Inativa'}
                            </Badge>
                          </TableCell>
                          {isAdmin && (
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditDiscipline(discipline.id)}
                                className="text-cbmepi-orange border-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
                              >
                                Editar
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DisciplinesList;

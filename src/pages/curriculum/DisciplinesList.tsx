
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { mockDisciplines } from '@/data/mockCurriculumData';
import { Discipline } from '@/data/curriculumTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PlusCircle, Search, BookOpen, Clock, Eye, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DisciplinesList: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [filteredDisciplines, setFilteredDisciplines] = useState<Discipline[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
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
    setDisciplines(mockDisciplines);
    setFilteredDisciplines(mockDisciplines);
  }, [navigate]);

  useEffect(() => {
    let filtered = disciplines;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(discipline => discipline.status === statusFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(discipline => 
        discipline.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        discipline.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredDisciplines(filtered);
  }, [searchQuery, statusFilter, disciplines]);

  const handleCreateDiscipline = () => {
    navigate('/disciplines/create');
  };

  const handleViewDiscipline = (disciplineId: string) => {
    navigate(`/disciplines/${disciplineId}`);
  };

  const handleEditDiscipline = (disciplineId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/disciplines/${disciplineId}/edit`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativa</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inativa</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-500">Rascunho</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
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
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Disciplinas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-cbmepi-red" />
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativa</option>
                <option value="inactive">Inativa</option>
                <option value="draft">Rascunho</option>
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
          
          {filteredDisciplines.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma disciplina encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all' ? 
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDisciplines.map((discipline) => (
                <Card 
                  key={discipline.id}
                  className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleViewDiscipline(discipline.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{discipline.name}</CardTitle>
                      {getStatusBadge(discipline.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{discipline.description}</p>
                    
                    <div className="flex items-center text-sm mb-4">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{discipline.workload} horas</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDiscipline(discipline.id);
                        }}
                        className="text-cbmepi-orange border-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Ver Detalhes
                      </Button>
                      
                      {isAdmin && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => handleEditDiscipline(discipline.id, e)}
                          className="text-gray-600 border-gray-300 hover:bg-gray-100"
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Editar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DisciplinesList;

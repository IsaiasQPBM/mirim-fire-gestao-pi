
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Filter } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockObservations, PedagogicalObservation, ObservationType, PriorityLevel } from '@/data/pedagogicalTypes';
import { mockUsers } from '@/data/userTypes';

const ObservationsList = () => {
  const [observations, setObservations] = useState<PedagogicalObservation[]>([]);
  const [filteredObservations, setFilteredObservations] = useState<PedagogicalObservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ObservationType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | 'all'>('all');
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
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

    // Load observations
    setObservations(mockObservations);
    setFilteredObservations(mockObservations);
  }, [navigate]);

  useEffect(() => {
    // Apply filters
    let result = observations;

    if (searchTerm) {
      result = result.filter(obs => 
        obs.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStudentName(obs.studentId).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter(obs => obs.type === typeFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter(obs => obs.priority === priorityFilter);
    }

    setFilteredObservations(result);
  }, [searchTerm, typeFilter, priorityFilter, observations]);

  const getStudentName = (studentId: string) => {
    const student = mockUsers.find(user => user.id === studentId);
    return student ? student.fullName : 'Unknown Student';
  };

  const getInstructorName = (instructorId: string) => {
    const instructor = mockUsers.find(user => user.id === instructorId);
    return instructor ? instructor.fullName : 'Unknown Instructor';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getPriorityBadgeColor = (priority: PriorityLevel) => {
    switch (priority) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-orange-500';
      case 'urgent':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeBadgeColor = (type: ObservationType) => {
    switch (type) {
      case 'behavioral':
        return 'bg-blue-500';
      case 'academic':
        return 'bg-purple-500';
      case 'attendance':
        return 'bg-cyan-500';
      case 'health':
        return 'bg-red-500';
      case 'personal':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!userRole) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Lista de Observações Pedagógicas
            </h2>
            <Button onClick={() => navigate('/pedagogical/observations/create')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Observação
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Buscar por aluno ou descrição..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-[200px]">
                  <Select
                    value={typeFilter}
                    onValueChange={(value) => setTypeFilter(value as ObservationType | 'all')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de Observação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      <SelectItem value="behavioral">Comportamental</SelectItem>
                      <SelectItem value="academic">Acadêmica</SelectItem>
                      <SelectItem value="attendance">Presença</SelectItem>
                      <SelectItem value="health">Saúde</SelectItem>
                      <SelectItem value="personal">Pessoal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-[200px]">
                  <Select
                    value={priorityFilter}
                    onValueChange={(value) => setPriorityFilter(value as PriorityLevel | 'all')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Prioridades</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead className="w-[300px]">Descrição</TableHead>
                    <TableHead>Registrado por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredObservations.length > 0 ? (
                    filteredObservations.map((observation) => (
                      <TableRow 
                        key={observation.id}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => navigate(`/pedagogical/student/${observation.studentId}`)}
                      >
                        <TableCell>{formatDate(observation.date)}</TableCell>
                        <TableCell className="font-medium">{getStudentName(observation.studentId)}</TableCell>
                        <TableCell>
                          <Badge className={`${getTypeBadgeColor(observation.type)} text-white`}>
                            {observation.type === 'behavioral' && 'Comportamental'}
                            {observation.type === 'academic' && 'Acadêmica'}
                            {observation.type === 'attendance' && 'Presença'}
                            {observation.type === 'health' && 'Saúde'}
                            {observation.type === 'personal' && 'Pessoal'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getPriorityBadgeColor(observation.priority)} text-white`}>
                            {observation.priority === 'low' && 'Baixa'}
                            {observation.priority === 'medium' && 'Média'}
                            {observation.priority === 'high' && 'Alta'}
                            {observation.priority === 'urgent' && 'Urgente'}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">{observation.description}</TableCell>
                        <TableCell>{getInstructorName(observation.instructorId)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                        Nenhuma observação encontrada com os filtros selecionados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ObservationsList;

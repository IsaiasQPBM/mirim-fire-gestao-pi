
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
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
import { observationsService, PedagogicalObservation } from '@/services/observationsService';
import { toast } from '@/hooks/use-toast';

const ObservationsList = () => {
  const [observations, setObservations] = useState<PedagogicalObservation[]>([]);
  const [filteredObservations, setFilteredObservations] = useState<PedagogicalObservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadObservations();
  }, []);

  const loadObservations = async () => {
    try {
      const { data, error } = await observationsService.getAll();
      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as observações.",
          variant: "destructive"
        });
        return;
      }
      setObservations(data || []);
      setFilteredObservations(data || []);
    } catch (error) {
      console.error('Error loading observations:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar observações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters
    let result = observations;

    if (searchTerm) {
      result = result.filter(observation => 
        observation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStudentName(observation).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter(observation => observation.type === typeFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter(observation => observation.priority === priorityFilter);
    }

    setFilteredObservations(result);
  }, [searchTerm, typeFilter, priorityFilter, observations]);

  const getStudentName = (observation: PedagogicalObservation) => {
    return observation.students?.profiles?.full_name || 'Aluno não identificado';
  };

  const getInstructorName = (observation: PedagogicalObservation) => {
    return observation.instructor_profiles?.full_name || 'Instrutor não identificado';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getPriorityBadgeColor = (priority: string) => {
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

  const getTypeBadgeColor = (type: string) => {
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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cbmepi-orange"></div>
        </main>
      </div>
    );
  }

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
                    onValueChange={(value) => setTypeFilter(value)}
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
                    onValueChange={(value) => setPriorityFilter(value)}
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
                      >
                        <TableCell>{formatDate(observation.date)}</TableCell>
                        <TableCell className="font-medium">{getStudentName(observation)}</TableCell>
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
                        <TableCell>{getInstructorName(observation)}</TableCell>
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

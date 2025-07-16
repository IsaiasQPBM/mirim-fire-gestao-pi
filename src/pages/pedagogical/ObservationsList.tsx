
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Filter, Loader2 } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { observationService } from '@/services/api';
import { ObservationType, PriorityLevel } from '@/data/pedagogicalTypes';
import type { Database } from '@/integrations/supabase/types';

type Observation = Database['public']['Tables']['pedagogical_observations']['Row'] & {
  students: {
    profiles: {
      full_name: string;
    } | null;
  } | null;
  profiles: {
    full_name: string;
  } | null;
};

const ObservationsList = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [filteredObservations, setFilteredObservations] = useState<Observation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ObservationType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | 'all'>('all');
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

    // Load observations from Supabase
    loadObservations();
  }, [navigate]);

  const loadObservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await observationService.getAll();
      setObservations(data || []);
      setFilteredObservations(data || []);
    } catch (error) {
      console.error('Erro ao carregar observações:', error);
      setError('Erro ao carregar observações. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar as observações.",
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
      result = result.filter(obs => 
        obs.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStudentName(obs).toLowerCase().includes(searchTerm.toLowerCase())
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

  const getStudentName = (observation: Observation) => {
    return observation.students?.profiles?.full_name || 'Aluno não encontrado';
  };

  const getInstructorName = (observation: Observation) => {
    return observation.profiles?.full_name || 'Instrutor não encontrado';
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
    <div className="p-6">
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
                <span className="ml-2 text-gray-600">Carregando observações...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadObservations} variant="outline">
                  Tentar Novamente
                </Button>
              </div>
            ) : (
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
                        onClick={() => navigate(`/pedagogical/student/${observation.student_id}`)}
                      >
                        <TableCell>{formatDate(observation.date)}</TableCell>
                        <TableCell className="font-medium">{getStudentName(observation)}</TableCell>
                        <TableCell>
                          <Badge className={`${getTypeBadgeColor(observation.type as ObservationType)} text-white`}>
                            {observation.type === 'behavioral' && 'Comportamental'}
                            {observation.type === 'academic' && 'Acadêmica'}
                            {observation.type === 'attendance' && 'Presença'}
                            {observation.type === 'health' && 'Saúde'}
                            {observation.type === 'personal' && 'Pessoal'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getPriorityBadgeColor(observation.priority as PriorityLevel)} text-white`}>
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
                        {observations.length === 0 
                          ? 'Nenhuma observação encontrada.' 
                          : 'Nenhuma observação encontrada com os filtros selecionados.'
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ObservationsList;

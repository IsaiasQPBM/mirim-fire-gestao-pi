
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clipboard, 
  AlertCircle, 
  Check, 
  BookOpen, 
  Clock, 
  Heart, 
  User,
  Plus,
  Filter,
  Loader2
} from 'lucide-react';
import { ObservationType, PriorityLevel } from '@/data/pedagogicalTypes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { observationService } from '@/services/api';
import type { Database } from '@/integrations/supabase/types';

type Observation = Database['public']['Tables']['pedagogical_observations']['Row'] & {
  profiles: {
    full_name: string;
  } | null;
};

interface PedagogicalObservationsProps {
  studentId: string;
}

const PedagogicalObservations: React.FC<PedagogicalObservationsProps> = ({ studentId }) => {
  const { toast } = useToast();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [filteredObservations, setFilteredObservations] = useState<Observation[]>([]);
  const [typeFilter, setTypeFilter] = useState<ObservationType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadObservations();
  }, [studentId]);

  const loadObservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await observationService.getByStudent(studentId);
      setObservations(data || []);
      setFilteredObservations(data || []);
    } catch (error) {
      console.error('Erro ao carregar observações:', error);
      setError('Erro ao carregar observações. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar as observações do aluno.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters
    let result = observations;

    if (typeFilter !== 'all') {
      result = result.filter(obs => obs.type === typeFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter(obs => obs.priority === priorityFilter);
    }

    setFilteredObservations(result);
  }, [typeFilter, priorityFilter, observations]);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const getTypeLabel = (type: ObservationType) => {
    switch(type) {
      case 'behavioral': return 'Comportamental';
      case 'academic': return 'Acadêmico';
      case 'attendance': return 'Frequência';
      case 'health': return 'Saúde';
      case 'personal': return 'Pessoal';
      default: return type;
    }
  };
  
  const getPriorityLabel = (priority: PriorityLevel) => {
    switch(priority) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      case 'urgent': return 'Urgente';
      default: return priority;
    }
  };
  
  const getTypeIcon = (type: ObservationType) => {
    switch(type) {
      case 'behavioral': return <User className="h-5 w-5" />;
      case 'academic': return <BookOpen className="h-5 w-5" />;
      case 'attendance': return <Clock className="h-5 w-5" />;
      case 'health': return <Heart className="h-5 w-5" />;
      case 'personal': return <User className="h-5 w-5" />;
      default: return <Clipboard className="h-5 w-5" />;
    }
  };
  
  const getPriorityColor = (priority: PriorityLevel) => {
    switch(priority) {
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      default: return '';
    }
  };
  
  const getTypeColor = (type: ObservationType) => {
    switch(type) {
      case 'behavioral': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'academic': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'attendance': return 'bg-green-100 text-green-800 border-green-300';
      case 'health': return 'bg-red-100 text-red-800 border-red-300';
      case 'personal': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return '';
    }
  };
  
  const handleAddObservation = () => {
    // Navigate to create observation page with student pre-selected
    window.location.href = `/pedagogical/observations/create?studentId=${studentId}`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <Clipboard size={18} className="mr-2 text-cbmepi-orange" />
            Observações Pedagógicas
          </CardTitle>
          <Button 
            size="sm" 
            className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            onClick={handleAddObservation}
          >
            <Plus size={16} className="mr-1" />
            Nova Observação
          </Button>
        </div>
        <CardDescription>
          Registro de observações realizadas pelos instrutores
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtros:</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ObservationType | 'all')}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="behavioral">Comportamental</SelectItem>
              <SelectItem value="academic">Acadêmico</SelectItem>
              <SelectItem value="attendance">Frequência</SelectItem>
              <SelectItem value="health">Saúde</SelectItem>
              <SelectItem value="personal">Pessoal</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as PriorityLevel | 'all')}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as prioridades</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Observations List */}
        <div className="space-y-4 mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-cbmepi-orange" />
              <span className="ml-2 text-gray-600">Carregando observações...</span>
            </div>
          ) : error ? (
            <div className="text-center py-6 bg-red-50 rounded-md">
              <p className="text-red-600 mb-2">{error}</p>
              <Button onClick={loadObservations} variant="outline" size="sm">
                Tentar Novamente
              </Button>
            </div>
          ) : filteredObservations.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-md">
              <p className="text-gray-500">
                {observations.length === 0 
                  ? 'Nenhuma observação registrada para este aluno.' 
                  : 'Nenhuma observação encontrada com os filtros selecionados.'
                }
              </p>
            </div>
          ) : (
            filteredObservations.map(observation => (
              <div 
                key={observation.id} 
                className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      getTypeColor(observation.type as ObservationType)
                    )}>
                      {getTypeIcon(observation.type as ObservationType)}
                    </div>
                    <div>
                      <p className="font-medium">{formatDate(observation.date)}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge className={getTypeColor(observation.type as ObservationType)}>
                          {getTypeLabel(observation.type as ObservationType)}
                        </Badge>
                        <Badge className={getPriorityColor(observation.priority as PriorityLevel)}>
                          Prioridade: {getPriorityLabel(observation.priority as PriorityLevel)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="mt-4 text-gray-700">{observation.description}</p>
                
                <div className="mt-4 pt-2 border-t border-gray-100 text-sm text-gray-500 flex justify-end">
                  Registrado por: {observation.profiles?.full_name || 'Instrutor não identificado'}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <p className="text-sm text-gray-500">
          Total de observações: {filteredObservations.length}
        </p>
      </CardFooter>
    </Card>
  );
};

export default PedagogicalObservations;

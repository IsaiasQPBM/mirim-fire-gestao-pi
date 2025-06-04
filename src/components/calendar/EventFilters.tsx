
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';

interface EventFiltersProps {
  eventTypeFilter: string;
  onEventTypeFilterChange: (value: string) => void;
  eventCounts: {
    total: number;
    lessons: number;
    exams: number;
    events: number;
  };
}

const EventFilters: React.FC<EventFiltersProps> = ({
  eventTypeFilter,
  onEventTypeFilterChange,
  eventCounts
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-cbmepi-black">
          <Filter className="mr-2 h-5 w-5 text-cbmepi-orange" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Tipo de Evento</label>
          <Select value={eventTypeFilter} onValueChange={onEventTypeFilterChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Eventos</SelectItem>
              <SelectItem value="lesson">Aulas</SelectItem>
              <SelectItem value="exam">Avaliações</SelectItem>
              <SelectItem value="event">Eventos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Resumo</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs">Total</span>
              <Badge variant="outline">{eventCounts.total}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Aulas</span>
              <Badge className="bg-blue-500 text-white">{eventCounts.lessons}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Avaliações</span>
              <Badge className="bg-red-500 text-white">{eventCounts.exams}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Eventos</span>
              <Badge className="bg-green-500 text-white">{eventCounts.events}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventFilters;

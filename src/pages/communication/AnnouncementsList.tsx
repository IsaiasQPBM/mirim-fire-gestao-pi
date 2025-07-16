
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Plus, 
  ChevronDown, 
  Calendar, 
  User,
  AlertCircle,
  Megaphone,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { communicationService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Communication = Database['public']['Tables']['communications']['Row'] & {
  profiles: {
    full_name: string;
  } | null;
};

const AnnouncementsList: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [announcements, setAnnouncements] = useState<Communication[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');
    const storedUserId = localStorage.getItem('userId');

    if (!storedUserRole || !storedUserName || !storedUserId) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
    setUserId(storedUserId);

    // Load announcements from Supabase
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await communicationService.getMessages(userId);
      
      // Filter only announcements
      const announcementsData = data?.filter(item => item.message_type === 'announcement') || [];
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error('Erro ao carregar comunicados:', error);
      setError('Erro ao carregar comunicados. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os comunicados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter announcements based on search query
  const filteredAnnouncements = announcements.filter(announcement => {
    if (searchQuery && 
        !announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !announcement.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Urgente';
      case 'high':
        return 'Alta';
      case 'normal':
        return 'Normal';
      case 'low':
        return 'Baixa';
      default:
        return 'Normal';
    }
  };

  if (!userRole) return null;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cbmepi-black">Comunicados Gerais</h2>
          {(userRole === 'admin' || userRole === 'instructor') && (
            <Link to="/communication/announcements/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Comunicado
              </Button>
            </Link>
          )}
        </div>

        <Card className="shadow-sm mb-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Megaphone className="mr-2 h-5 w-5 text-cbmepi-orange" />
                Comunicados Importantes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mt-2 mb-4">
              <Input
                placeholder="Pesquisar comunicados..."
                className="pl-2"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
                <span className="ml-2 text-gray-600">Carregando comunicados...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadAnnouncements} variant="outline">
                  Tentar Novamente
                </Button>
              </div>
            ) : filteredAnnouncements.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredAnnouncements.map((announcement) => (
                  <AccordionItem key={announcement.id} value={announcement.id}>
                    <AccordionTrigger className="py-4 px-2">
                      <div className="flex items-center text-left">
                        <div className={cn(
                          "w-2 h-2 rounded-full mr-3",
                          announcement.priority === 'urgent' || announcement.priority === 'high' 
                            ? "bg-cbmepi-red" 
                            : "bg-cbmepi-orange"
                        )} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{announcement.title}</span>
                            <Badge className={getPriorityColor(announcement.priority)}>
                              {getPriorityLabel(announcement.priority)}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">{formatDate(announcement.sent_at)}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-2">
                      <div className="space-y-4">
                        <p className="text-gray-700 whitespace-pre-line">{announcement.content}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1 opacity-70" />
                            <span>{announcement.profiles?.full_name || 'Autor não identificado'}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 opacity-70" />
                            <span>{formatDate(announcement.sent_at)}</span>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12">
                <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? 'Nenhum comunicado encontrado para sua busca.' : 'Nenhum comunicado disponível.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnouncementsList;

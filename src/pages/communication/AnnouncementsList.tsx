
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Plus, 
  ChevronDown, 
  Calendar, 
  User,
  AlertCircle,
  Megaphone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { mockAnnouncements, Announcement } from '@/data/communicationTypes';
import { cn } from '@/lib/utils';

const AnnouncementsList: React.FC = () => {
  const [userRole, setUserRole] = useState<string>(localStorage.getItem('userRole') || '');
  const [userName, setUserName] = useState<string>(localStorage.getItem('userName') || '');
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title="Comunicados" userRole={userRole} userName={userName} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cbmepi-black">Comunicados Gerais</h2>
          {(userRole === 'admin' || userRole === 'instructor') && (
            <Link to="/communication/announcements/new">
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
            
            <Accordion type="single" collapsible className="w-full">
              {filteredAnnouncements.map((announcement, index) => (
                <AccordionItem key={announcement.id} value={announcement.id}>
                  <AccordionTrigger className="py-4 px-2">
                    <div className="flex items-center text-left">
                      <div className={cn(
                        "w-2 h-2 rounded-full mr-3",
                        announcement.important ? "bg-cbmepi-red" : "bg-cbmepi-orange"
                      )} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{announcement.title}</span>
                          {announcement.important && (
                            <Badge variant="destructive" className="text-[10px] px-1 py-0">
                              Importante
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{formatDate(announcement.createdAt)}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    <div className="space-y-4">
                      <p className="text-gray-700 whitespace-pre-line">{announcement.content}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 opacity-70" />
                          <span>{announcement.authorName}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 opacity-70" />
                          <span>{formatDate(announcement.createdAt)}</span>
                        </div>
                        {announcement.targetGroups.includes('all') ? (
                          <Badge variant="outline">Todos os Usuários</Badge>
                        ) : (
                          <div className="flex items-center gap-2">
                            {announcement.targetGroups.map(group => {
                              let groupName = '';
                              if (group === 'group-1') groupName = 'Instrutores';
                              if (group === 'group-2') groupName = 'Turma A';
                              if (group === 'group-3') groupName = 'Primeiros Socorros';
                              
                              return groupName ? (
                                <Badge key={group} variant="outline">{groupName}</Badge>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                      
                      {userRole === 'admin' && (
                        <div className="flex justify-end space-x-2 pt-2">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button variant="destructive" size="sm">Remover</Button>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredAnnouncements.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhum comunicado encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AnnouncementsList;

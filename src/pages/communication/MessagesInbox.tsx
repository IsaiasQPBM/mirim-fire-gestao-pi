
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  Check, 
  Search, 
  Plus, 
  Trash2, 
  RefreshCw,
  Star,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockMessages, Message } from '@/data/communicationTypes';
import { cn } from '@/lib/utils';

const MessagesInbox: React.FC = () => {
  const [userRole, setUserRole] = useState<string>(localStorage.getItem('userRole') || '');
  const [userName, setUserName] = useState<string>(localStorage.getItem('userName') || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState<string>('inbox');

  const userId = localStorage.getItem('userId') || 'user-1';

  // Filter messages based on active tab and user ID
  const filteredMessages = messages.filter(message => {
    // Basic search functionality
    if (searchQuery && 
        !message.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !message.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !message.senderName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (activeTab === 'inbox') {
      return message.receiverId === userId;
    } else if (activeTab === 'sent') {
      return message.senderId === userId;
    }
    
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRefresh = () => {
    // In a real app, we would fetch new messages from the server
    console.log('Refreshing messages...');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title="Mensagens" userRole={userRole} userName={userName} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cbmepi-black">Sistema de Mensagens</h2>
          <Link to="/communication/messages/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Mensagem
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Messages List */}
          <Card className="lg:col-span-5 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Mensagens</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar mensagens..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="inbox" 
                className="w-full"
                value={activeTab} 
                onValueChange={setActiveTab}
              >
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="inbox">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Recebidas
                  </TabsTrigger>
                  <TabsTrigger value="sent">
                    <Send className="mr-2 h-4 w-4" />
                    Enviadas
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="inbox" className="m-0">
                  <div className="divide-y max-h-[500px] overflow-y-auto">
                    {filteredMessages.length > 0 ? (
                      filteredMessages.map((message) => (
                        <div 
                          key={message.id} 
                          className={cn(
                            "p-3 cursor-pointer hover:bg-gray-100",
                            !message.read && "bg-orange-50",
                            selectedMessage?.id === message.id && "bg-blue-50 hover:bg-blue-50"
                          )}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <div className="flex justify-between">
                            <span className={cn(
                              "text-sm",
                              !message.read && "font-semibold"
                            )}>
                              {message.senderName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(message.createdAt)}
                            </span>
                          </div>
                          <h4 className={cn(
                            "text-sm mt-1",
                            !message.read && "font-semibold"
                          )}>
                            {message.subject}
                          </h4>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {message.content}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-sm text-gray-500">Nenhuma mensagem encontrada</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="sent" className="m-0">
                  <div className="divide-y max-h-[500px] overflow-y-auto">
                    {filteredMessages.length > 0 ? (
                      filteredMessages.map((message) => (
                        <div 
                          key={message.id} 
                          className={cn(
                            "p-3 cursor-pointer hover:bg-gray-100",
                            selectedMessage?.id === message.id && "bg-blue-50 hover:bg-blue-50"
                          )}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <div className="flex justify-between">
                            <span className="text-sm">
                              Para: {message.receiverName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(message.createdAt)}
                            </span>
                          </div>
                          <h4 className="text-sm mt-1">
                            {message.subject}
                          </h4>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {message.content}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-sm text-gray-500">Nenhuma mensagem enviada</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Message View */}
          <Card className="lg:col-span-7 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Visualizar Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{selectedMessage.subject}</h3>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-cbmepi-orange text-white flex items-center justify-center rounded-full">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedMessage.senderName}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(selectedMessage.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white mb-4">
                    <p className="whitespace-pre-line">{selectedMessage.content}</p>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedMessage(null);
                      }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Marcar como lido
                    </Button>

                    <div className="space-x-2">
                      <Button variant="outline">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Responder
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">Selecione uma mensagem para visualizar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MessagesInbox;

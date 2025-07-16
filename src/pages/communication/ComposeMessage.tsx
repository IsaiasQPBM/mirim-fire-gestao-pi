
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Users, User, X } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface FormValues {
  recipientType: 'individual' | 'group';
  recipient: string;
  subject: string;
  message: string;
}

const ComposeMessage: React.FC = () => {
  const [userRole, setUserRole] = useState<string>(localStorage.getItem('userRole') || '');
  const [userName, setUserName] = useState<string>(localStorage.getItem('userName') || '');
  const [selectedUsers, setSelectedUsers] = useState<{id: string, name: string}[]>([]);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    defaultValues: {
      recipientType: 'individual',
      recipient: '',
      subject: '',
      message: ''
    }
  });

  const handleAddUser = (id: string, name: string) => {
    if (!selectedUsers.some(user => user.id === id)) {
      setSelectedUsers(prev => [...prev, {id, name}]);
    }
  };

  const handleRemoveUser = (id: string) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== id));
  };

  const onSubmit = (data: FormValues) => {
    console.log('Sending message with data:', data);
    console.log('Selected users:', selectedUsers);
    
    toast({
      title: "Mensagem enviada com sucesso!",
      description: "Sua mensagem foi enviada para os destinatários selecionados.",
    });
    
    navigate('/communication/messages');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title="Compor Mensagem" userRole={userRole} userName={userName} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <Button variant="ghost" onClick={() => navigate('/communication/messages')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Caixa de Entrada
        </Button>

        <Card className="max-w-4xl mx-auto shadow-md">
          <CardHeader>
            <CardTitle>Nova Mensagem</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="recipientType"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Tipo de Destinatário</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value} 
                          onValueChange={(value: 'individual' | 'group') => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de destinatário" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Usuário Individual</SelectItem>
                            <SelectItem value="group">Grupo</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('recipientType') === 'individual' ? (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="recipient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destinatário</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={(value) => {
                              field.onChange(value);
                              
                              // Add to selected users list for display
                              let userName = '';
                              if (value === 'user-1') userName = 'João Silva';
                              else if (value === 'user-2') userName = 'Maria Oliveira';
                              else if (value === 'user-3') userName = 'Pedro Santos';
                              
                              if (userName) {
                                handleAddUser(value, userName);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um destinatário" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user-1">João Silva (Admin)</SelectItem>
                              <SelectItem value="user-2">Maria Oliveira (Instrutor)</SelectItem>
                              <SelectItem value="user-3">Pedro Santos (Aluno)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedUsers.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Destinatários selecionados:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedUsers.map(user => (
                            <Badge key={user.id} variant="outline" className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {user.name}
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                                onClick={() => handleRemoveUser(user.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grupo</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um grupo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="group-1">Instrutores</SelectItem>
                            <SelectItem value="group-2">Turma A</SelectItem>
                            <SelectItem value="group-3">Primeiros Socorros</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assunto</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o assunto da mensagem" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Digite sua mensagem aqui..." 
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => navigate('/communication/messages')}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Mensagem
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
};

export default ComposeMessage;

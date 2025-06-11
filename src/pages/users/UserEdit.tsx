
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import { User, UserRole, getUserById } from '@/data/userTypes';

const userProfileSchema = z.object({
  fullName: z.string().min(3, { message: 'Nome completo deve ter pelo menos 3 caracteres' }),
  birthDate: z.string().min(1, { message: 'Data de nascimento é obrigatória' }),
  role: z.enum(['admin', 'instructor', 'student']),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 dígitos' }),
  status: z.enum(['active', 'inactive'])
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Senha atual é obrigatória' }),
  newPassword: z.string().min(6, { message: 'Nova senha deve ter pelo menos 6 caracteres' }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não correspondem",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof userProfileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const userRole = localStorage.getItem('userRole') as 'admin' | 'instructor' | 'student' || 'student';
  const userName = localStorage.getItem('userName') || '';
  const [loading, setLoading] = useState(true);
  
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      fullName: '',
      birthDate: '',
      role: 'student',
      email: '',
      phone: '',
      status: 'active'
    }
  });
  
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });
  
  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const foundUser = getUserById(id);
      
      if (foundUser) {
        setUser(foundUser);
        
        // Set form values
        profileForm.reset({
          fullName: foundUser.fullName,
          birthDate: foundUser.birthDate,
          role: foundUser.role,
          email: foundUser.email,
          phone: foundUser.phone,
          status: foundUser.status
        });
      }
      
      setLoading(false);
    }
  }, [id]);
  
  // Only admin should be able to see this page
  if (userRole !== 'admin') {
    return (
      <div className="p-6">
        <Header title="Editar Usuário" userRole={userRole} userName={userName} />
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-red-600">Acesso Restrito</h2>
          <p className="mt-2">Você não tem permissão para acessar esta página.</p>
          <Button 
            className="mt-4 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            onClick={() => navigate('/dashboard')}
          >
            Voltar para Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cbmepi-orange"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="p-6">
        <Header title="Editar Usuário" userRole={userRole} userName={userName} />
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-red-600">Usuário não encontrado</h2>
          <p className="mt-2">O usuário que você está procurando não existe.</p>
          <Button 
            className="mt-4 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            onClick={() => navigate('/users')}
          >
            Voltar para Lista de Usuários
          </Button>
        </div>
      </div>
    );
  }

  const onProfileSubmit = (data: ProfileFormData) => {
    // In a real app, this would be an API call
    console.log('Profile form submitted:', data);
    
    // Simulate API call delay
    toast.promise(
      new Promise<User>(resolve => {
        setTimeout(() => {
          resolve({
            ...user,
            ...data
          });
        }, 1000);
      }),
      {
        loading: 'Atualizando perfil...',
        success: () => {
          return 'Perfil atualizado com sucesso!';
        },
        error: 'Erro ao atualizar perfil.',
      }
    );
  };
  
  const onPasswordSubmit = (data: PasswordFormData) => {
    // In a real app, this would be an API call
    console.log('Password form submitted:', data);
    
    // Simulate API call delay
    toast.promise(
      new Promise<void>(resolve => {
        setTimeout(() => {
          resolve();
          passwordForm.reset();
        }, 1000);
      }),
      {
        loading: 'Alterando senha...',
        success: () => {
          return 'Senha alterada com sucesso!';
        },
        error: 'Erro ao alterar senha.',
      }
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title="Editar Usuário" userRole={userRole} userName={userName} />
      
      <div className="max-w-3xl mx-auto mt-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="profile">Informações do Perfil</TabsTrigger>
            <TabsTrigger value="password">Alterar Senha</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="border-t-4 border-t-cbmepi-orange shadow-md">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg font-semibold text-cbmepi-black">
                  Editar Informações do Usuário
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome Completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Nascimento *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@exemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone *</FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 00000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Perfil *</FormLabel>
                            <Select 
                              defaultValue={field.value} 
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um perfil" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="instructor">Instrutor</SelectItem>
                                <SelectItem value="student">Aluno</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status *</FormLabel>
                            <Select 
                              defaultValue={field.value} 
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="inactive">Inativo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(`/users/${id}`)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                      >
                        Salvar Alterações
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="password">
            <Card className="border-t-4 border-t-cbmepi-orange shadow-md">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg font-semibold text-cbmepi-black">
                  Alterar Senha do Usuário
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha Atual *</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova Senha *</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Nova Senha *</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(`/users/${id}`)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                      >
                        Alterar Senha
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserEdit;

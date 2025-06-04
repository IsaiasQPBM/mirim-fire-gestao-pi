
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import Header from '@/components/Header';
import { userService } from '@/services/userService';

const userSchema = z.object({
  fullName: z.string().min(3, { message: 'Nome completo deve ter pelo menos 3 caracteres' }),
  birthDate: z.string().min(1, { message: 'Data de nascimento é obrigatória' }),
  role: z.enum(['admin', 'instructor', 'student']),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 dígitos' }),
});

type FormData = z.infer<typeof userSchema>;

const UserCreate: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userRole = localStorage.getItem('userRole') as 'admin' | 'instructor' | 'student' || 'student';
  
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Acesso Restrito</h2>
            <p className="text-gray-600 mb-6">Você não tem permissão para acessar esta página.</p>
            <Button 
              className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
              onClick={() => navigate('/dashboard')}
            >
              Voltar para Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const form = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: '',
      birthDate: '',
      role: 'student',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      console.log('📝 Submitting user creation:', data);
      
      const { data: newUser, error } = await userService.createUser({
        email: data.email,
        password: 'temp123456', // Senha temporária
        fullName: data.fullName,
        role: data.role,
        phone: data.phone,
        birthDate: data.birthDate,
      });

      if (error) {
        console.error('❌ Error creating user:', error);
        toast.error(`Erro ao cadastrar usuário: ${error}`);
        return;
      }

      console.log('✅ User created successfully:', newUser);
      toast.success('Usuário cadastrado com sucesso!');
      navigate('/users');
    } catch (error) {
      console.error('💥 Unexpected error:', error);
      toast.error('Erro inesperado ao cadastrar usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const createAdminUser = async () => {
    try {
      const { data, error } = await userService.createAdminUser();
      
      if (error) {
        toast.error(`Erro ao criar admin: ${error}`);
        return;
      }
      
      toast.success(data.message);
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Erro ao criar usuário administrador');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-t-4 border-t-cbmepi-orange shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-lg font-semibold text-cbmepi-black">
                  Cadastrar Novo Usuário
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={createAdminUser}
                  className="text-xs"
                >
                  Criar Admin
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/users')}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Cadastrando...' : 'Cadastrar Usuário'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserCreate;

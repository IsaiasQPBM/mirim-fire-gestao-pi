
import React from 'react';
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
import { User, UserRole } from '@/data/userTypes';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const userSchema = z.object({
  fullName: z.string().min(3, { message: 'Nome completo deve ter pelo menos 3 caracteres' }),
  birthDate: z.string().min(1, { message: 'Data de nascimento é obrigatória' }),
  role: z.enum(['admin', 'instructor', 'student']),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 dígitos' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não correspondem",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof userSchema>;

const UserCreate: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') as 'admin' | 'instructor' | 'student' || 'student';
  const userName = localStorage.getItem('userName') || '';
  
  // Only admin should be able to see this page
  if (userRole !== 'admin') {
    return (
      <div className="p-6">
        <Header title="Cadastrar Novo Usuário" userRole={userRole} userName={userName} />
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

  const form = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: '',
      birthDate: '',
      role: 'student',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = await supabase.from('profiles').insert({
        id: uuidv4(),
        full_name: data.fullName,
        birth_date: data.birthDate || null,
        role: data.role,
        email: data.email,
        phone: data.phone,
        status: 'active',
      });

      if (error) throw error;

      toast.success('Usuário cadastrado com sucesso!');
      navigate('/users');
    } catch (error: any) {
      toast.error('Erro ao cadastrar usuário: ' + error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title="Cadastrar Novo Usuário" userRole={userRole} userName={userName} />
      
      <div className="max-w-2xl mx-auto mt-8">
        <Card className="border-t-4 border-t-cbmepi-orange shadow-md">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-lg font-semibold text-cbmepi-black">
              Informações do Usuário
            </CardTitle>
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
                  
                  <div className="md:col-span-2">
                    <hr className="my-2" />
                    <h3 className="font-medium mb-4">Credenciais de Acesso</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha *</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Senha *</FormLabel>
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
                    onClick={() => navigate('/users')}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                  >
                    Cadastrar Usuário
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserCreate;

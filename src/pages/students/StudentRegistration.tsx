
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar as CalendarIcon, 
  ChevronRight, 
  ChevronLeft, 
  UserPlus, 
  Home, 
  Upload, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Users,
  FileText,
  CheckCircle,
  X,
  GraduationCap
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import ImageUpload from '@/components/students/ImageUpload';
import DocumentUpload from '@/components/students/DocumentUpload';
import { cn } from "@/lib/utils";
import { generateRegistrationNumber, validateCPF, validatePhone, validateEmail } from '@/lib/validationUtils';
import { studentService } from '@/services/api';
import { userService } from '@/services/api';

// Define the form schema using Zod
const formSchema = z.object({
  // Personal Information
  fullName: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  birthDate: z.date({ required_error: 'Data de nascimento é obrigatória' }),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Gênero é obrigatório' }),
  cpf: z.string().refine(value => !value || validateCPF(value), { message: 'CPF inválido' }),
  rg: z.string().optional(),
  rgIssuingBody: z.string().optional(),
  phone: z.string().refine(value => !value || validatePhone(value), { message: 'Telefone inválido' }),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  medicalInfo: z.string().optional(),
  
  // Address Information
  zipCode: z.string().min(8, { message: 'CEP deve ter 8 dígitos' }).max(9),
  street: z.string().min(3, { message: 'Rua é obrigatória' }),
  number: z.string().min(1, { message: 'Número é obrigatório' }),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, { message: 'Bairro é obrigatório' }),
  city: z.string().min(2, { message: 'Cidade é obrigatória' }),
  state: z.string().min(2, { message: 'Estado é obrigatório' }),
  
  // Academic Information
  enrollmentDate: z.date({ required_error: 'Data de ingresso é obrigatória' }),
  status: z.enum(['active', 'inactive']),
  courseIds: z.array(z.string()).nonempty({ message: 'Selecione pelo menos um curso' }),
  classIds: z.array(z.string()),
  
  // Guardian Information
  guardianName: z.string().min(3, { message: 'Nome do responsável é obrigatório' }),
  guardianRelationship: z.string().min(2, { message: 'Parentesco é obrigatório' }),
  guardianCpf: z.string().refine(value => !value || validateCPF(value), { message: 'CPF inválido' }),
  guardianPhone: z.string().refine(validatePhone, { message: 'Telefone do responsável inválido' }),
  guardianEmail: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  sameAddress: z.boolean(),
  
  // Guardian address (if different)
  guardianZipCode: z.string().min(8, { message: 'CEP deve ter 8 dígitos' }).max(9).optional(),
  guardianStreet: z.string().optional(),
  guardianNumber: z.string().optional(),
  guardianComplement: z.string().optional(),
  guardianNeighborhood: z.string().optional(),
  guardianCity: z.string().optional(),
  guardianState: z.string().optional(),
  
  // Additional Information
  notes: z.string().optional(),
});

const StudentRegistration: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]); // Changed to any[] as StudentDocument is removed
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const userRole = localStorage.getItem('userRole') as 'admin' | 'instructor' | 'student' || 'student';
  const userName = localStorage.getItem('userName') || '';
  
  const steps = [
    { id: 'personal', label: 'Informações Pessoais' },
    { id: 'address', label: 'Endereço' },
    { id: 'academic', label: 'Informações Acadêmicas' },
    { id: 'guardian', label: 'Responsável' },
    { id: 'documents', label: 'Documentos' },
    { id: 'review', label: 'Revisão e Envio' },
  ];

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      gender: 'male',
      cpf: '',
      rg: '',
      rgIssuingBody: '',
      phone: '',
      email: '',
      bloodType: undefined,
      medicalInfo: '',
      
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      
      enrollmentDate: new Date(),
      status: 'active',
      courseIds: [],
      classIds: [],
      
      guardianName: '',
      guardianRelationship: '',
      guardianCpf: '',
      guardianPhone: '',
      guardianEmail: '',
      sameAddress: true,
      
      guardianZipCode: '',
      guardianStreet: '',
      guardianNumber: '',
      guardianComplement: '',
      guardianNeighborhood: '',
      guardianCity: '',
      guardianState: '',
      
      notes: '',
    },
  });

  // Check if the user has permission to access this page
  const canAccessStudentRegistration = () => {
    return ['admin', 'instructor'].includes(userRole);
  };

  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Open confirmation dialog
    setIsSubmitDialogOpen(true);
  };
  
  const handleConfirmSubmit = async () => {
    const formData = form.getValues();
    try {
      // 1. Cria ou atualiza perfil em profiles
      const profileId = uuidv4();
      const profile = await userService.create({
        id: profileId,
        full_name: formData.fullName,
        email: formData.email || '',
      });
      // 2. Cria aluno em students com user_id do perfil
      await studentService.create({
        id: uuidv4(),
        user_id: profile.id,
        registration_number: generateRegistrationNumber(),
        birth_date: format(formData.birthDate, 'yyyy-MM-dd'),
        phone: formData.phone || '',
        status: formData.status,
        enrollment_date: format(formData.enrollmentDate, 'yyyy-MM-dd'),
        notes: formData.notes || '',
        address: {
          street: formData.street,
          number: formData.number,
          complement: formData.complement || '',
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        // Outros campos conforme necessário
      });
      setIsSubmitDialogOpen(false);
      toast({
        title: 'Aluno cadastrado com sucesso!',
        description: `O aluno ${formData.fullName} foi cadastrado com sucesso.`,
        variant: 'default',
      });
      navigate('/students');
    } catch (error: any) {
      setIsSubmitDialogOpen(false);
      toast({
        title: 'Erro ao cadastrar aluno',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  // Handle going to the next step
  const handleNextStep = () => {
    // Validate current step fields before proceeding
    const currentStepFields = getFieldsForStep(currentStep);
    
    form.trigger(currentStepFields as any[]).then((isValid) => {
      if (isValid) {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      } else {
        // Show error toast
        toast({
          title: "Campos inválidos",
          description: "Por favor, corrija os campos destacados antes de prosseguir.",
          variant: "destructive",
        });
      }
    });
  };
  
  // Handle going to the previous step
  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  
  // Get fields that need validation for the current step
  const getFieldsForStep = (step: number): (keyof z.infer<typeof formSchema>)[] => {
    switch(step) {
      case 0: // Personal information
        return ['fullName', 'birthDate', 'gender', 'cpf', 'phone', 'email'];
      case 1: // Address
        return ['zipCode', 'street', 'number', 'neighborhood', 'city', 'state'];
      case 2: // Academic
        return ['enrollmentDate', 'status', 'courseIds'];
      case 3: // Guardian
        return ['guardianName', 'guardianRelationship', 'guardianPhone'];
      case 4: // Documents
        return [];
      default:
        return [];
    }
  };
  
  // Get progress percentage
  const getProgressPercentage = () => {
    return Math.round(((currentStep + 1) / steps.length) * 100);
  };
  
  // List of available courses (would normally come from API)
  const availableCourses = [
    { id: '1', name: 'Formação Básica de Bombeiro Mirim' },
    { id: '2', name: 'Técnicas Avançadas de Resgate' },
  ];
  
  // List of blood types
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  // Handle document upload
  const handleDocumentUpload = (newDocuments: any[]) => { // Changed to any[]
    setDocuments([...documents, ...newDocuments]);
  };
  
  // Handle document removal
  const handleDocumentRemove = (documentId: string) => {
    setDocuments(documents.filter(doc => doc.id !== documentId));
  };

  if (!canAccessStudentRegistration()) {
    return (
      <div className="p-6">
        <Header title="Cadastro de Aluno" userRole={userRole} userName={userName} />
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title="Cadastro de Aluno" userRole={userRole} userName={userName} />
      
      <div className="max-w-5xl mx-auto mt-6">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <UserPlus size={24} className="text-cbmepi-orange" />
              Novo Cadastro de Aluno
            </h2>
            <span className="text-sm text-gray-500">
              Passo {currentStep + 1} de {steps.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-cbmepi-orange h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          
          <div className="hidden md:flex justify-between mt-2">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={cn(
                  "text-xs font-medium px-2",
                  index <= currentStep ? "text-cbmepi-orange" : "text-gray-500"
                )}
              >
                {step.label}
              </div>
            ))}
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="border-t-4 border-t-cbmepi-orange">
              <CardContent className="p-6">
                {/* Step 1: Personal Information */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <User size={20} className="text-cbmepi-orange" />
                      <h2 className="text-xl font-semibold">Informações Pessoais</h2>
                    </div>
                    
                    <div className="flex flex-col items-center mb-6">
                      <ImageUpload 
                        value={profileImage}
                        onChange={setProfileImage}
                      />
                      <p className="text-sm text-gray-500 mt-2">Foto do aluno (opcional)</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo*</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data de Nascimento*</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "dd/MM/yyyy", {
                                        locale: ptBR,
                                      })
                                    ) : (
                                      <span>Selecione uma data</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date('1900-01-01')
                                  }
                                  initialFocus
                                  locale={ptBR}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Gênero*</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="male" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Masculino
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="female" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Feminino
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="other" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Outro
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="000.000.000-00" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="rg"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>RG</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="rgIssuingBody"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Órgão Emissor</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="(00) 00000-0000" />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bloodType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo Sanguíneo</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {bloodTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="medicalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Informações Médicas Relevantes</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Alergias, condições especiais, medicações, etc."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {/* Step 2: Address */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={20} className="text-cbmepi-orange" />
                      <h2 className="text-xl font-semibold">Endereço</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP*</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="00000-000" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Rua*</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número*</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="complement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="neighborhood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro*</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade*</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado*</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={2} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
                
                {/* Step 3: Academic Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap size={20} className="text-cbmepi-orange" />
                      <h2 className="text-xl font-semibold">Informações Acadêmicas</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="enrollmentDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data de Ingresso*</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "dd/MM/yyyy", {
                                        locale: ptBR,
                                      })
                                    ) : (
                                      <span>Selecione uma data</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date('2020-01-01')
                                  }
                                  initialFocus
                                  locale={ptBR}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Status*</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
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
                      
                      <FormField
                        control={form.control}
                        name="courseIds"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Cursos*</FormLabel>
                            <div className="grid grid-cols-1 gap-2">
                              {availableCourses.map((course) => (
                                <div key={course.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={field.value.includes(course.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, course.id]);
                                      } else {
                                        field.onChange(field.value.filter(id => id !== course.id));
                                      }
                                    }}
                                    id={`course-${course.id}`}
                                  />
                                  <label
                                    htmlFor={`course-${course.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {course.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="classIds"
                        render={({ field }) => {
                          const selectedCourseIds = form.watch('courseIds');
                          const availableClasses = []; // TODO: Popular com classes reais do Supabase conforme os cursos selecionados
                          
                          return (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Turmas</FormLabel>
                              {selectedCourseIds.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                  Selecione pelo menos um curso primeiro
                                </p>
                              ) : availableClasses.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                  Não há turmas disponíveis para os cursos selecionados
                                </p>
                              ) : (
                                <div className="grid grid-cols-1 gap-2">
                                  {availableClasses.map((cls) => (
                                    <div key={cls.id} className="flex items-center space-x-2">
                                      <Checkbox
                                        checked={field.value.includes(cls.id)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            field.onChange([...field.value, cls.id]);
                                          } else {
                                            field.onChange(field.value.filter(id => id !== cls.id));
                                          }
                                        }}
                                        id={`class-${cls.id}`}
                                      />
                                      <label
                                        htmlFor={`class-${cls.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {cls.name} ({availableCourses.find(c => c.id === cls.courseId)?.name})
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Step 4: Guardian Information */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Users size={20} className="text-cbmepi-orange" />
                      <h2 className="text-xl font-semibold">Informações do Responsável</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="guardianName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do Responsável*</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="guardianRelationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parentesco*</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Pai">Pai</SelectItem>
                                <SelectItem value="Mãe">Mãe</SelectItem>
                                <SelectItem value="Avô/Avó">Avô/Avó</SelectItem>
                                <SelectItem value="Tio/Tia">Tio/Tia</SelectItem>
                                <SelectItem value="Outro">Outro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="guardianCpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF do Responsável</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="000.000.000-00" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="guardianPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone do Responsável*</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="(00) 00000-0000" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="guardianEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email do Responsável</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="sameAddress"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Mesmo endereço do aluno
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Marque esta opção se o responsável mora no mesmo endereço do aluno
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {!form.watch('sameAddress') && (
                      <div className="border-t pt-6 mt-6">
                        <h3 className="text-sm font-medium mb-4">Endereço do Responsável</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="guardianZipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CEP*</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="00000-000" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="guardianStreet"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Rua*</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="guardianNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Número*</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="guardianComplement"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Complemento</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="guardianNeighborhood"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bairro*</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="guardianCity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cidade*</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="guardianState"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estado*</FormLabel>
                                <FormControl>
                                  <Input {...field} maxLength={2} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Step 5: Documents */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText size={20} className="text-cbmepi-orange" />
                      <h2 className="text-xl font-semibold">Documentos</h2>
                    </div>
                    
                    <DocumentUpload 
                      documents={documents} 
                      onUpload={handleDocumentUpload}
                      onRemove={handleDocumentRemove}
                    />
                  </div>
                )}
                
                {/* Step 6: Review and Submit */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle size={20} className="text-cbmepi-orange" />
                      <h2 className="text-xl font-semibold">Revisão e Envio</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                          <User size={16} className="text-cbmepi-orange" />
                          Informações Pessoais
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                          <div>
                            <p className="text-sm text-gray-500">Nome Completo:</p>
                            <p className="font-medium">{form.watch('fullName')}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Data de Nascimento:</p>
                            <p className="font-medium">
                              {form.watch('birthDate') && format(form.watch('birthDate'), 'dd/MM/yyyy', { locale: ptBR })}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Gênero:</p>
                            <p className="font-medium">
                              {form.watch('gender') === 'male' ? 'Masculino' : 
                               form.watch('gender') === 'female' ? 'Feminino' : 'Outro'}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">CPF:</p>
                            <p className="font-medium">{form.watch('cpf') || '—'}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">RG:</p>
                            <p className="font-medium">{form.watch('rg') || '—'}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Órgão Emissor:</p>
                            <p className="font-medium">{form.watch('rgIssuingBody') || '—'}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Telefone:</p>
                            <p className="font-medium">{form.watch('phone') || '—'}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Email:</p>
                            <p className="font-medium">{form.watch('email') || '—'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                          <MapPin size={16} className="text-cbmepi-orange" />
                          Endereço
                        </h3>
                        
                        <p className="font-medium">
                          {[
                            form.watch('street'),
                            form.watch('number'),
                            form.watch('complement'),
                          ].filter(Boolean).join(', ')}
                        </p>
                        <p className="font-medium">
                          {[
                            form.watch('neighborhood'),
                            form.watch('city'),
                            form.watch('state'),
                            form.watch('zipCode'),
                          ].filter(Boolean).join(', ')}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                          <GraduationCap size={16} className="text-cbmepi-orange" />
                          Informações Acadêmicas
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                          <div>
                            <p className="text-sm text-gray-500">Data de Ingresso:</p>
                            <p className="font-medium">
                              {form.watch('enrollmentDate') && format(form.watch('enrollmentDate'), 'dd/MM/yyyy', { locale: ptBR })}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Status:</p>
                            <p className="font-medium">
                              {form.watch('status') === 'active' ? 'Ativo' : 'Inativo'}
                            </p>
                          </div>
                          
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-500">Cursos:</p>
                            <ul className="list-disc list-inside">
                              {form.watch('courseIds').map(courseId => (
                                <li key={courseId} className="font-medium">
                                  {availableCourses.find(c => c.id === courseId)?.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {form.watch('classIds').length > 0 && (
                            <div className="md:col-span-2">
                              <p className="text-sm text-gray-500">Turmas:</p>
                              <ul className="list-disc list-inside">
                                {form.watch('classIds').map(classId => (
                                  <li key={classId} className="font-medium">
                                    {/* mockClasses.find(c => c.id === classId)?.name */}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                          <Users size={16} className="text-cbmepi-orange" />
                          Informações do Responsável
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                          <div>
                            <p className="text-sm text-gray-500">Nome:</p>
                            <p className="font-medium">{form.watch('guardianName')}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Parentesco:</p>
                            <p className="font-medium">{form.watch('guardianRelationship')}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">CPF:</p>
                            <p className="font-medium">{form.watch('guardianCpf') || '—'}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Telefone:</p>
                            <p className="font-medium">{form.watch('guardianPhone')}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Email:</p>
                            <p className="font-medium">{form.watch('guardianEmail') || '—'}</p>
                          </div>
                        </div>
                        
                        {!form.watch('sameAddress') && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-gray-500">Endereço do Responsável:</p>
                            <p className="font-medium">
                              {[
                                form.watch('guardianStreet'),
                                form.watch('guardianNumber'),
                                form.watch('guardianComplement'),
                              ].filter(Boolean).join(', ')}
                            </p>
                            <p className="font-medium">
                              {[
                                form.watch('guardianNeighborhood'),
                                form.watch('guardianCity'),
                                form.watch('guardianState'),
                                form.watch('guardianZipCode'),
                              ].filter(Boolean).join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                          <FileText size={16} className="text-cbmepi-orange" />
                          Documentos
                        </h3>
                        
                        {documents.length === 0 ? (
                          <p className="text-gray-500">Nenhum documento anexado</p>
                        ) : (
                          <ul className="list-disc list-inside">
                            {documents.map((doc) => (
                              <li key={doc.id} className="font-medium">
                                {doc.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações Adicionais</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Informações adicionais sobre o aluno, se necessário"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="border-t pt-4 mt-6">
                      <Button type="submit" className="w-full bg-cbmepi-orange hover:bg-cbmepi-orange/90">
                        Finalizar Cadastro
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Navigation buttons */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                >
                  Próximo <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </form>
        </Form>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cadastro</DialogTitle>
            <DialogDescription>
              Deseja realmente cadastrar este aluno?
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-gray-700">
              Todos os dados foram preenchidos corretamente? Após o cadastro, algumas informações precisarão ser editadas por um administrador.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSubmitDialogOpen(false)}
            >
              <X size={16} className="mr-2" />
              Cancelar
            </Button>
            <Button
              className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
              onClick={handleConfirmSubmit}
            >
              <CheckCircle size={16} className="mr-2" />
              Confirmar Cadastro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentRegistration;

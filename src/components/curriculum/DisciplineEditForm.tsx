import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(3, { message: 'O nome da disciplina deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' }),
  courseId: z.string().min(1, { message: 'Selecione um curso' }),
  theoryHours: z.number().min(0, { message: 'A carga horária teórica não pode ser negativa' }),
  practiceHours: z.number().min(0, { message: 'A carga horária prática não pode ser negativa' }),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

type DisciplineEditFormProps = {
  initialValues?: Partial<FormValues>;
  courses: { id: string; name: string }[];
  onSubmit: (values: FormValues) => void;
  loading?: boolean;
  submitLabel?: string;
};

const DisciplineEditForm: React.FC<DisciplineEditFormProps> = ({
  initialValues,
  courses,
  onSubmit,
  loading = false,
  submitLabel = 'Salvar',
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      courseId: '',
      theoryHours: 10,
      practiceHours: 10,
      isActive: true,
      ...initialValues,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name || '',
        description: initialValues.description || '',
        courseId: initialValues.courseId || '',
        theoryHours: initialValues.theoryHours ?? 10,
        practiceHours: initialValues.practiceHours ?? 10,
        isActive: initialValues.isActive ?? true,
      });
    }
    // eslint-disable-next-line
  }, [initialValues]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Disciplina</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nome" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Descrição detalhada" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curso</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="theoryHours"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Carga Horária Teórica</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="practiceHours"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Carga Horária Prática</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select onValueChange={v => field.onChange(v === 'true')} value={field.value ? 'true' : 'false'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Ativa</SelectItem>
                    <SelectItem value="false">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
};

export default DisciplineEditForm; 

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { X, Save, Clipboard, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ObservationDialogProps {
  studentName: string;
  onClose: () => void;
  onSave: (observation: any) => void;
}

const ObservationDialog: React.FC<ObservationDialogProps> = ({ studentName, onClose, onSave }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    category: '',
    description: '',
    severity: 'medium',
    recommendations: ''
  });

  const observationTypes = [
    { value: 'behavioral', label: 'Comportamental' },
    { value: 'academic', label: 'Acadêmico' },
    { value: 'social', label: 'Social' },
    { value: 'physical', label: 'Físico' },
    { value: 'attendance', label: 'Frequência' }
  ];

  const categories = [
    { value: 'positive', label: 'Positiva', icon: CheckCircle, color: 'text-green-600' },
    { value: 'neutral', label: 'Neutra', icon: Info, color: 'text-blue-600' },
    { value: 'attention', label: 'Requer Atenção', icon: AlertCircle, color: 'text-yellow-600' },
    { value: 'concern', label: 'Preocupante', icon: AlertCircle, color: 'text-red-600' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.type || !formData.category || !formData.description.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    const observation = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      category: formData.category,
      description: formData.description,
      severity: formData.severity,
      recommendations: formData.recommendations,
      date: new Date().toISOString(),
      observerName: localStorage.getItem('userName') || 'Sistema',
      observerRole: localStorage.getItem('userRole') || 'admin'
    };

    onSave(observation);
    toast({
      title: "Observação registrada",
      description: `A observação pedagógica foi registrada para ${studentName}.`,
    });
    onClose();
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Clipboard className="mr-2" size={20} />
            Nova Observação Pedagógica
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Aluno:</strong> {studentName}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Observação *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Título resumido da observação"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {observationTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => {
                    const Icon = category.icon;
                    return (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <Icon size={16} className={category.color} />
                          {category.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Prioridade</Label>
              <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição Detalhada *</Label>
            <Textarea
              id="description"
              rows={6}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva detalhadamente a observação, incluindo contexto, comportamentos observados, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendations">Recomendações e Ações</Label>
            <Textarea
              id="recommendations"
              rows={4}
              value={formData.recommendations}
              onChange={(e) => handleInputChange('recommendations', e.target.value)}
              placeholder="Sugestões de acompanhamento, ações recomendadas, estratégias pedagógicas, etc."
            />
          </div>

          {selectedCategory && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
              <selectedCategory.icon size={20} className={selectedCategory.color} />
              <span className="text-sm font-medium">Categoria: {selectedCategory.label}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
            <Save className="mr-2" size={16} />
            Salvar Observação
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ObservationDialog;

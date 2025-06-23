
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save, X, Calendar } from 'lucide-react';

interface ObservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentId: string;
}

const ObservationForm: React.FC<ObservationFormProps> = ({ 
  isOpen, 
  onClose, 
  studentName, 
  studentId 
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'behavioral',
    priority: 'normal',
    description: '',
    followUpRequired: false,
    followUpDate: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.description.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "A descrição da observação é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    if (formData.followUpRequired && !formData.followUpDate) {
      toast({
        title: "Data de acompanhamento",
        description: "Quando o acompanhamento é necessário, a data deve ser informada.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    // Simular salvamento
    setTimeout(() => {
      toast({
        title: "Observação registrada",
        description: `Observação para ${studentName} foi registrada com sucesso.`,
      });
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'behavioral',
        priority: 'normal',
        description: '',
        followUpRequired: false,
        followUpDate: ''
      });
      setIsSaving(false);
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    if (formData.description.trim()) {
      if (confirm("Deseja realmente cancelar? Os dados não salvos serão perdidos.")) {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          type: 'behavioral',
          priority: 'normal',
          description: '',
          followUpRequired: false,
          followUpDate: ''
        });
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Observação Pedagógica</DialogTitle>
          <DialogDescription>
            Registrar observação para: <span className="font-medium">{studentName}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                disabled={isSaving}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="behavioral">Comportamental</SelectItem>
                  <SelectItem value="academic">Acadêmica</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="emotional">Emocional</SelectItem>
                  <SelectItem value="disciplinary">Disciplinar</SelectItem>
                  <SelectItem value="positive">Positiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição da Observação</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva detalhadamente a observação..."
              rows={5}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="followUp">Acompanhamento Necessário</Label>
                <p className="text-sm text-gray-500">
                  Marque se esta observação requer acompanhamento futuro
                </p>
              </div>
              <Switch
                id="followUp"
                checked={formData.followUpRequired}
                onCheckedChange={(checked) => handleInputChange('followUpRequired', checked)}
                disabled={isSaving}
              />
            </div>

            {formData.followUpRequired && (
              <div className="space-y-2">
                <Label htmlFor="followUpDate">Data para Acompanhamento</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isSaving}
                />
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            <X size={16} className="mr-1" />
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
          >
            <Save size={16} className="mr-1" />
            {isSaving ? 'Salvando...' : 'Salvar Observação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ObservationForm;

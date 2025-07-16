
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Users, Loader2 } from 'lucide-react';
import { MessageFormData } from './types';

interface RecipientSelectorProps {
  formData: MessageFormData;
  onInputChange: (field: string, value: string | string[]) => void;
  onRecipientToggle: (recipientId: string, checked: boolean) => void;
  users?: any[];
  classes?: any[];
  loadingUsers?: boolean;
  loadingClasses?: boolean;
}

export const RecipientSelector: React.FC<RecipientSelectorProps> = ({
  formData,
  onInputChange,
  onRecipientToggle,
  users = [],
  classes = [],
  loadingUsers = false,
  loadingClasses = false
}) => {
  return (
    <>
      {/* Recipient Type */}
      <div className="space-y-2">
        <Label>Tipo de Destinatário</Label>
        <Select 
          value={formData.recipientType} 
          onValueChange={(value) => onInputChange('recipientType', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="class">Turma Completa</SelectItem>
            <SelectItem value="all">Todos os Usuários</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Recipients Selection */}
      {formData.recipientType === 'individual' && (
        <div className="space-y-2">
          <Label>Destinatários</Label>
          <div className="border rounded-lg p-4 max-h-40 overflow-y-auto space-y-2">
            {loadingUsers ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-cbmepi-orange" />
                <span className="ml-2 text-sm text-gray-600">Carregando usuários...</span>
              </div>
            ) : users.length > 0 ? (
              users.map(user => (
                <div key={user.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={user.id}
                    checked={formData.recipients.includes(user.id)}
                    onCheckedChange={(checked) => onRecipientToggle(user.id, checked as boolean)}
                  />
                  <Label htmlFor={user.id} className="flex items-center space-x-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>{user.profiles?.full_name || 'Nome não disponível'}</span>
                    <span className="text-xs text-gray-500">({user.profiles?.role || 'N/A'})</span>
                  </Label>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">Nenhum usuário encontrado</p>
              </div>
            )}
          </div>
        </div>
      )}

      {formData.recipientType === 'class' && (
        <div className="space-y-2">
          <Label>Selecionar Turma</Label>
          <div className="border rounded-lg p-4 space-y-2">
            {loadingClasses ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-cbmepi-orange" />
                <span className="ml-2 text-sm text-gray-600">Carregando turmas...</span>
              </div>
            ) : classes.length > 0 ? (
              classes.map(classItem => (
                <div key={classItem.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={classItem.id}
                    checked={formData.recipients.includes(classItem.id)}
                    onCheckedChange={(checked) => onRecipientToggle(classItem.id, checked as boolean)}
                  />
                  <Label htmlFor={classItem.id} className="flex items-center space-x-2 cursor-pointer">
                    <Users className="h-4 w-4" />
                    <span>{classItem.name}</span>
                  </Label>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">Nenhuma turma encontrada</p>
              </div>
            )}
          </div>
        </div>
      )}

      {formData.recipientType === 'all' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-medium">
              Mensagem será enviada para todos os usuários do sistema
            </span>
          </div>
        </div>
      )}
    </>
  );
};

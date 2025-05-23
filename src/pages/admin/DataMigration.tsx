
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { migrationService } from '@/services/migrationService';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Database, Check, AlertTriangle, Upload } from 'lucide-react';

const DataMigration: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationResults, setMigrationResults] = useState<any>(null);
  const [fileData, setFileData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Verificar se o usuário é um administrador
  if (profile?.role !== 'admin') {
    navigate('/dashboard');
    toast({
      variant: 'destructive',
      title: 'Acesso negado',
      description: 'Você não tem permissão para acessar esta página.',
    });
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setFileData(json);
        toast({
          title: 'Arquivo carregado',
          description: `Dados prontos para migração: ${Object.keys(json).join(', ')}`,
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao ler arquivo',
          description: 'O arquivo não é um JSON válido.',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleCreateAdminUser = async () => {
    setIsLoading(true);
    try {
      const result = await migrationService.createAdminUser();
      toast({
        variant: result.success ? 'default' : 'destructive',
        title: result.success ? 'Sucesso' : 'Erro',
        description: result.message,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Falha ao criar usuário administrador',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMigrateData = async () => {
    if (!fileData) {
      toast({
        variant: 'destructive',
        title: 'Nenhum dado para migrar',
        description: 'Por favor, carregue um arquivo JSON com os dados para migração.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await migrationService.executeMigration(fileData);
      setMigrationResults(result);
      
      toast({
        variant: result.success ? 'default' : 'destructive',
        title: result.success ? 'Migração concluída' : 'Erro na migração',
        description: result.success 
          ? 'Dados migrados com sucesso.' 
          : `Falha na migração: ${result.error}`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro na migração',
        description: error.message || 'Ocorreu um erro durante a migração dos dados',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Migração de Dados para Supabase</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Criar Usuário Administrador</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Cria o usuário administrador principal no Supabase com as seguintes credenciais:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Email: erisman@admin.com</li>
              <li>Senha: admin</li>
              <li>Perfil: Administrador</li>
            </ul>
            <Button
              onClick={handleCreateAdminUser}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Criar Administrador
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Migrar Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Faça o upload de um arquivo JSON contendo os dados a serem migrados para o Supabase.
            </p>
            <div className="mb-4">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <Button
              onClick={handleMigrateData}
              disabled={isLoading || !fileData}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrando dados...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Iniciar Migração
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {migrationResults && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Resultados da Migração</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(migrationResults.results).map(([key, value]: [string, any]) => (
                <div key={key} className="p-4 border rounded-md">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium capitalize">{key}</h3>
                    {value.success ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{value.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataMigration;

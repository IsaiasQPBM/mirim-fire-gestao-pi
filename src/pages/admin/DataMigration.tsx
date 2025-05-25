
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { migrationService } from '@/services/migration/migrationService';
import { useAuth } from '@/hooks/useAuth';
import type { ExecutionResult } from '@/services/migration/types';
import { Loader2, Database, Check, AlertTriangle, Upload, UserCog, Search, UserPlus } from 'lucide-react';

const DataMigration: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationResults, setMigrationResults] = useState<any>(null);
  const [fileData, setFileData] = useState<any>(null);
  const [adminDiagnosisResult, setAdminDiagnosisResult] = useState<ExecutionResult | null>(null);
  const [isRunningAdminDiagnosis, setIsRunningAdminDiagnosis] = useState(false);
  const [isRunningAdminMigration, setIsRunningAdminMigration] = useState(false);
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

  const runAdminDiagnosis = async () => {
    setIsRunningAdminDiagnosis(true);
    setAdminDiagnosisResult(null);
    
    try {
      const result = await migrationService.diagnoseAdminUser();
      setAdminDiagnosisResult(result);
      
      toast({
        variant: result.success ? 'default' : 'destructive',
        title: result.success ? 'Diagnóstico Completo' : 'Problema Detectado',
        description: result.message,
      });
    } catch (error) {
      console.error('Erro no diagnóstico:', error);
      toast({
        variant: 'destructive',
        title: 'Erro no diagnóstico',
        description: 'Falha ao executar diagnóstico do administrador.',
      });
    } finally {
      setIsRunningAdminDiagnosis(false);
    }
  };

  const runAdminUserMigration = async () => {
    setIsRunningAdminMigration(true);
    
    try {
      const result = await migrationService.runAdminUserMigration();
      setAdminDiagnosisResult(result);
      
      toast({
        variant: result.success ? 'default' : 'destructive',
        title: result.success ? 'Administrador Configurado' : 'Erro na Configuração',
        description: result.message,
      });
    } catch (error) {
      console.error('Erro na migração do admin:', error);
      toast({
        variant: 'destructive',
        title: 'Erro na migração',
        description: 'Falha ao criar/atualizar usuário administrador.',
      });
    } finally {
      setIsRunningAdminMigration(false);
    }
  };

  // Verificar se o usuário é um administrador
  if (profile?.role !== 'admin') {
    navigate('/dashboard');
    toast({
      variant: 'destructive',
      title: 'Acesso negado',
      description: 'Você não tem permissão para acessar esta página.',
    });
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Migração de Dados para Supabase</h1>

      {/* Admin User Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="w-5 h-5" />
            Gerenciamento do Usuário Administrador
          </CardTitle>
          <CardDescription>
            Configure e diagnostique problemas com o usuário administrador principal do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button
              onClick={runAdminDiagnosis}
              disabled={isRunningAdminDiagnosis}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              {isRunningAdminDiagnosis ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Search className="w-6 h-6" />
              )}
              <span className="font-medium">Diagnosticar Admin</span>
              <span className="text-sm text-muted-foreground text-center">
                Verificar status e problemas do usuário administrador
              </span>
            </Button>

            <Button
              onClick={runAdminUserMigration}
              disabled={isRunningAdminMigration}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              {isRunningAdminMigration ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <UserPlus className="w-6 h-6" />
              )}
              <span className="font-medium">Criar/Reparar Admin</span>
              <span className="text-sm text-muted-foreground text-center">
                Criar ou reparar o usuário administrador
              </span>
            </Button>
          </div>

          {/* Admin diagnosis results */}
          {adminDiagnosisResult && (
            <Alert className={adminDiagnosisResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertTriangle className={`w-4 h-4 ${adminDiagnosisResult.success ? 'text-green-600' : 'text-red-600'}`} />
              <AlertTitle className={adminDiagnosisResult.success ? 'text-green-800' : 'text-red-800'}>
                {adminDiagnosisResult.success ? 'Diagnóstico Completo' : 'Problema Detectado'}
              </AlertTitle>
              <AlertDescription className={adminDiagnosisResult.success ? 'text-green-700' : 'text-red-700'}>
                {adminDiagnosisResult.message}
                {adminDiagnosisResult.duration && (
                  <div className="mt-2 text-sm">
                    Tempo de execução: {adminDiagnosisResult.duration}ms
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Credenciais do Administrador:</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p><strong>Email:</strong> erisman@admin.com</p>
              <p><strong>Senha:</strong> admin</p>
              <p><strong>Perfil:</strong> Administrador Sistema</p>
              <p><strong>Permissões:</strong> Acesso total ao sistema</p>
            </div>
          </div>
        </CardContent>
      </Card>

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

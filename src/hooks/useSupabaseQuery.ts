
import { useState, useEffect, useCallback } from 'react';
import { cacheService } from '@/services/cacheService';
import { toast } from '@/hooks/use-toast';

interface QueryOptions<T> {
  cacheTTL?: number;
  cacheKey?: string;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  showToastOnError?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

// Hook genérico para consultas Supabase com cache e fallbacks
export function useSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: string | null }>,
  options: QueryOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);

  const {
    cacheTTL,
    cacheKey,
    enabled = true,
    onSuccess,
    onError,
    showToastOnError = true,
    retryCount = 3,
    retryDelay = 1000,
  } = options;

  // Verificar se tem dado em cache
  const getCachedData = useCallback(() => {
    if (!cacheKey) return null;
    return cacheService.get<T>(cacheKey);
  }, [cacheKey]);

  // Função de fetch com retry
  const fetchData = useCallback(async (shouldRetry = true) => {
    try {
      if (!enabled) {
        setLoading(false);
        return;
      }

      // Tente usar dados do cache primeiro
      if (cacheKey) {
        const cachedData = getCachedData();
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          onSuccess?.(cachedData);
          return;
        }
      }

      setLoading(true);
      const { data: responseData, error: responseError } = await queryFn();

      if (responseError) {
        setError(responseError);
        setLoading(false);
        onError?.(responseError);

        if (showToastOnError) {
          toast({
            variant: 'destructive',
            title: 'Erro ao carregar dados',
            description: responseError,
          });
        }

        // Retry lógica
        if (shouldRetry && retryAttempts < retryCount) {
          setTimeout(() => {
            setRetryAttempts(prev => prev + 1);
            fetchData(true);
          }, retryDelay * Math.pow(2, retryAttempts)); // Exponential backoff
        }
        return;
      }

      if (responseData) {
        setData(responseData);
        setError(null);
        onSuccess?.(responseData);

        // Cache o resultado se tiver cacheKey
        if (cacheKey && cacheTTL) {
          cacheService.set(cacheKey, responseData, cacheTTL);
        }
      }

      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
      setLoading(false);
      onError?.(err.message || 'Erro desconhecido');

      if (showToastOnError) {
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar dados',
          description: err.message || 'Ocorreu um erro inesperado',
        });
      }
    }
  }, [
    queryFn,
    enabled,
    retryAttempts,
    retryCount,
    retryDelay,
    cacheKey,
    cacheTTL,
    getCachedData,
    onSuccess,
    onError,
    showToastOnError,
  ]);

  // Executar query quando o hook for montado ou as dependências mudarem
  useEffect(() => {
    if (enabled) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [enabled, fetchData]);

  // Função para forçar um refresh ignorando o cache
  const refetch = useCallback(() => {
    setRetryAttempts(0);
    // Limpe o cache para esta consulta se houver uma chave de cache
    if (cacheKey) {
      cacheService.remove(cacheKey);
    }
    return fetchData(false);
  }, [cacheKey, fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    retryAttempts,
  };
}

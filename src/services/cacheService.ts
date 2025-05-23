
// Cache Service - Para melhorar a performance e experiência offline
class CacheService {
  private cache: Map<string, { data: any, timestamp: number, ttl: number }> = new Map();
  
  // Definir valores padrão para TTL (Time To Live) em milissegundos
  private defaultTTL = {
    short: 60 * 1000, // 1 minuto
    medium: 5 * 60 * 1000, // 5 minutos
    long: 30 * 60 * 1000, // 30 minutos
    session: 24 * 60 * 60 * 1000, // 24 horas
  };

  // Armazenar dados no cache
  set(key: string, data: any, ttl: number = this.defaultTTL.medium): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    this.persistToLocalStorage();
  }

  // Obter dados do cache
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    // Verificar se o cache expirou
    if (Date.now() > cached.timestamp + cached.ttl) {
      this.cache.delete(key);
      this.persistToLocalStorage();
      return null;
    }
    
    return cached.data as T;
  }

  // Verificar se uma chave existe e está válida no cache
  has(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() <= cached.timestamp + cached.ttl;
  }

  // Remover item do cache
  remove(key: string): void {
    this.cache.delete(key);
    this.persistToLocalStorage();
  }

  // Limpar cache expirado
  clearExpired(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.timestamp + value.ttl) {
        this.cache.delete(key);
      }
    }
    this.persistToLocalStorage();
  }

  // Limpar todo o cache
  clearAll(): void {
    this.cache.clear();
    localStorage.removeItem('app_cache');
  }

  // Persistir cache no localStorage
  private persistToLocalStorage(): void {
    try {
      const serialized = JSON.stringify(Array.from(this.cache.entries()));
      localStorage.setItem('app_cache', serialized);
    } catch (error) {
      console.error('Error persisting cache to localStorage', error);
    }
  }

  // Carregar cache do localStorage
  loadFromLocalStorage(): void {
    try {
      const serialized = localStorage.getItem('app_cache');
      if (serialized) {
        const entries = JSON.parse(serialized);
        this.cache = new Map(entries);
        // Limpar itens expirados após carregar
        this.clearExpired();
      }
    } catch (error) {
      console.error('Error loading cache from localStorage', error);
      this.clearAll(); // Reset em caso de erro
    }
  }

  // Funções auxiliares para diferentes TTL
  setShort(key: string, data: any): void {
    this.set(key, data, this.defaultTTL.short);
  }

  setMedium(key: string, data: any): void {
    this.set(key, data, this.defaultTTL.medium);
  }

  setLong(key: string, data: any): void {
    this.set(key, data, this.defaultTTL.long);
  }

  setSession(key: string, data: any): void {
    this.set(key, data, this.defaultTTL.session);
  }

  // Método para gerar chave de cache baseada em parâmetros
  buildKey(base: string, params?: Record<string, any>): string {
    if (!params) return base;
    const sortedParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join('&');
    return sortedParams ? `${base}?${sortedParams}` : base;
  }
}

// Singleton
export const cacheService = new CacheService();

// Inicializar o cache ao importar este módulo
cacheService.loadFromLocalStorage();

// Configurar limpeza automática de cache expirado
setInterval(() => {
  cacheService.clearExpired();
}, 5 * 60 * 1000); // Limpar a cada 5 minutos

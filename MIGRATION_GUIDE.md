# 🚀 Guia de Migração: Mock Data → Supabase

Este guia mostra como migrar seu sistema de dados simulados para o Supabase de forma gradual e segura.

## 📋 Pré-requisitos

1. ✅ Projeto Supabase criado
2. ✅ Variáveis de ambiente configuradas
3. ✅ Dependências instaladas (`@supabase/supabase-js`)
4. ✅ Schema do banco configurado

## 🔄 Estratégia de Migração

### Fase 1: Configuração Base ✅
- [x] Cliente Supabase configurado
- [x] Serviços de API criados
- [x] Hooks React Query implementados
- [x] Autenticação configurada

### Fase 2: Migração Gradual
Migre um módulo por vez, seguindo esta ordem:

1. **Usuários** (mais simples)
2. **Cursos** (dados básicos)
3. **Turmas** (relacionamentos simples)
4. **Alunos** (relacionamentos complexos)
5. **Avaliações** (lógica de negócio)
6. **Comunicação** (real-time)

### Fase 3: Testes e Otimização
- Testes de integração
- Otimização de queries
- Cache e performance

## 🛠️ Passo a Passo da Migração

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 2. Migrar um Componente (Exemplo: UsersList)

#### Antes (Mock Data):
```tsx
import { mockUsers } from '@/data/userTypes';

const [users, setUsers] = useState<User[]>(mockUsers);
```

#### Depois (Supabase):
```tsx
import { useUsers } from '@/hooks/useData';

const { data: users, isLoading, error } = useUsers();
```

### 3. Adicionar Estados de Loading e Error

```tsx
if (isLoading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage error={error} />;
}
```

### 4. Implementar Mutations

```tsx
const createUserMutation = useCreateUser();

const handleCreateUser = async (userData) => {
  try {
    await createUserMutation.mutateAsync(userData);
    toast.success('Usuário criado com sucesso!');
  } catch (error) {
    toast.error('Erro ao criar usuário');
  }
};
```

## 📁 Estrutura de Arquivos Migrados

```
src/
├── lib/
│   └── supabase.ts          ✅ Cliente Supabase
├── services/
│   └── api.ts              ✅ Serviços de API
├── hooks/
│   ├── useAuth.ts          ✅ Autenticação
│   └── useData.ts          ✅ Hooks de dados
└── pages/
    └── users/
        └── UsersList.tsx    ✅ Migrado para Supabase
```

## 🔧 Padrões de Migração

### 1. Substituir Importações

```tsx
// ❌ Antes
import { mockUsers } from '@/data/userTypes';

// ✅ Depois
import { useUsers } from '@/hooks/useData';
```

### 2. Substituir Estados

```tsx
// ❌ Antes
const [users, setUsers] = useState(mockUsers);

// ✅ Depois
const { data: users, isLoading, error } = useUsers();
```

### 3. Substituir Operações CRUD

```tsx
// ❌ Antes
const handleUpdate = (id, data) => {
  setUsers(users.map(u => u.id === id ? { ...u, ...data } : u));
};

// ✅ Depois
const updateMutation = useUpdateUser();
const handleUpdate = async (id, data) => {
  await updateMutation.mutateAsync({ id, updates: data });
};
```

### 4. Adicionar Tratamento de Erros

```tsx
// ✅ Sempre adicionar
if (error) {
  return <ErrorMessage error={error} />;
}
```

## 📊 Checklist de Migração por Módulo

### 👥 Módulo Usuários
- [x] UsersList.tsx
- [ ] UserCreate.tsx
- [ ] UserEdit.tsx
- [ ] UserProfile.tsx
- [ ] UserPermissions.tsx

### 🎓 Módulo Alunos
- [ ] StudentsList.tsx
- [ ] StudentRegistration.tsx
- [ ] StudentDetail.tsx
- [ ] StudentCard.tsx

### 📚 Módulo Currículo
- [ ] CoursesList.tsx
- [ ] CourseCreate.tsx
- [ ] CourseEdit.tsx
- [ ] CourseView.tsx
- [ ] ClassesList.tsx
- [ ] ClassCreate.tsx
- [ ] ClassEdit.tsx
- [ ] ClassView.tsx
- [ ] DisciplinesList.tsx
- [ ] DisciplineCreate.tsx
- [ ] DisciplineEdit.tsx
- [ ] DisciplineView.tsx

### 📝 Módulo Pedagógico
- [ ] AssessmentsList.tsx
- [ ] AssessmentCreate.tsx
- [ ] AssessmentEdit.tsx
- [ ] AssessmentView.tsx
- [ ] AssessmentTake.tsx
- [ ] ResultsView.tsx
- [ ] ObservationsList.tsx
- [ ] ObservationCreate.tsx
- [ ] QuestionBank.tsx
- [ ] StudentDashboard.tsx

### 💬 Módulo Comunicação
- [ ] MessagesInbox.tsx
- [ ] MessagesNew.tsx
- [ ] ComposeMessage.tsx
- [ ] AnnouncementsList.tsx
- [ ] AnnouncementCreate.tsx
- [ ] NotificationsList.tsx

### 📈 Módulo Relatórios
- [ ] ReportsDashboard.tsx
- [ ] StudentBulletin.tsx
- [ ] AttendanceReport.tsx
- [ ] ApprovalStats.tsx

## 🚨 Problemas Comuns e Soluções

### 1. Erro de Tipos TypeScript
```tsx
// ❌ Erro: Property 'fullName' does not exist
user.fullName

// ✅ Solução: Usar nomes corretos do schema
user.full_name
```

### 2. Dados Não Carregam
```tsx
// ✅ Verificar se as variáveis de ambiente estão corretas
console.log(import.meta.env.VITE_SUPABASE_URL);
```

### 3. Erro de Autenticação
```tsx
// ✅ Verificar se o usuário está autenticado
const { user } = useAuth();
if (!user) return <Navigate to="/login" />;
```

### 4. Queries Lentas
```tsx
// ✅ Otimizar queries com select específico
const { data } = await supabase
  .from('users')
  .select('id, full_name, email, role')
  .eq('status', 'active');
```

## 🔍 Testes Durante a Migração

### 1. Teste de Conectividade
```tsx
// Adicione este teste temporário
useEffect(() => {
  const testConnection = async () => {
    const { data, error } = await supabase.from('profiles').select('count');
    console.log('Supabase connection:', { data, error });
  };
  testConnection();
}, []);
```

### 2. Teste de Autenticação
```tsx
// Teste login/logout
const { signIn, signOut } = useAuth();
```

### 3. Teste de CRUD
```tsx
// Teste criar/ler/atualizar/deletar
const { create, read, update, delete } = userService;
```

## 📈 Monitoramento

### 1. Logs de Desenvolvimento
```tsx
// Adicione logs para debug
console.log('Users data:', users);
console.log('Loading state:', isLoading);
console.log('Error state:', error);
```

### 2. Métricas do Supabase
- Acesse o dashboard do Supabase
- Monitore queries e performance
- Verifique logs de erro

## 🎯 Próximos Passos

1. **Migrar módulo por módulo** seguindo a ordem sugerida
2. **Testar cada módulo** antes de prosseguir
3. **Implementar autenticação** em todas as rotas
4. **Adicionar Row Level Security (RLS)** no Supabase
5. **Otimizar queries** para melhor performance
6. **Implementar cache** com React Query
7. **Adicionar testes** automatizados

## 📞 Suporte

Se encontrar problemas durante a migração:

1. Verifique os logs do console
2. Consulte a documentação do Supabase
3. Verifique se as variáveis de ambiente estão corretas
4. Teste a conectividade com o Supabase

---

**Lembre-se**: A migração é gradual. Você pode manter dados mock em alguns módulos enquanto migra outros. Isso permite desenvolvimento contínuo sem quebrar funcionalidades existentes. 
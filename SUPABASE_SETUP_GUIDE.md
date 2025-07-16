# 🚀 Guia de Configuração do Supabase - Sistema CBMEPI

## 📋 Passos para Configurar o Banco de Dados

### 1. Acessar o Dashboard do Supabase

1. Acesse: https://supabase.com/dashboard/project/gjzddakrdakqcxduddcw
2. Faça login com sua conta
3. Navegue até o projeto `gjzddakrdakqcxduddcw`

### 2. Executar o Schema SQL

1. No dashboard, vá para **SQL Editor** (menu lateral)
2. Clique em **New Query**
3. Copie e cole todo o conteúdo do arquivo `schema.sql` que foi criado
4. Clique em **Run** para executar

### 3. Verificar as Tabelas Criadas

Após executar o SQL, você deve ver as seguintes tabelas no **Table Editor**:

#### Tabelas Principais:
- ✅ `profiles` - Usuários do sistema
- ✅ `courses` - Cursos oferecidos
- ✅ `disciplines` - Disciplinas dos cursos
- ✅ `classes` - Turmas
- ✅ `students` - Alunos
- ✅ `class_students` - Relacionamento turma-aluno
- ✅ `class_instructors` - Relacionamento turma-instrutor
- ✅ `assessments` - Avaliações
- ✅ `pedagogical_observations` - Observações pedagógicas
- ✅ `communications` - Sistema de comunicação
- ✅ `guardians` - Responsáveis pelos alunos
- ✅ `student_documents` - Documentos dos alunos
- ✅ `lessons` - Aulas
- ✅ `calendar_events` - Eventos do calendário
- ✅ `assessment_results` - Resultados de avaliações

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=https://gjzddakrdakqcxduddcw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqemRkYWtyZGFrcWN4ZHVkZGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDI5MDEsImV4cCI6MjA2NzY3ODkwMX0.LCGWzW1JT07i05KlNX93IbuGTiCl0IGGhGjJ49tDCcs
```

### 5. Testar a Configuração

Execute o comando para testar a conexão:

```bash
node setup-database.js
```

### 6. Dados Iniciais Inseridos

O schema inclui dados iniciais para teste:

#### Usuários:
- **João Silva** (Admin) - joao.silva@cbmepi.gov.br
- **Maria Oliveira** (Instrutora) - maria.oliveira@cbmepi.gov.br
- **Pedro Santos** (Instrutor) - pedro.santos@cbmepi.gov.br
- **Ana Souza** (Aluna) - ana.souza@estudante.cbmepi.gov.br
- **Lucas Pereira** (Aluno) - lucas.pereira@estudante.cbmepi.gov.br

#### Cursos:
- Formação Básica de Bombeiro Mirim (120h)
- Prevenção e Combate a Incêndio Mirim (80h)

#### Turmas:
- Turma 1 - Formação Básica 2023

#### Alunos:
- Ana Souza (Matrícula: 2023001)
- Lucas Pereira (Matrícula: 2023002)

## 🔧 Configurações Adicionais

### Row Level Security (RLS)

O schema inclui políticas básicas de segurança. Para produção, você deve:

1. Revisar as políticas no **Authentication > Policies**
2. Configurar políticas específicas por papel de usuário
3. Testar as permissões

### Storage

Para upload de arquivos (documentos, imagens):

1. Vá para **Storage** no dashboard
2. Crie buckets para:
   - `student-documents` - Documentos dos alunos
   - `profile-images` - Fotos de perfil
   - `lesson-materials` - Materiais de aula

### Autenticação

Para configurar autenticação:

1. Vá para **Authentication > Settings**
2. Configure provedores de email
3. Defina URLs de redirecionamento
4. Configure templates de email

## 🚀 Próximos Passos

Após configurar o banco:

1. **Migrar componentes**: Atualizar componentes para usar dados reais
2. **Implementar autenticação**: Configurar login/logout
3. **Testar funcionalidades**: Verificar CRUD operations
4. **Otimizar performance**: Implementar cache e paginação
5. **Configurar backups**: Configurar backup automático

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no dashboard do Supabase
2. Teste a conexão com `node test-connection.js`
3. Verifique se todas as tabelas foram criadas
4. Confirme se as variáveis de ambiente estão corretas

## 🎯 Benefícios da Migração

- ✅ **Dados reais**: Sistema funcional com dados persistentes
- ✅ **Autenticação**: Login seguro com Supabase Auth
- ✅ **Performance**: Queries otimizadas e cache
- ✅ **Escalabilidade**: Infraestrutura robusta
- ✅ **Backup**: Dados seguros e recuperáveis
- ✅ **Tempo real**: Atualizações em tempo real
- ✅ **Storage**: Upload de arquivos integrado

---

**Status**: ✅ Conexão configurada | ⏳ Aguardando execução do schema SQL 
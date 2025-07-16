# Sistema de Gestão do Pelotão Mirim - CBMEPI

Sistema completo de gestão para o projeto Bombeiro Mirim do Corpo de Bombeiros Militar do Estado do Piauí.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Estado**: React Query (TanStack Query)
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form + Zod

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

## 🛠️ Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd mirim-fire-gestao-pi-main
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Supabase

#### 3.1 Projeto já configurado
O projeto Supabase já está configurado e pronto para uso:
- **URL**: https://gjzddakrdakqcxduddcw.supabase.co
- **Projeto ID**: gjzddakrdakqcxduddcw

#### 3.2 Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://gjzddakrdakqcxduddcw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqemRkYWtyZGFrcWN4ZHVkZGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDI5MDEsImV4cCI6MjA2NzY3ODkwMX0.LCGWzW1JT07i05KlNX93IbuGTiCl0IGGhGjJ49tDCcs
```

#### 3.3 Configure o banco de dados
1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard/project/gjzddakrdakqcxduddcw)
2. Vá para **SQL Editor**
3. Execute o arquivo `schema.sql` que está na raiz do projeto
4. Verifique se todas as tabelas foram criadas no **Table Editor**

**📋 Guia completo**: Veja o arquivo `SUPABASE_SETUP_GUIDE.md` para instruções detalhadas.

### 4. Execute o projeto
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── data/               # Tipos e dados mock (serão substituídos)
├── hooks/              # Hooks customizados
├── integrations/       # Integrações externas (Supabase)
├── lib/                # Utilitários e configurações
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
└── ui/                 # Componentes de UI base
```

## 🔐 Autenticação

O sistema usa Supabase Auth com:
- Login/Logout
- Registro de usuários
- Recuperação de senha
- Controle de permissões por role

## 📊 Funcionalidades

### 👥 Gestão de Usuários
- Listagem de usuários
- Criação e edição de perfis
- Controle de permissões
- Diferentes roles (admin, instructor, student)

### 🎓 Gestão de Alunos
- Cadastro completo de alunos
- Documentos e responsáveis
- Histórico acadêmico
- Observações pedagógicas

### 📚 Gestão Curricular
- Cursos e disciplinas
- Turmas e aulas
- Calendário de eventos
- Planejamento de aulas

### 📝 Gestão Pedagógica
- Avaliações e questionários
- Banco de questões
- Observações pedagógicas
- Dashboard do aluno

### 💬 Comunicação
- Sistema de mensagens
- Anúncios
- Notificações
- Comunicação em grupo

### 📈 Relatórios
- Boletim individual
- Relatório de frequência
- Estatísticas de aprovação
- Relatórios comparativos

## 🔧 Desenvolvimento

### Scripts disponíveis
```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Linting
```

### Padrões de código
- TypeScript strict mode
- ESLint + Prettier
- Componentes funcionais com hooks
- Separação de responsabilidades

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras opções
- Netlify
- GitHub Pages
- Qualquer servidor estático

## 📝 Licença

Este projeto é desenvolvido para o Corpo de Bombeiros Militar do Estado do Piauí.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento.

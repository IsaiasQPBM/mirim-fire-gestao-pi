# Migração do Módulo de Comunicação para Supabase

## Resumo da Migração

O módulo de Comunicação será migrado de dados mock para integração real com Supabase. Este módulo inclui mensagens, comunicados e notificações, todos utilizando a tabela `communications` do Supabase.

## Estrutura do Banco

### Tabela: `communications`
```sql
CREATE TABLE IF NOT EXISTS communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'message' CHECK (message_type IN ('message', 'announcement', 'notification')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL
);
```

### Tipos de Mensagem:
- `message` - Mensagem individual entre usuários
- `announcement` - Comunicado geral
- `notification` - Notificação do sistema

### Níveis de Prioridade:
- `low` - Baixa
- `normal` - Normal
- `high` - Alta
- `urgent` - Urgente

## Serviços de API

### Arquivo: `src/services/api.ts`
```typescript
export const communicationService = {
  // Buscar mensagens do usuário
  async getMessages(userId: string) {
    const { data, error } = await supabase
      .from('communications')
      .select(`
        *,
        profiles!communications_sender_id_fkey(*),
        profiles!communications_recipient_id_fkey(*)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('sent_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Enviar mensagem
  async sendMessage(message: TableInsert<'communications'>) {
    const { data, error } = await supabase
      .from('communications')
      .insert(message)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Marcar como lida
  async markAsRead(id: string) {
    const { data, error } = await supabase
      .from('communications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
```

## Componentes a Migrar

### 1. **MessagesInbox.tsx** (`src/pages/communication/MessagesInbox.tsx`)
**Status:** 🔄 Pendente
**Função:** Caixa de entrada de mensagens
**Principais mudanças:**
- Remover uso de `mockMessages`
- Integrar com `communicationService.getMessages()`
- Adicionar loading e tratamento de erro
- Implementar marcação como lida

### 2. **MessagesNew.tsx** (`src/pages/communication/MessagesNew.tsx`)
**Status:** 🔄 Pendente
**Função:** Criar nova mensagem
**Principais mudanças:**
- Remover dados mock
- Integrar com `communicationService.sendMessage()`
- Adicionar validação com Zod
- Implementar seleção de destinatários

### 3. **ComposeMessage.tsx** (`src/pages/communication/ComposeMessage.tsx`)
**Status:** 🔄 Pendente
**Função:** Compor mensagem avançada
**Principais mudanças:**
- Integrar com serviços de comunicação
- Adicionar anexos (futuro)
- Implementar rascunhos

### 4. **AnnouncementsList.tsx** (`src/pages/communication/AnnouncementsList.tsx`)
**Status:** 🔄 Pendente
**Função:** Listar comunicados
**Principais mudanças:**
- Remover uso de `mockAnnouncements`
- Filtrar por `message_type = 'announcement'`
- Implementar busca e filtros

### 5. **AnnouncementCreate.tsx** (`src/pages/communication/AnnouncementCreate.tsx`)
**Status:** 🔄 Pendente
**Função:** Criar comunicado
**Principais mudanças:**
- Integrar com `communicationService.sendMessage()`
- Definir `message_type = 'announcement'`
- Implementar seleção de público-alvo

### 6. **NotificationsList.tsx** (`src/pages/communication/NotificationsList.tsx`)
**Status:** 🔄 Pendente
**Função:** Listar notificações
**Principais mudanças:**
- Filtrar por `message_type = 'notification'`
- Implementar marcação como lida
- Adicionar filtros por tipo

## Tipos TypeScript

### Arquivo: `src/integrations/supabase/types.ts`
```typescript
export interface Database {
  public: {
    Tables: {
      communications: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          title: string
          content: string
          message_type: 'message' | 'announcement' | 'notification'
          priority: 'low' | 'normal' | 'high' | 'urgent'
          is_read: boolean
          read_at: string | null
          sent_at: string
          class_id: string | null
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          title: string
          content: string
          message_type?: 'message' | 'announcement' | 'notification'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          is_read?: boolean
          read_at?: string | null
          sent_at?: string
          class_id?: string | null
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          title?: string
          content?: string
          message_type?: 'message' | 'announcement' | 'notification'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          is_read?: boolean
          read_at?: string | null
          sent_at?: string
          class_id?: string | null
        }
      }
    }
  }
}
```

## Funcionalidades a Implementar

### 1. **Sistema de Mensagens**
- ✅ Envio de mensagens individuais
- ✅ Caixa de entrada
- ✅ Marcação como lida
- 🔄 Anexos (futuro)
- 🔄 Rascunhos (futuro)

### 2. **Sistema de Comunicados**
- ✅ Criação de comunicados
- ✅ Listagem de comunicados
- ✅ Filtros por prioridade
- 🔄 Agendamento (futuro)
- 🔄 Confirmação de leitura (futuro)

### 3. **Sistema de Notificações**
- ✅ Notificações do sistema
- ✅ Marcação como lida
- 🔄 Notificações push (futuro)
- 🔄 Configurações de notificação (futuro)

## Fluxo de Dados

### Mensagens Individuais:
1. Usuário acessa `/communication/messages`
2. Sistema carrega mensagens via `communicationService.getMessages()`
3. Usuário pode enviar nova mensagem via `communicationService.sendMessage()`
4. Mensagens são filtradas por `message_type = 'message'`

### Comunicados:
1. Admin/Instrutor acessa `/communication/announcements`
2. Sistema carrega comunicados via `communicationService.getMessages()`
3. Filtra por `message_type = 'announcement'`
4. Criação via `communicationService.sendMessage()` com `message_type = 'announcement'`

### Notificações:
1. Sistema gera notificações automaticamente
2. Usuário acessa `/communication/notifications`
3. Filtra por `message_type = 'notification'`
4. Marcação como lida via `communicationService.markAsRead()`

## Próximos Passos

1. **Migrar MessagesInbox.tsx** - Caixa de entrada
2. **Migrar MessagesNew.tsx** - Nova mensagem
3. **Migrar AnnouncementsList.tsx** - Lista de comunicados
4. **Migrar AnnouncementCreate.tsx** - Criar comunicado
5. **Migrar NotificationsList.tsx** - Lista de notificações
6. **Testar funcionalidades** - Verificar integração
7. **Documentar** - Criar guia de uso

## Status da Migração

- 🔄 **Planejamento:** Concluído
- ⏳ **Implementação:** Pendente
- ⏳ **Testes:** Pendente
- ⏳ **Documentação:** Pendente

## Dependências

- ✅ Supabase configurado
- ✅ Tabela `communications` criada
- ✅ Serviços de API implementados
- ✅ Tipos TypeScript definidos
- 🔄 Componentes migrados 
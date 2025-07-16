# 🚀 Guia de Configuração das Tabelas CMS - Sistema CBMEPI

## 📋 Passos para Configurar as Tabelas CMS

### 1. Acessar o Dashboard do Supabase

1. Acesse: https://supabase.com/dashboard/project/gjzddakrdakqcxduddcw
2. Faça login com sua conta
3. Navegue até o projeto `gjzddakrdakqcxduddcw`

### 2. Executar o Schema CMS

1. No dashboard, vá para **SQL Editor** (menu lateral)
2. Clique em **New Query**
3. Copie e cole todo o conteúdo do arquivo `cms-tables.sql` que foi criado
4. Clique em **Run** para executar

### 3. Verificar as Tabelas CMS Criadas

Após executar o SQL, você deve ver as seguintes tabelas no **Table Editor**:

#### Tabelas CMS:
- ✅ `cms_content` - Conteúdo editável do sistema
- ✅ `system_settings` - Configurações gerais do sistema
- ✅ `appearance_settings` - Configurações de aparência
- ✅ `user_settings` - Configurações de usuário
- ✅ `cms_menus` - Menus do sistema
- ✅ `cms_menu_items` - Itens de menu
- ✅ `cms_contacts` - Contatos do sistema

### 4. Verificar os Dados Iniciais

Após a execução, você deve ter:

#### Conteúdo CMS:
- Títulos e descrições de boas-vindas
- Nome do site e projeto
- Contatos principais
- Logos do sistema

#### Configurações do Sistema:
- Nome e descrição do sistema
- Contatos principais
- Configurações de manutenção
- Configurações de segurança

#### Configurações de Aparência:
- Paleta de cores CBMEPI
- Logos padrão
- Fontes do sistema
- Configurações de layout

#### Contatos:
- Email principal: contato@cbmepi.gov.br
- Telefone principal: (86) 3216-8100
- Endereço principal: Av. Dom Severino, 2551 - Fátima, Teresina - PI

#### Menus:
- Menu Principal com itens de navegação
- Menu Lateral
- Menu Rodapé

### 5. Testar a Configuração

1. Acesse o sistema em desenvolvimento
2. Navegue até **Administração > Gestão de Conteúdo**
3. Verifique se o conteúdo CMS está carregando
4. Teste a edição de conteúdo
5. Navegue até **Administração > Configurações**
6. Teste as configurações de usuário

### 6. Verificar Índices e Performance

No **Table Editor**, verifique se os índices foram criados:

#### Índices Criados:
- `idx_cms_content_key` - Para busca rápida por chave
- `idx_cms_content_type` - Para busca por tipo
- `idx_system_settings_key` - Para configurações do sistema
- `idx_system_settings_category` - Para busca por categoria
- `idx_appearance_settings_key` - Para configurações de aparência
- `idx_appearance_settings_category` - Para busca por categoria
- `idx_user_settings_user_id` - Para configurações de usuário
- `idx_user_settings_key` - Para busca por chave
- `idx_cms_menus_location` - Para menus por localização
- `idx_cms_menu_items_menu_id` - Para itens de menu
- `idx_cms_menu_items_parent_id` - Para hierarquia de itens
- `idx_cms_contacts_type` - Para contatos por tipo

### 7. Configurar Permissões (Opcional)

Se necessário, configure as políticas de segurança:

```sql
-- Permitir leitura para todos os usuários autenticados
CREATE POLICY "Allow authenticated read access" ON cms_content
FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir escrita apenas para administradores
CREATE POLICY "Allow admin write access" ON cms_content
FOR ALL USING (auth.role() = 'admin');
```

### 8. Verificar Relacionamentos

Confirme que os relacionamentos estão corretos:

- `cms_content.updated_by` → `profiles.id`
- `system_settings.updated_by` → `profiles.id`
- `appearance_settings.updated_by` → `profiles.id`
- `user_settings.user_id` → `profiles.id`
- `cms_menu_items.menu_id` → `cms_menus.id`
- `cms_menu_items.parent_id` → `cms_menu_items.id`

## 🎯 Funcionalidades Disponíveis

Após a configuração, você terá acesso a:

### **Gestão de Conteúdo CMS**
- Edição de textos do sistema
- Gerenciamento de imagens e logos
- Configuração de contatos
- Personalização de menus

### **Configurações do Sistema**
- Configurações gerais
- Configurações de aparência
- Configurações de usuário
- Configurações de segurança

### **Gerenciamento de Menus**
- Criação de menus
- Adição de itens de menu
- Configuração de hierarquia
- Definição de localização

### **Gestão de Contatos**
- Adição de emails
- Configuração de telefones
- Definição de endereços
- Contatos de redes sociais

## 🔧 Troubleshooting

### Problema: Tabelas não aparecem
**Solução:** Verifique se o SQL foi executado completamente e sem erros.

### Problema: Dados não carregam
**Solução:** Verifique se as variáveis de ambiente estão configuradas corretamente.

### Problema: Erro de permissão
**Solução:** Configure as políticas de segurança adequadas.

### Problema: Relacionamentos quebrados
**Solução:** Verifique se as tabelas principais (profiles) existem.

## 📞 Suporte

Se encontrar problemas durante a configuração:

1. Verifique os logs do Supabase
2. Confirme se todas as tabelas foram criadas
3. Teste as consultas diretamente no SQL Editor
4. Verifique a documentação do módulo de administração

## 🎉 Conclusão

Após seguir este guia, o módulo de administração estará completamente funcional com:

- ✅ Todas as tabelas CMS criadas
- ✅ Dados iniciais inseridos
- ✅ Índices de performance configurados
- ✅ Relacionamentos estabelecidos
- ✅ Funcionalidades CMS operacionais

O sistema estará pronto para uso em produção com todas as funcionalidades de gestão de conteúdo e configurações disponíveis. 
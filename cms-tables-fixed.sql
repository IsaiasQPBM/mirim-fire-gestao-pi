-- ===== TABELAS CMS PARA O MÓDULO DE ADMINISTRAÇÃO =====

-- Tabela de conteúdo CMS
CREATE TABLE IF NOT EXISTS cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key TEXT UNIQUE NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'document', 'menu', 'contact', 'logo')),
  content_value TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT NOT NULL DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Tabela de configurações de aparência
CREATE TABLE IF NOT EXISTS appearance_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('colors', 'logos', 'fonts', 'layout')),
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Tabela de configurações de usuário
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT NOT NULL DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  category TEXT NOT NULL DEFAULT 'general',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, setting_key)
);

-- Tabela de menus do sistema
CREATE TABLE IF NOT EXISTS cms_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL CHECK (location IN ('header', 'sidebar', 'footer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens de menu
CREATE TABLE IF NOT EXISTS cms_menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID NOT NULL REFERENCES cms_menus(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES cms_menu_items(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT,
  icon TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  target TEXT DEFAULT '_self' CHECK (target IN ('_self', '_blank')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contatos
CREATE TABLE IF NOT EXISTS cms_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_type TEXT NOT NULL CHECK (contact_type IN ('email', 'phone', 'address', 'social')),
  contact_value TEXT NOT NULL,
  label TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_cms_content_key ON cms_content(content_key);
CREATE INDEX IF NOT EXISTS idx_cms_content_type ON cms_content(content_type);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
CREATE INDEX IF NOT EXISTS idx_appearance_settings_key ON appearance_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_appearance_settings_category ON appearance_settings(category);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_key ON user_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_cms_menus_location ON cms_menus(location);
CREATE INDEX IF NOT EXISTS idx_cms_menu_items_menu_id ON cms_menu_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_cms_menu_items_parent_id ON cms_menu_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_cms_contacts_type ON cms_contacts(contact_type);

-- Inserir dados iniciais de conteúdo CMS
INSERT INTO cms_content (content_key, content_type, content_value, label, description) VALUES
('dashboard.welcome.title', 'text', 'Bom dia, {userName}!', 'Título de Boas-vindas', 'Título exibido no dashboard principal'),
('dashboard.welcome.description', 'text', 'Aqui está o resumo do sistema do Pelotão Mirim.', 'Descrição de Boas-vindas', 'Descrição exibida no dashboard principal'),
('site.name', 'text', 'CORPO DE BOMBEIROS MILITAR DO ESTADO DO PIAUÍ', 'Nome do Site', 'Nome principal do sistema'),
('site.project', 'text', 'Projeto Bombeiro Mirim', 'Nome do Projeto', 'Nome do projeto específico'),
('contact.email', 'contact', 'contato@cbmepi.gov.br', 'Email de Contato', 'Email principal para contato'),
('contact.phone', 'contact', '(86) 3216-8100', 'Telefone de Contato', 'Telefone principal para contato'),
('site.logo', 'logo', '/lovable-uploads/ea2da570-3d73-4c06-9dd2-2251355190c7.png', 'Logo do Site', 'Logo principal do sistema'),
('site.favicon', 'logo', '/favicon.ico', 'Favicon', 'Ícone do site');

-- Inserir configurações iniciais do sistema
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description) VALUES
('site.name', 'Sistema Pelotão Mirim', 'string', 'general', 'Nome do sistema'),
('site.description', 'Sistema de gestão do projeto Bombeiro Mirim do CBMEPI', 'string', 'general', 'Descrição do sistema'),
('contact.email', 'contato@cbmepi.gov.br', 'string', 'contact', 'Email de contato principal'),
('contact.phone', '(86) 3216-8100', 'string', 'contact', 'Telefone de contato principal'),
('contact.address', 'Av. Dom Severino, 2551 - Fátima, Teresina - PI', 'string', 'contact', 'Endereço principal'),
('maintenance.mode', 'false', 'boolean', 'system', 'Modo de manutenção'),
('backup.frequency', 'daily', 'string', 'system', 'Frequência de backup'),
('session.timeout', '30', 'number', 'security', 'Tempo de sessão em minutos');

-- Inserir configurações iniciais de aparência
INSERT INTO appearance_settings (setting_key, setting_value, category, description) VALUES
('colors.primary', '#F5A623', 'colors', 'Cor primária do sistema'),
('colors.secondary', '#B71C1C', 'colors', 'Cor secundária do sistema'),
('colors.accent', '#2563EB', 'colors', 'Cor de destaque'),
('colors.background', '#FFFFFF', 'colors', 'Cor de fundo'),
('colors.text', '#1F2937', 'colors', 'Cor do texto'),
('logos.main', '/lovable-uploads/ea2da570-3d73-4c06-9dd2-2251355190c7.png', 'logos', 'Logo principal'),
('logos.favicon', '/favicon.ico', 'logos', 'Favicon'),
('fonts.heading', 'Inter', 'fonts', 'Fonte dos títulos'),
('fonts.body', 'Inter', 'fonts', 'Fonte do corpo do texto'),
('layout.headerHeight', '64px', 'layout', 'Altura do cabeçalho'),
('layout.sidebarWidth', '256px', 'layout', 'Largura da barra lateral'),
('layout.borderRadius', '8px', 'layout', 'Raio da borda');

-- Inserir contatos iniciais
INSERT INTO cms_contacts (contact_type, contact_value, label, is_primary) VALUES
('email', 'contato@cbmepi.gov.br', 'Email Principal', true),
('phone', '(86) 3216-8100', 'Telefone Principal', true),
('address', 'Av. Dom Severino, 2551 - Fátima, Teresina - PI', 'Endereço Principal', true);

-- Inserir menus iniciais
INSERT INTO cms_menus (name, location) VALUES
('Menu Principal', 'header'),
('Menu Lateral', 'sidebar'),
('Menu Rodapé', 'footer');

-- Inserir itens de menu iniciais (usando UUIDs dos menus criados acima)
INSERT INTO cms_menu_items (menu_id, title, url, icon, order_index) VALUES
((SELECT id FROM cms_menus WHERE name = 'Menu Principal' LIMIT 1), 'Dashboard', '/dashboard', 'home', 1),
((SELECT id FROM cms_menus WHERE name = 'Menu Principal' LIMIT 1), 'Usuários', '/users', 'users', 2),
((SELECT id FROM cms_menus WHERE name = 'Menu Principal' LIMIT 1), 'Alunos', '/students', 'graduation-cap', 3),
((SELECT id FROM cms_menus WHERE name = 'Menu Principal' LIMIT 1), 'Cursos', '/courses', 'book-open', 4),
((SELECT id FROM cms_menus WHERE name = 'Menu Principal' LIMIT 1), 'Turmas', '/classes', 'users', 5),
((SELECT id FROM cms_menus WHERE name = 'Menu Principal' LIMIT 1), 'Avaliações', '/assessments', 'clipboard-list', 6),
((SELECT id FROM cms_menus WHERE name = 'Menu Principal' LIMIT 1), 'Observações', '/observations', 'eye', 7),
((SELECT id FROM cms_menus WHERE name = 'Menu Principal' LIMIT 1), 'Comunicação', '/communication', 'message-circle', 8),
((SELECT id FROM cms_menus WHERE name = 'Menu Principal' LIMIT 1), 'Relatórios', '/reports', 'bar-chart-2', 9),
((SELECT id FROM cms_menus WHERE name = 'Menu Principal' LIMIT 1), 'Administração', '/admin', 'settings', 10);

-- Configurações padrão de usuário (serão criadas quando o usuário acessar as configurações)
-- Estas serão inseridas dinamicamente quando necessário 
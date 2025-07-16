const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  console.error('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupCMSTables() {
  console.log('🚀 Configurando tabelas CMS no Supabase...\n');

  try {
    // SQL corrigido para as tabelas CMS
    const cmsTablesSQL = `
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
    `;

    console.log('📋 Criando tabelas CMS...');
    const { error: tablesError } = await supabase.rpc('exec_sql', { sql: cmsTablesSQL });
    
    if (tablesError) {
      console.error('❌ Erro ao criar tabelas:', tablesError.message);
      return;
    }
    
    console.log('✅ Tabelas CMS criadas com sucesso!\n');

    // Inserir dados iniciais
    console.log('📝 Inserindo dados iniciais...');

    // Inserir conteúdo CMS
    const { error: contentError } = await supabase
      .from('cms_content')
      .upsert([
        {
          content_key: 'dashboard.welcome.title',
          content_type: 'text',
          content_value: 'Bom dia, {userName}!',
          label: 'Título de Boas-vindas',
          description: 'Título exibido no dashboard principal'
        },
        {
          content_key: 'dashboard.welcome.description',
          content_type: 'text',
          content_value: 'Aqui está o resumo do sistema do Pelotão Mirim.',
          label: 'Descrição de Boas-vindas',
          description: 'Descrição exibida no dashboard principal'
        },
        {
          content_key: 'site.name',
          content_type: 'text',
          content_value: 'CORPO DE BOMBEIROS MILITAR DO ESTADO DO PIAUÍ',
          label: 'Nome do Site',
          description: 'Nome principal do sistema'
        },
        {
          content_key: 'site.project',
          content_type: 'text',
          content_value: 'Projeto Bombeiro Mirim',
          label: 'Nome do Projeto',
          description: 'Nome do projeto específico'
        },
        {
          content_key: 'contact.email',
          content_type: 'contact',
          content_value: 'contato@cbmepi.gov.br',
          label: 'Email de Contato',
          description: 'Email principal para contato'
        },
        {
          content_key: 'contact.phone',
          content_type: 'contact',
          content_value: '(86) 3216-8100',
          label: 'Telefone de Contato',
          description: 'Telefone principal para contato'
        },
        {
          content_key: 'site.logo',
          content_type: 'logo',
          content_value: '/lovable-uploads/ea2da570-3d73-4c06-9dd2-2251355190c7.png',
          label: 'Logo do Site',
          description: 'Logo principal do sistema'
        },
        {
          content_key: 'site.favicon',
          content_type: 'logo',
          content_value: '/favicon.ico',
          label: 'Favicon',
          description: 'Ícone do site'
        }
      ]);

    if (contentError) {
      console.error('❌ Erro ao inserir conteúdo CMS:', contentError.message);
    } else {
      console.log('✅ Conteúdo CMS inserido com sucesso!');
    }

    // Inserir configurações do sistema
    const { error: settingsError } = await supabase
      .from('system_settings')
      .upsert([
        {
          setting_key: 'site.name',
          setting_value: 'Sistema Pelotão Mirim',
          setting_type: 'string',
          category: 'general',
          description: 'Nome do sistema'
        },
        {
          setting_key: 'site.description',
          setting_value: 'Sistema de gestão do projeto Bombeiro Mirim do CBMEPI',
          setting_type: 'string',
          category: 'general',
          description: 'Descrição do sistema'
        },
        {
          setting_key: 'contact.email',
          setting_value: 'contato@cbmepi.gov.br',
          setting_type: 'string',
          category: 'contact',
          description: 'Email de contato principal'
        },
        {
          setting_key: 'contact.phone',
          setting_value: '(86) 3216-8100',
          setting_type: 'string',
          category: 'contact',
          description: 'Telefone de contato principal'
        },
        {
          setting_key: 'contact.address',
          setting_value: 'Av. Dom Severino, 2551 - Fátima, Teresina - PI',
          setting_type: 'string',
          category: 'contact',
          description: 'Endereço principal'
        },
        {
          setting_key: 'maintenance.mode',
          setting_value: 'false',
          setting_type: 'boolean',
          category: 'system',
          description: 'Modo de manutenção'
        },
        {
          setting_key: 'backup.frequency',
          setting_value: 'daily',
          setting_type: 'string',
          category: 'system',
          description: 'Frequência de backup'
        },
        {
          setting_key: 'session.timeout',
          setting_value: '30',
          setting_type: 'number',
          category: 'security',
          description: 'Tempo de sessão em minutos'
        }
      ]);

    if (settingsError) {
      console.error('❌ Erro ao inserir configurações do sistema:', settingsError.message);
    } else {
      console.log('✅ Configurações do sistema inseridas com sucesso!');
    }

    // Inserir configurações de aparência
    const { error: appearanceError } = await supabase
      .from('appearance_settings')
      .upsert([
        {
          setting_key: 'colors.primary',
          setting_value: '#F5A623',
          category: 'colors',
          description: 'Cor primária do sistema'
        },
        {
          setting_key: 'colors.secondary',
          setting_value: '#B71C1C',
          category: 'colors',
          description: 'Cor secundária do sistema'
        },
        {
          setting_key: 'colors.accent',
          setting_value: '#2563EB',
          category: 'colors',
          description: 'Cor de destaque'
        },
        {
          setting_key: 'colors.background',
          setting_value: '#FFFFFF',
          category: 'colors',
          description: 'Cor de fundo'
        },
        {
          setting_key: 'colors.text',
          setting_value: '#1F2937',
          category: 'colors',
          description: 'Cor do texto'
        },
        {
          setting_key: 'logos.main',
          setting_value: '/lovable-uploads/ea2da570-3d73-4c06-9dd2-2251355190c7.png',
          category: 'logos',
          description: 'Logo principal'
        },
        {
          setting_key: 'logos.favicon',
          setting_value: '/favicon.ico',
          category: 'logos',
          description: 'Favicon'
        },
        {
          setting_key: 'fonts.heading',
          setting_value: 'Inter',
          category: 'fonts',
          description: 'Fonte dos títulos'
        },
        {
          setting_key: 'fonts.body',
          setting_value: 'Inter',
          category: 'fonts',
          description: 'Fonte do corpo do texto'
        },
        {
          setting_key: 'layout.headerHeight',
          setting_value: '64px',
          category: 'layout',
          description: 'Altura do cabeçalho'
        },
        {
          setting_key: 'layout.sidebarWidth',
          setting_value: '256px',
          category: 'layout',
          description: 'Largura da barra lateral'
        },
        {
          setting_key: 'layout.borderRadius',
          setting_value: '8px',
          category: 'layout',
          description: 'Raio da borda'
        }
      ]);

    if (appearanceError) {
      console.error('❌ Erro ao inserir configurações de aparência:', appearanceError.message);
    } else {
      console.log('✅ Configurações de aparência inseridas com sucesso!');
    }

    // Inserir contatos
    const { error: contactsError } = await supabase
      .from('cms_contacts')
      .upsert([
        {
          contact_type: 'email',
          contact_value: 'contato@cbmepi.gov.br',
          label: 'Email Principal',
          is_primary: true
        },
        {
          contact_type: 'phone',
          contact_value: '(86) 3216-8100',
          label: 'Telefone Principal',
          is_primary: true
        },
        {
          contact_type: 'address',
          contact_value: 'Av. Dom Severino, 2551 - Fátima, Teresina - PI',
          label: 'Endereço Principal',
          is_primary: true
        }
      ]);

    if (contactsError) {
      console.error('❌ Erro ao inserir contatos:', contactsError.message);
    } else {
      console.log('✅ Contatos inseridos com sucesso!');
    }

    // Inserir menus
    const { data: menus, error: menusError } = await supabase
      .from('cms_menus')
      .upsert([
        { name: 'Menu Principal', location: 'header' },
        { name: 'Menu Lateral', location: 'sidebar' },
        { name: 'Menu Rodapé', location: 'footer' }
      ])
      .select();

    if (menusError) {
      console.error('❌ Erro ao inserir menus:', menusError.message);
      return;
    }

    console.log('✅ Menus inseridos com sucesso!');

    // Encontrar o menu principal
    const mainMenu = menus.find(menu => menu.name === 'Menu Principal');
    
    if (!mainMenu) {
      console.error('❌ Menu principal não encontrado!');
      return;
    }

    // Inserir itens de menu
    const { error: menuItemsError } = await supabase
      .from('cms_menu_items')
      .upsert([
        {
          menu_id: mainMenu.id,
          title: 'Dashboard',
          url: '/dashboard',
          icon: 'home',
          order_index: 1
        },
        {
          menu_id: mainMenu.id,
          title: 'Usuários',
          url: '/users',
          icon: 'users',
          order_index: 2
        },
        {
          menu_id: mainMenu.id,
          title: 'Alunos',
          url: '/students',
          icon: 'graduation-cap',
          order_index: 3
        },
        {
          menu_id: mainMenu.id,
          title: 'Cursos',
          url: '/courses',
          icon: 'book-open',
          order_index: 4
        },
        {
          menu_id: mainMenu.id,
          title: 'Turmas',
          url: '/classes',
          icon: 'users',
          order_index: 5
        },
        {
          menu_id: mainMenu.id,
          title: 'Avaliações',
          url: '/assessments',
          icon: 'clipboard-list',
          order_index: 6
        },
        {
          menu_id: mainMenu.id,
          title: 'Observações',
          url: '/observations',
          icon: 'eye',
          order_index: 7
        },
        {
          menu_id: mainMenu.id,
          title: 'Comunicação',
          url: '/communication',
          icon: 'message-circle',
          order_index: 8
        },
        {
          menu_id: mainMenu.id,
          title: 'Relatórios',
          url: '/reports',
          icon: 'bar-chart-2',
          order_index: 9
        },
        {
          menu_id: mainMenu.id,
          title: 'Administração',
          url: '/admin',
          icon: 'settings',
          order_index: 10
        }
      ]);

    if (menuItemsError) {
      console.error('❌ Erro ao inserir itens de menu:', menuItemsError.message);
    } else {
      console.log('✅ Itens de menu inseridos com sucesso!');
    }

    console.log('\n🎉 Configuração das tabelas CMS concluída com sucesso!');
    console.log('📊 Tabelas criadas:');
    console.log('   - cms_content');
    console.log('   - system_settings');
    console.log('   - appearance_settings');
    console.log('   - user_settings');
    console.log('   - cms_menus');
    console.log('   - cms_menu_items');
    console.log('   - cms_contacts');
    console.log('\n✅ Dados iniciais inseridos em todas as tabelas!');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error.message);
  }
}

setupCMSTables(); 
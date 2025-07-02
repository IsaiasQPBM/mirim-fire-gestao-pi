
import { SQLiteService } from './sqlite-service';
import { v4 as uuidv4 } from 'uuid';

// Seed initial data for the system
export const seedDatabase = () => {
  console.log('Seeding database with initial data...');

  // Seed CMS Content
  const cmsContent = [
    {
      key: 'dashboard.welcome.title',
      type: 'text',
      value: 'Bom dia, {userName}!',
      label: 'Título de Boas-vindas',
      description: 'Título exibido no dashboard principal',
      updated_by: 'admin'
    },
    {
      key: 'dashboard.welcome.description',
      type: 'text',
      value: 'Aqui está o resumo do sistema do Pelotão Mirim.',
      label: 'Descrição de Boas-vindas',
      description: 'Descrição exibida no dashboard principal',
      updated_by: 'admin'
    },
    {
      key: 'site.name',
      type: 'text',
      value: 'CORPO DE BOMBEIROS MILITAR DO ESTADO DO PIAUÍ',
      label: 'Nome do Site',
      description: 'Nome principal do sistema',
      updated_by: 'admin'
    },
    {
      key: 'site.project',
      type: 'text',
      value: 'Projeto Bombeiro Mirim',
      label: 'Nome do Projeto',
      description: 'Nome do projeto específico',
      updated_by: 'admin'
    }
  ];

  cmsContent.forEach(content => {
    const existing = SQLiteService.queryOne('SELECT id FROM cms_content WHERE key = ?', [content.key]);
    if (!existing) {
      SQLiteService.insert('cms_content', content);
    }
  });

  // Seed Menu Items
  const menuItems = [
    {
      label: 'Início',
      url: '/dashboard',
      icon: 'layout-dashboard',
      order_index: 1,
      is_active: 1,
      roles: JSON.stringify(['admin', 'instructor', 'student'])
    },
    {
      label: 'Gerenciar Usuários',
      url: '/users',
      icon: 'users',
      order_index: 2,
      is_active: 1,
      roles: JSON.stringify(['admin'])
    },
    {
      label: 'Alunos',
      url: '/students',
      icon: 'graduation-cap',
      order_index: 3,
      is_active: 1,
      roles: JSON.stringify(['admin', 'instructor'])
    },
    {
      label: 'Turmas',
      url: '/classes',
      icon: 'users',
      order_index: 4,
      is_active: 1,
      roles: JSON.stringify(['admin', 'instructor'])
    }
  ];

  menuItems.forEach(item => {
    const existing = SQLiteService.queryOne('SELECT id FROM cms_menu_items WHERE url = ?', [item.url]);
    if (!existing) {
      SQLiteService.insert('cms_menu_items', item);
    }
  });

  // Seed sample course
  const courseExists = SQLiteService.queryOne('SELECT id FROM courses LIMIT 1');
  if (!courseExists) {
    const courseId = SQLiteService.insert('courses', {
      name: 'Formação Básica de Bombeiro Mirim',
      description: 'Curso introdutório aos princípios e práticas do Corpo de Bombeiros para crianças e adolescentes.',
      objectives: 'Formar jovens com princípios de cidadania, noções básicas de prevenção e combate a incêndio, primeiros socorros e educação física.',
      total_hours: 120,
      prerequisites: JSON.stringify([]),
      is_active: 1
    });

    // Seed sample disciplines
    const disciplines = [
      {
        course_id: courseId,
        name: 'Introdução ao CBMEPI',
        description: 'História, valores e estrutura do Corpo de Bombeiros Militar do Piauí.',
        theory_hours: 20,
        practice_hours: 0,
        workload: 20,
        status: 'active',
        is_active: 1
      },
      {
        course_id: courseId,
        name: 'Noções de Primeiros Socorros',
        description: 'Conceitos básicos e práticas iniciais de primeiros socorros.',
        theory_hours: 15,
        practice_hours: 25,
        workload: 40,
        status: 'active',
        is_active: 1
      }
    ];

    disciplines.forEach(discipline => {
      SQLiteService.insert('disciplines', discipline);
    });
  }

  console.log('Database seeded successfully!');
};

// Run seeding
seedDatabase();

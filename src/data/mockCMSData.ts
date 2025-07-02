
import { CMSContent, CMSMenuItem, CMSSettings } from './cmsTypes';

export const mockCMSContent: CMSContent[] = [
  {
    id: 'welcome-title',
    key: 'dashboard.welcome.title',
    type: 'text',
    value: 'Bom dia, {userName}!',
    label: 'Título de Boas-vindas',
    description: 'Título exibido no dashboard principal',
    updatedAt: '2025-01-01T10:00:00Z',
    updatedBy: 'admin'
  },
  {
    id: 'welcome-description',
    key: 'dashboard.welcome.description',
    type: 'text',
    value: 'Aqui está o resumo do sistema do Pelotão Mirim.',
    label: 'Descrição de Boas-vindas',
    description: 'Descrição exibida no dashboard principal',
    updatedAt: '2025-01-01T10:00:00Z',
    updatedBy: 'admin'
  },
  {
    id: 'site-name',
    key: 'site.name',
    type: 'text',
    value: 'CORPO DE BOMBEIROS MILITAR DO ESTADO DO PIAUÍ',
    label: 'Nome do Site',
    description: 'Nome principal do sistema',
    updatedAt: '2025-01-01T10:00:00Z',
    updatedBy: 'admin'
  },
  {
    id: 'project-name',
    key: 'site.project',
    type: 'text',
    value: 'Projeto Bombeiro Mirim',
    label: 'Nome do Projeto',
    description: 'Nome do projeto específico',
    updatedAt: '2025-01-01T10:00:00Z',
    updatedBy: 'admin'
  },
  {
    id: 'contact-email',
    key: 'contact.email',
    type: 'contact',
    value: 'contato@cbmepi.gov.br',
    label: 'Email de Contato',
    description: 'Email principal para contato',
    updatedAt: '2025-01-01T10:00:00Z',
    updatedBy: 'admin'
  },
  {
    id: 'contact-phone',
    key: 'contact.phone',
    type: 'contact',
    value: '(86) 3216-8100',
    label: 'Telefone de Contato',
    description: 'Telefone principal para contato',
    updatedAt: '2025-01-01T10:00:00Z',
    updatedBy: 'admin'
  }
];

export const mockCMSMenuItems: CMSMenuItem[] = [
  {
    id: 'dashboard',
    label: 'Início',
    url: '/dashboard',
    icon: 'layout-dashboard',
    order: 1,
    isActive: true,
    roles: ['admin', 'instructor', 'student']
  },
  {
    id: 'users',
    label: 'Gerenciar Usuários',
    url: '/users',
    icon: 'users',
    order: 2,
    isActive: true,
    roles: ['admin']
  },
  {
    id: 'students',
    label: 'Alunos',
    url: '/students',
    icon: 'graduation-cap',
    order: 3,
    isActive: true,
    roles: ['admin', 'instructor']
  },
  {
    id: 'classes',
    label: 'Turmas',
    url: '/classes',
    icon: 'users',
    order: 4,
    isActive: true,
    roles: ['admin', 'instructor']
  }
];

export const mockCMSSettings: CMSSettings = {
  siteName: 'Sistema Pelotão Mirim',
  siteDescription: 'Sistema de gestão do projeto Bombeiro Mirim do CBMEPI',
  contactEmail: 'contato@cbmepi.gov.br',
  contactPhone: '(86) 3216-8100',
  address: 'Av. Dom Severino, 2551 - Fátima, Teresina - PI',
  logoUrl: '/lovable-uploads/ea2da570-3d73-4c06-9dd2-2251355190c7.png',
  faviconUrl: '/favicon.ico',
  primaryColor: '#F5A623',
  secondaryColor: '#B71C1C'
};

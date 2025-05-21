
export type UserRole = 'admin' | 'instructor' | 'student';

export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  fullName: string;
  birthDate: string;
  role: UserRole;
  email: string;
  phone: string;
  status: UserStatus;
  profileImage?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface UserPermission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

// Mock data for users
export const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'João Silva',
    birthDate: '1980-05-15',
    role: 'admin',
    email: 'joao.silva@cbmepi.gov.br',
    phone: '(86) 98765-4321',
    status: 'active',
    profileImage: '',
    createdAt: '2023-01-01',
    lastLogin: '2023-06-15T10:30:00'
  },
  {
    id: '2',
    fullName: 'Maria Oliveira',
    birthDate: '1985-10-20',
    role: 'instructor',
    email: 'maria.oliveira@cbmepi.gov.br',
    phone: '(86) 98765-1234',
    status: 'active',
    profileImage: '',
    createdAt: '2023-01-15',
    lastLogin: '2023-06-14T14:45:00'
  },
  {
    id: '3',
    fullName: 'Pedro Santos',
    birthDate: '1990-03-25',
    role: 'instructor',
    email: 'pedro.santos@cbmepi.gov.br',
    phone: '(86) 99876-5432',
    status: 'active',
    profileImage: '',
    createdAt: '2023-02-01',
    lastLogin: '2023-06-15T09:15:00'
  },
  {
    id: '4',
    fullName: 'Ana Souza',
    birthDate: '2005-07-12',
    role: 'student',
    email: 'ana.souza@estudante.cbmepi.gov.br',
    phone: '(86) 98877-6655',
    status: 'active',
    profileImage: '',
    createdAt: '2023-03-01',
    lastLogin: '2023-06-14T16:20:00'
  },
  {
    id: '5',
    fullName: 'Lucas Pereira',
    birthDate: '2006-02-28',
    role: 'student',
    email: 'lucas.pereira@estudante.cbmepi.gov.br',
    phone: '(86) 99988-7766',
    status: 'active',
    profileImage: '',
    createdAt: '2023-03-10',
    lastLogin: '2023-06-13T11:10:00'
  },
  {
    id: '6',
    fullName: 'Juliana Costa',
    birthDate: '2005-11-05',
    role: 'student',
    email: 'juliana.costa@estudante.cbmepi.gov.br',
    phone: '(86) 98765-9876',
    status: 'inactive',
    profileImage: '',
    createdAt: '2023-04-01',
    lastLogin: '2023-05-20T14:30:00'
  }
];

// Mock data for user permissions
export const mockUserPermissions: Record<UserRole, UserPermission[]> = {
  admin: [
    { id: 'perm_1', name: 'Gerenciar Usuários', description: 'Criar, editar e excluir usuários do sistema', enabled: true },
    { id: 'perm_2', name: 'Gerenciar Disciplinas', description: 'Criar, editar e excluir disciplinas', enabled: true },
    { id: 'perm_3', name: 'Gerenciar Calendário', description: 'Criar e editar eventos no calendário', enabled: true },
    { id: 'perm_4', name: 'Acesso Total', description: 'Acesso completo a todas as funcionalidades do sistema', enabled: true }
  ],
  instructor: [
    { id: 'perm_5', name: 'Visualizar Alunos', description: 'Ver informações dos alunos de suas turmas', enabled: true },
    { id: 'perm_6', name: 'Gerenciar Notas', description: 'Registrar e editar notas dos alunos', enabled: true },
    { id: 'perm_7', name: 'Gerenciar Frequência', description: 'Registrar frequência dos alunos', enabled: true },
    { id: 'perm_8', name: 'Eventos de Calendário', description: 'Adicionar eventos ao calendário', enabled: false }
  ],
  student: [
    { id: 'perm_9', name: 'Visualizar Notas', description: 'Ver suas próprias notas', enabled: true },
    { id: 'perm_10', name: 'Visualizar Calendário', description: 'Ver eventos no calendário', enabled: true },
    { id: 'perm_11', name: 'Meu Perfil', description: 'Visualizar e editar informações do próprio perfil', enabled: true }
  ]
};

// Helper function to get permissions by user role
export function getPermissionsByRole(role: UserRole): UserPermission[] {
  return mockUserPermissions[role] || [];
}

// Mock function to get a user by ID
export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id);
}

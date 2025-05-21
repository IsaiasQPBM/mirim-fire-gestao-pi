
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'instructor' | 'student';
  receiverId: string;
  receiverName: string;
  subject: string;
  content: string;
  createdAt: string;
  read: boolean;
  isGroupMessage?: boolean;
  groupId?: string;
}

export interface Group {
  id: string;
  name: string;
  type: 'class' | 'discipline' | 'custom';
  members: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'assessment' | 'grade' | 'message' | 'deadline' | 'announcement';
  title: string;
  content: string;
  link?: string;
  createdAt: string;
  read: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  important: boolean;
  targetGroups: string[];
  expiresAt?: string;
}

// Mock data for messages
export const mockMessages: Message[] = [
  {
    id: "msg-1",
    senderId: "user-1",
    senderName: "João Silva",
    senderRole: "admin",
    receiverId: "user-2",
    receiverName: "Maria Oliveira",
    subject: "Reunião de coordenação",
    content: "Prezada instrutora, gostaria de agendar uma reunião para discutirmos o desempenho da turma A.",
    createdAt: "2025-05-15T14:30:00",
    read: true
  },
  {
    id: "msg-2",
    senderId: "user-2",
    senderName: "Maria Oliveira",
    senderRole: "instructor",
    receiverId: "user-1",
    receiverName: "João Silva",
    subject: "Re: Reunião de coordenação",
    content: "Claro! Estou disponível amanhã às 14h. Podemos nos reunir na sala de instrutores.",
    createdAt: "2025-05-15T15:45:00",
    read: true
  },
  {
    id: "msg-3",
    senderId: "user-2",
    senderName: "Maria Oliveira",
    senderRole: "instructor",
    receiverId: "user-3",
    receiverName: "Pedro Santos",
    subject: "Avaliação de Desempenho",
    content: "Olá Pedro, gostaria de informar que sua avaliação de primeiros socorros está agendada para a próxima semana.",
    createdAt: "2025-05-16T09:15:00",
    read: false
  },
  {
    id: "msg-4",
    senderId: "user-3",
    senderName: "Pedro Santos",
    senderRole: "student",
    receiverId: "user-2",
    receiverName: "Maria Oliveira",
    subject: "Dúvida sobre material",
    content: "Professora, tenho uma dúvida sobre o material de estudo do capítulo 3. Podemos conversar sobre isso?",
    createdAt: "2025-05-16T10:30:00",
    read: false
  },
  {
    id: "msg-5",
    senderId: "user-1",
    senderName: "João Silva",
    senderRole: "admin",
    receiverId: "group-1",
    receiverName: "Instrutores",
    subject: "Preparação para cerimônia",
    content: "Caros instrutores, estamos organizando a cerimônia de formatura e precisamos de voluntários para coordenar os alunos.",
    createdAt: "2025-05-17T08:00:00",
    read: false,
    isGroupMessage: true,
    groupId: "group-1"
  }
];

// Mock data for groups
export const mockGroups: Group[] = [
  {
    id: "group-1",
    name: "Instrutores",
    type: "custom",
    members: ["user-2", "user-4", "user-5"],
    createdAt: "2025-01-01T00:00:00"
  },
  {
    id: "group-2",
    name: "Turma A",
    type: "class",
    members: ["user-3", "user-6", "user-7", "user-8"],
    createdAt: "2025-01-15T00:00:00"
  },
  {
    id: "group-3",
    name: "Primeiros Socorros",
    type: "discipline",
    members: ["user-2", "user-3", "user-6", "user-9"],
    createdAt: "2025-02-01T00:00:00"
  }
];

// Mock data for notifications
export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-3",
    type: "assessment",
    title: "Nova avaliação agendada",
    content: "Avaliação de Primeiros Socorros agendada para 23/05/2025",
    link: "/pedagogical/assessments/assessment-1",
    createdAt: "2025-05-16T09:15:00",
    read: false
  },
  {
    id: "notif-2",
    userId: "user-3",
    type: "grade",
    title: "Nota publicada",
    content: "Sua nota na avaliação de Combate a Incêndio foi publicada",
    link: "/pedagogical/results/result-1",
    createdAt: "2025-05-15T14:00:00",
    read: true
  },
  {
    id: "notif-3",
    userId: "user-3",
    type: "message",
    title: "Nova mensagem recebida",
    content: "Maria Oliveira enviou uma mensagem: Avaliação de Desempenho",
    link: "/communication/messages/msg-3",
    createdAt: "2025-05-16T09:15:00",
    read: false
  },
  {
    id: "notif-4",
    userId: "user-2",
    type: "message",
    title: "Nova mensagem recebida",
    content: "Pedro Santos enviou uma mensagem: Dúvida sobre material",
    link: "/communication/messages/msg-4",
    createdAt: "2025-05-16T10:30:00",
    read: false
  },
  {
    id: "notif-5",
    userId: "user-2",
    type: "deadline",
    title: "Prazo próximo",
    content: "Entrega das notas da Turma A vence em 2 dias",
    createdAt: "2025-05-17T08:00:00",
    read: false
  }
];

// Mock data for announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "Cerimônia de Formatura",
    content: "A cerimônia de formatura da Turma A acontecerá no dia 30/06/2025, às 15h, no auditório principal.",
    createdAt: "2025-05-15T10:00:00",
    authorId: "user-1",
    authorName: "João Silva",
    important: true,
    targetGroups: ["all"]
  },
  {
    id: "ann-2",
    title: "Simulado de Emergência",
    content: "No próximo sábado, realizaremos um simulado de emergência. Todos os alunos devem comparecer uniformizados.",
    createdAt: "2025-05-16T09:00:00",
    authorId: "user-1",
    authorName: "João Silva",
    important: true,
    targetGroups: ["group-2", "group-3"]
  },
  {
    id: "ann-3",
    title: "Manutenção no Sistema",
    content: "O sistema estará indisponível para manutenção no domingo, dia 25/05/2025, das 00h às 06h.",
    createdAt: "2025-05-17T14:00:00",
    authorId: "user-1",
    authorName: "João Silva",
    important: false,
    targetGroups: ["all"]
  }
];

// Report types
export interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'student' | 'class' | 'academic' | 'administrative';
}

export const reportTypes: ReportType[] = [
  {
    id: 'student-bulletin',
    name: 'Boletim Individual',
    description: 'Gerar boletim individual de desempenho do aluno',
    icon: 'user',
    category: 'student'
  },
  {
    id: 'class-performance',
    name: 'Desempenho por Turma',
    description: 'Relatório de desempenho acadêmico por turma',
    icon: 'users',
    category: 'class'
  },
  {
    id: 'approval-stats',
    name: 'Estatísticas de Aprovação',
    description: 'Estatísticas de aprovação e reprovação por disciplina',
    icon: 'chart-bar',
    category: 'academic'
  },
  {
    id: 'attendance',
    name: 'Relatório de Frequência',
    description: 'Relatório detalhado de frequência de alunos',
    icon: 'calendar',
    category: 'administrative'
  },
  {
    id: 'comparative',
    name: 'Análise Comparativa',
    description: 'Análise comparativa de desempenho entre períodos',
    icon: 'chart-pie',
    category: 'academic'
  }
];


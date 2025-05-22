
import { Assessment, StudentPerformance, PedagogicalObservation } from './pedagogicalTypes';

export type StudentStatus = 'active' | 'inactive' | 'on_leave';

export interface Student {
  id: string;
  userId: string; // Reference to user account
  fullName: string;
  registrationNumber: string;
  birthDate: string;
  email: string;
  phone: string;
  profileImage?: string;
  status: StudentStatus;
  classIds: string[]; // Classes the student is enrolled in
  courseIds: string[]; // Courses the student is taking
  enrollmentDate: string;
  guardians: Guardian[];
  documents: StudentDocument[];
  notes: string; // Administrative notes
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isEmergencyContact: boolean;
}

export interface StudentDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  filePath: string;
  notes?: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  disciplineId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'justified';
  justification?: string;
}

export interface StudentAcademicRecord {
  studentId: string; // Added studentId property
  courseId: string;
  courseName: string;
  status: 'in_progress' | 'completed' | 'dropped';
  startDate: string;
  endDate?: string;
  disciplines: {
    id: string;
    name: string;
    status: 'in_progress' | 'completed' | 'not_started';
    grade?: number;
    instructorId: string;
    instructorName: string;
  }[];
}

export interface TimelineEvent {
  id: string;
  studentId: string; // Added studentId property
  date: string;
  title: string;
  description: string;
  type: 'academic' | 'attendance' | 'observation' | 'achievement' | 'communication' | 'administrative';
  relatedId?: string; // Could reference an assessment, observation, etc.
  icon?: string;
}

export interface StudentCommunication {
  id: string;
  studentId: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'instructor' | 'guardian' | 'student' | 'system';
  recipientId: string;
  recipientName: string;
  recipientRole: 'admin' | 'instructor' | 'guardian' | 'student';
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
  attachments?: {
    id: string;
    name: string;
    filePath: string;
  }[];
}

// Mock data for students
export const mockStudents: Student[] = [
  {
    id: '1',
    userId: '4', // References Ana Souza from userTypes
    fullName: 'Ana Souza',
    registrationNumber: '2023001',
    birthDate: '2005-07-12',
    email: 'ana.souza@estudante.cbmepi.gov.br',
    phone: '(86) 98877-6655',
    profileImage: '',
    status: 'active',
    classIds: ['1'],
    courseIds: ['1'],
    enrollmentDate: '2023-03-01',
    guardians: [
      {
        id: '1',
        name: 'Carlos Souza',
        relationship: 'Pai',
        phone: '(86) 99999-8888',
        email: 'carlos.souza@email.com',
        isEmergencyContact: true
      },
      {
        id: '2',
        name: 'Marta Souza',
        relationship: 'Mãe',
        phone: '(86) 99999-7777',
        email: 'marta.souza@email.com',
        isEmergencyContact: true
      }
    ],
    documents: [
      {
        id: '1',
        name: 'RG',
        type: 'identification',
        uploadDate: '2023-03-01',
        filePath: '/documents/ana-rg.pdf',
        notes: 'Documento completo'
      },
      {
        id: '2',
        name: 'Atestado Médico',
        type: 'medical',
        uploadDate: '2023-03-01',
        filePath: '/documents/ana-medical.pdf',
        notes: 'Apto para atividades físicas'
      }
    ],
    notes: 'Aluna exemplar, demonstra grande interesse nas atividades.',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 101',
      neighborhood: 'Centro',
      city: 'Teresina',
      state: 'PI',
      zipCode: '64000-000'
    },
    createdAt: '2023-03-01T10:00:00',
    updatedAt: '2023-03-01T10:00:00'
  },
  {
    id: '2',
    userId: '5', // References Lucas Pereira from userTypes
    fullName: 'Lucas Pereira',
    registrationNumber: '2023002',
    birthDate: '2006-02-28',
    email: 'lucas.pereira@estudante.cbmepi.gov.br',
    phone: '(86) 99988-7766',
    profileImage: '',
    status: 'active',
    classIds: ['1'],
    courseIds: ['1'],
    enrollmentDate: '2023-03-10',
    guardians: [
      {
        id: '3',
        name: 'Roberto Pereira',
        relationship: 'Pai',
        phone: '(86) 99888-7777',
        email: 'roberto.pereira@email.com',
        isEmergencyContact: true
      }
    ],
    documents: [
      {
        id: '3',
        name: 'RG',
        type: 'identification',
        uploadDate: '2023-03-10',
        filePath: '/documents/lucas-rg.pdf',
        notes: ''
      }
    ],
    notes: 'Aluno dedicado, mas precisa melhorar a disciplina.',
    address: {
      street: 'Avenida Principal',
      number: '456',
      neighborhood: 'Jóquei',
      city: 'Teresina',
      state: 'PI',
      zipCode: '64000-000'
    },
    createdAt: '2023-03-10T14:30:00',
    updatedAt: '2023-03-10T14:30:00'
  },
  {
    id: '3',
    userId: '6', // References Juliana Costa from userTypes
    fullName: 'Juliana Costa',
    registrationNumber: '2023003',
    birthDate: '2005-11-05',
    email: 'juliana.costa@estudante.cbmepi.gov.br',
    phone: '(86) 98765-9876',
    profileImage: '',
    status: 'inactive',
    classIds: [],
    courseIds: ['1'],
    enrollmentDate: '2023-04-01',
    guardians: [
      {
        id: '4',
        name: 'Fernanda Costa',
        relationship: 'Mãe',
        phone: '(86) 99777-6666',
        email: 'fernanda.costa@email.com',
        isEmergencyContact: true
      },
      {
        id: '5',
        name: 'José Costa',
        relationship: 'Pai',
        phone: '(86) 99777-5555',
        email: 'jose.costa@email.com',
        isEmergencyContact: false
      }
    ],
    documents: [
      {
        id: '4',
        name: 'RG',
        type: 'identification',
        uploadDate: '2023-04-01',
        filePath: '/documents/juliana-rg.pdf',
        notes: ''
      }
    ],
    notes: 'Aluna transferida temporariamente.',
    address: {
      street: 'Rua do Comércio',
      number: '789',
      neighborhood: 'Fátima',
      city: 'Teresina',
      state: 'PI',
      zipCode: '64000-000'
    },
    createdAt: '2023-04-01T09:15:00',
    updatedAt: '2023-05-20T14:30:00'
  }
];

// Mock attendance records
export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    studentId: '1',
    classId: '1',
    disciplineId: '1',
    date: '2023-05-10',
    status: 'present'
  },
  {
    id: '2',
    studentId: '1',
    classId: '1',
    disciplineId: '1',
    date: '2023-05-12',
    status: 'absent',
    justification: 'Atestado médico'
  },
  {
    id: '3',
    studentId: '1',
    classId: '1',
    disciplineId: '2',
    date: '2023-05-15',
    status: 'present'
  },
  {
    id: '4',
    studentId: '2',
    classId: '1',
    disciplineId: '1',
    date: '2023-05-10',
    status: 'late'
  },
  {
    id: '5',
    studentId: '2',
    classId: '1',
    disciplineId: '1',
    date: '2023-05-12',
    status: 'present'
  }
];

// Mock timeline events
export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    studentId: '1',
    date: '2023-05-15T10:30:00',
    title: 'Nota de Avaliação',
    description: 'Recebeu nota 85/100 na avaliação de Técnicas de Resgate',
    type: 'academic',
    relatedId: '1', // Related to assessment result id
  },
  {
    id: '2',
    studentId: '1',
    date: '2023-05-12T08:45:00',
    title: 'Ausência Justificada',
    description: 'Ausência justificada por motivo de saúde na aula de Técnicas de Resgate',
    type: 'attendance',
    relatedId: '2', // Related to attendance record id
  },
  {
    id: '3',
    studentId: '1',
    date: '2023-05-10T14:30:00',
    title: 'Observação Pedagógica',
    description: 'Demonstrou excelente liderança durante o exercício em grupo.',
    type: 'observation',
    relatedId: '1', // Related to observation id
  },
  {
    id: '4',
    studentId: '1',
    date: '2023-04-20T16:00:00',
    title: 'Certificado',
    description: 'Recebeu certificado de participação no workshop de primeiros socorros.',
    type: 'achievement'
  },
  {
    id: '5',
    studentId: '2',
    date: '2023-05-18T09:45:00',
    title: 'Observação Pedagógica',
    description: 'Problemas de concentração durante as aulas teóricas.',
    type: 'observation',
    relatedId: '3', // Related to observation id
  }
];

// Mock communications
export const mockStudentCommunications: StudentCommunication[] = [
  {
    id: '1',
    studentId: '1',
    senderId: '2', // Instructor
    senderName: 'Maria Oliveira',
    senderRole: 'instructor',
    recipientId: '1',
    recipientName: 'Ana Souza',
    recipientRole: 'student',
    subject: 'Feedback sobre apresentação',
    message: 'Ana, parabéns pela excelente apresentação no exercício de hoje. Seu domínio do conteúdo e sua clareza na comunicação foram exemplares.',
    date: '2023-05-16T14:30:00',
    isRead: true
  },
  {
    id: '2',
    studentId: '1',
    senderId: '1', // Admin
    senderName: 'João Silva',
    senderRole: 'admin',
    recipientId: '1',
    recipientName: 'Ana Souza',
    recipientRole: 'student',
    subject: 'Certificado disponível',
    message: 'Informamos que seu certificado de participação no workshop de primeiros socorros já está disponível para download na plataforma.',
    date: '2023-04-22T10:15:00',
    isRead: true
  },
  {
    id: '3',
    studentId: '1',
    senderId: '1',
    senderName: 'Ana Souza',
    senderRole: 'student',
    recipientId: '2', // Instructor
    recipientName: 'Maria Oliveira',
    recipientRole: 'instructor',
    subject: 'Dúvida sobre atividade',
    message: 'Professora, tenho uma dúvida sobre o exercício proposto para a próxima aula. Poderia esclarecer qual abordagem devemos utilizar na simulação de resgate?',
    date: '2023-05-17T09:20:00',
    isRead: false
  }
];

// Mock academic records
export const mockAcademicRecords: StudentAcademicRecord[] = [
  {
    studentId: '1',
    courseId: '1',
    courseName: 'Formação Básica de Bombeiro Mirim',
    status: 'in_progress',
    startDate: '2023-03-01',
    disciplines: [
      {
        id: '1',
        name: 'Técnicas de Resgate e Salvamento',
        status: 'in_progress',
        grade: 85,
        instructorId: '2',
        instructorName: 'Maria Oliveira'
      },
      {
        id: '2',
        name: 'Primeiros Socorros',
        status: 'in_progress',
        grade: 70,
        instructorId: '3',
        instructorName: 'Pedro Santos'
      },
      {
        id: '3',
        name: 'Prevenção de Incêndios',
        status: 'not_started',
        instructorId: '2',
        instructorName: 'Maria Oliveira'
      }
    ]
  }
];

// Helper functions
export function getStudentById(id: string): Student | undefined {
  return mockStudents.find(student => student.id === id);
}

export function getStudentsByClassId(classId: string): Student[] {
  return mockStudents.filter(student => student.classIds.includes(classId));
}

export function getStudentsByCourseId(courseId: string): Student[] {
  return mockStudents.filter(student => student.courseIds.includes(courseId));
}

export function getTimelineEventsByStudentId(studentId: string): TimelineEvent[] {
  return mockTimelineEvents.filter(event => event.studentId === studentId);
}

export function getAttendanceByStudentId(studentId: string): AttendanceRecord[] {
  return mockAttendanceRecords.filter(record => record.studentId === studentId);
}

export function getCommunicationsByStudentId(studentId: string): StudentCommunication[] {
  return mockStudentCommunications.filter(
    comm => comm.studentId === studentId || comm.recipientId === studentId
  );
}

export function getAcademicRecordByStudentId(studentId: string): StudentAcademicRecord | undefined {
  return mockAcademicRecords.find(record => record.studentId === studentId);
}

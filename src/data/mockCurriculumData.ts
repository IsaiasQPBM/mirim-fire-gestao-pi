
import { Course, Discipline, Class, Lesson, CalendarEvent } from './curriculumTypes';

export const mockCourses: Course[] = [
  {
    id: "course1",
    name: "Formação Básica de Bombeiro Mirim",
    description: "Curso introdutório aos princípios e práticas do Corpo de Bombeiros para crianças e adolescentes.",
    objectives: "Formar jovens com princípios de cidadania, noções básicas de prevenção e combate a incêndio, primeiros socorros e educação física.",
    totalHours: 120,
    prerequisites: [],
    isActive: true,
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2023-01-15T10:00:00Z"
  },
  {
    id: "course2",
    name: "Prevenção e Combate a Incêndio Mirim",
    description: "Capacitação específica em técnicas de prevenção e combate a princípios de incêndio.",
    objectives: "Desenvolver habilidades básicas de identificação de riscos e ações iniciais de combate a incêndio.",
    totalHours: 80,
    prerequisites: ["course1"],
    isActive: true,
    createdAt: "2023-02-10T09:30:00Z",
    updatedAt: "2023-02-10T09:30:00Z"
  },
  {
    id: "course3",
    name: "Primeiros Socorros para Jovens",
    description: "Treinamento em procedimentos básicos de primeiros socorros adaptados para jovens.",
    objectives: "Capacitar os alunos a reconhecer situações de emergência e realizar os primeiros atendimentos.",
    totalHours: 60,
    prerequisites: ["course1"],
    isActive: true,
    createdAt: "2023-03-05T14:20:00Z",
    updatedAt: "2023-03-05T14:20:00Z"
  },
  {
    id: "course4",
    name: "Salvamento Aquático Júnior",
    description: "Introdução às técnicas de salvamento aquático e prevenção de afogamentos.",
    objectives: "Ensinar técnicas básicas de segurança aquática, identificação de riscos e procedimentos de salvamento.",
    totalHours: 90,
    prerequisites: ["course1", "course3"],
    isActive: true,
    createdAt: "2023-04-12T11:15:00Z",
    updatedAt: "2023-04-12T11:15:00Z"
  }
];

export const mockDisciplines: Discipline[] = [
  {
    id: "disc1",
    courseId: "course1",
    courseName: "Formação Básica de Bombeiro Mirim",
    name: "Introdução ao CBMEPI",
    description: "História, valores e estrutura do Corpo de Bombeiros Militar do Piauí.",
    theoryHours: 20,
    practiceHours: 0,
    isActive: true,
    createdAt: "2023-01-16T08:30:00Z",
    updatedAt: "2023-01-16T08:30:00Z"
  },
  {
    id: "disc2",
    courseId: "course1",
    courseName: "Formação Básica de Bombeiro Mirim",
    name: "Noções de Primeiros Socorros",
    description: "Conceitos básicos e práticas iniciais de primeiros socorros.",
    theoryHours: 15,
    practiceHours: 25,
    isActive: true,
    createdAt: "2023-01-17T09:45:00Z",
    updatedAt: "2023-01-17T09:45:00Z"
  },
  {
    id: "disc3",
    courseId: "course1",
    courseName: "Formação Básica de Bombeiro Mirim",
    name: "Prevenção de Incêndios",
    description: "Princípios de prevenção e comportamento seguro em relação ao fogo.",
    theoryHours: 10,
    practiceHours: 20,
    isActive: true,
    createdAt: "2023-01-18T10:15:00Z",
    updatedAt: "2023-01-18T10:15:00Z"
  },
  {
    id: "disc4",
    courseId: "course1",
    courseName: "Formação Básica de Bombeiro Mirim",
    name: "Ordem Unida",
    description: "Disciplina, movimentos básicos de marcha e formação.",
    theoryHours: 5,
    practiceHours: 25,
    isActive: true,
    createdAt: "2023-01-19T11:00:00Z",
    updatedAt: "2023-01-19T11:00:00Z"
  },
  {
    id: "disc5",
    courseId: "course2",
    courseName: "Prevenção e Combate a Incêndio Mirim",
    name: "Classes de Incêndio",
    description: "Identificação e classificação de diferentes tipos de incêndio.",
    theoryHours: 15,
    practiceHours: 10,
    isActive: true,
    createdAt: "2023-02-11T08:00:00Z",
    updatedAt: "2023-02-11T08:00:00Z"
  },
  {
    id: "disc6",
    courseId: "course2",
    courseName: "Prevenção e Combate a Incêndio Mirim",
    name: "Equipamentos de Combate",
    description: "Conhecimento e manuseio básico de equipamentos de combate a incêndio.",
    theoryHours: 10,
    practiceHours: 25,
    isActive: true,
    createdAt: "2023-02-12T09:30:00Z",
    updatedAt: "2023-02-12T09:30:00Z"
  },
  {
    id: "disc7",
    courseId: "course3",
    courseName: "Primeiros Socorros para Jovens",
    name: "Avaliação Inicial de Vítimas",
    description: "Técnicas de avaliação primária e secundária de vítimas.",
    theoryHours: 12,
    practiceHours: 8,
    isActive: true,
    createdAt: "2023-03-06T08:15:00Z",
    updatedAt: "2023-03-06T08:15:00Z"
  },
  {
    id: "disc8",
    courseId: "course3",
    courseName: "Primeiros Socorros para Jovens",
    name: "RCP Básica",
    description: "Procedimentos de Ressuscitação Cardiopulmonar para leigos.",
    theoryHours: 10,
    practiceHours: 20,
    isActive: true,
    createdAt: "2023-03-07T10:00:00Z",
    updatedAt: "2023-03-07T10:00:00Z"
  }
];

export const mockClasses: Class[] = [
  {
    id: "class1",
    name: "Turma 1 - Formação Básica 2023",
    courseId: "course1",
    courseName: "Formação Básica de Bombeiro Mirim",
    startDate: "2023-03-01",
    endDate: "2023-08-30",
    timeSchedule: "Seg, Qua e Sex, 08:00 - 12:00",
    location: "Unidade Central CBMEPI",
    status: "active",
    studentIds: ["student1", "student2", "student3", "student4", "student5"],
    instructorIds: ["instructor1", "instructor2"],
    createdAt: "2023-02-15T14:30:00Z",
    updatedAt: "2023-02-15T14:30:00Z"
  },
  {
    id: "class2",
    name: "Turma 2 - Prevenção e Combate a Incêndio 2023",
    courseId: "course2",
    courseName: "Prevenção e Combate a Incêndio Mirim",
    startDate: "2023-04-15",
    endDate: "2023-08-15",
    timeSchedule: "Ter e Qui, 14:00 - 18:00",
    location: "Centro de Treinamento Leste",
    status: "active",
    studentIds: ["student1", "student3", "student6", "student7"],
    instructorIds: ["instructor2", "instructor3"],
    createdAt: "2023-03-20T10:45:00Z",
    updatedAt: "2023-03-20T10:45:00Z"
  },
  {
    id: "class3",
    name: "Turma 1 - Primeiros Socorros 2023",
    courseId: "course3",
    courseName: "Primeiros Socorros para Jovens",
    startDate: "2023-05-10",
    endDate: "2023-07-30",
    timeSchedule: "Sábados, 08:00 - 12:00",
    location: "Unidade de Saúde CBMEPI",
    status: "upcoming",
    studentIds: ["student2", "student4", "student8", "student9", "student10"],
    instructorIds: ["instructor1", "instructor4"],
    createdAt: "2023-04-05T09:20:00Z",
    updatedAt: "2023-04-05T09:20:00Z"
  }
];

export const mockLessons: Lesson[] = [
  {
    id: "lesson1",
    classId: "class1",
    disciplineId: "disc1",
    title: "História do CBMEPI",
    description: "Aula sobre a fundação e história do Corpo de Bombeiros do Piauí",
    date: "2023-03-01",
    startTime: "08:00",
    endTime: "10:00",
    instructorId: "instructor1",
    resources: ["Apresentação digital", "Vídeos históricos"],
    content: "Fundação do CBMEPI, marcos históricos, evolução ao longo dos anos.",
    status: "completed",
    createdAt: "2023-02-20T11:30:00Z",
    updatedAt: "2023-02-20T11:30:00Z"
  },
  {
    id: "lesson2",
    classId: "class1",
    disciplineId: "disc1",
    title: "Valores e Princípios",
    description: "Aula sobre os valores fundamentais do bombeiro militar",
    date: "2023-03-03",
    startTime: "08:00",
    endTime: "10:00",
    instructorId: "instructor1",
    resources: ["Apresentação digital", "Material impresso"],
    content: "Valores de disciplina, coragem, altruísmo e trabalho em equipe.",
    status: "completed",
    createdAt: "2023-02-20T11:45:00Z",
    updatedAt: "2023-02-20T11:45:00Z"
  },
  {
    id: "lesson3",
    classId: "class1",
    disciplineId: "disc2",
    title: "Introdução aos Primeiros Socorros",
    description: "Conceitos básicos e importância dos primeiros socorros",
    date: "2023-03-06",
    startTime: "08:00",
    endTime: "12:00",
    instructorId: "instructor2",
    resources: ["Manequim de treinamento", "Kit de primeiros socorros"],
    content: "Definição de primeiros socorros, avaliação da cena, acionamento de socorro.",
    status: "completed",
    createdAt: "2023-02-21T09:15:00Z",
    updatedAt: "2023-02-21T09:15:00Z"
  },
  {
    id: "lesson4",
    classId: "class1",
    disciplineId: "disc3",
    title: "Prevenção a Incêndios Domésticos",
    description: "Identificação de riscos no ambiente doméstico",
    date: "2023-03-08",
    startTime: "08:00",
    endTime: "12:00",
    instructorId: "instructor2",
    resources: ["Maquete de casa", "Material ilustrativo"],
    content: "Riscos de incêndio em cozinhas, instalações elétricas, comportamentos seguros.",
    status: "completed",
    createdAt: "2023-02-22T14:00:00Z",
    updatedAt: "2023-02-22T14:00:00Z"
  },
  {
    id: "lesson5",
    classId: "class2",
    disciplineId: "disc5",
    title: "Classes de Incêndio - Teoria",
    description: "Identificação e classificação dos tipos de incêndio",
    date: "2023-04-18",
    startTime: "14:00",
    endTime: "16:00",
    instructorId: "instructor3",
    resources: ["Apresentação digital", "Vídeos demonstrativos"],
    content: "Classes A, B, C, D e K de incêndio, características e exemplos.",
    status: "planned",
    createdAt: "2023-04-01T10:30:00Z",
    updatedAt: "2023-04-01T10:30:00Z"
  }
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "event1",
    title: "Aula: História do CBMEPI",
    description: "Primeira aula do curso de Formação Básica",
    startDate: "2023-03-01T08:00:00",
    endDate: "2023-03-01T10:00:00",
    type: "lesson",
    classId: "class1",
    disciplineId: "disc1",
    createdAt: "2023-02-20T11:30:00Z",
    updatedAt: "2023-02-20T11:30:00Z"
  },
  {
    id: "event2",
    title: "Aula: Valores e Princípios",
    description: "Segunda aula do curso de Formação Básica",
    startDate: "2023-03-03T08:00:00",
    endDate: "2023-03-03T10:00:00",
    type: "lesson",
    classId: "class1",
    disciplineId: "disc1",
    createdAt: "2023-02-20T11:45:00Z",
    updatedAt: "2023-02-20T11:45:00Z"
  },
  {
    id: "event3",
    title: "Avaliação de Primeiros Socorros",
    description: "Avaliação prática da disciplina de Primeiros Socorros",
    startDate: "2023-04-10T08:00:00",
    endDate: "2023-04-10T12:00:00",
    type: "exam",
    classId: "class1",
    disciplineId: "disc2",
    createdAt: "2023-03-15T09:00:00Z",
    updatedAt: "2023-03-15T09:00:00Z"
  },
  {
    id: "event4",
    title: "Dia do Bombeiro Mirim",
    description: "Celebração anual do Dia do Bombeiro Mirim com atividades especiais",
    startDate: "2023-05-20T08:00:00",
    endDate: "2023-05-20T17:00:00",
    type: "event",
    createdAt: "2023-04-01T10:00:00Z",
    updatedAt: "2023-04-01T10:00:00Z"
  },
  {
    id: "event5",
    title: "Aula: Classes de Incêndio - Teoria",
    description: "Primeira aula do curso de Prevenção e Combate a Incêndio",
    startDate: "2023-04-18T14:00:00",
    endDate: "2023-04-18T16:00:00",
    type: "lesson",
    classId: "class2",
    disciplineId: "disc5",
    createdAt: "2023-04-01T10:30:00Z",
    updatedAt: "2023-04-01T10:30:00Z"
  }
];

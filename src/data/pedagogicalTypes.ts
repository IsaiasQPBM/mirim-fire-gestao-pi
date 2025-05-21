
export type ObservationType = 'behavioral' | 'academic' | 'attendance' | 'health' | 'personal';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type QuestionType = 'multiple_choice' | 'essay' | 'practical';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface PedagogicalObservation {
  id: string;
  studentId: string;
  date: string;
  description: string;
  type: ObservationType;
  priority: PriorityLevel;
  instructorId: string;
  createdAt: string;
}

export interface StudentPerformance {
  id: string;
  studentId: string;
  disciplineId: string;
  assessmentId: string;
  score: number;
  maxScore: number;
  date: string;
  feedback: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  disciplineId: string;
  classId: string;
  date: string;
  duration: number; // in minutes
  totalPoints: number;
  questions: Question[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  points: number;
  difficultyLevel: DifficultyLevel;
  disciplineId: string;
  options?: QuestionOption[];
  correctAnswer?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface StudentAssessmentResult {
  id: string;
  studentId: string;
  assessmentId: string;
  startTime: string;
  endTime: string;
  score: number;
  totalPoints: number;
  answers: StudentAnswer[];
  feedback: string;
  status: 'pending' | 'completed' | 'graded';
}

export interface StudentAnswer {
  questionId: string;
  answer: string | string[];
  score?: number;
  feedback?: string;
}

// Mock data for testing
export const mockObservations: PedagogicalObservation[] = [
  {
    id: '1',
    studentId: '4',
    date: '2023-05-10',
    description: 'Demonstrou excelente liderança durante o exercício em grupo.',
    type: 'behavioral',
    priority: 'medium',
    instructorId: '2',
    createdAt: '2023-05-10T14:30:00'
  },
  {
    id: '2',
    studentId: '4',
    date: '2023-05-15',
    description: 'Dificuldade em compreender conceitos básicos de primeiros socorros.',
    type: 'academic',
    priority: 'high',
    instructorId: '2',
    createdAt: '2023-05-15T10:15:00'
  },
  {
    id: '3',
    studentId: '5',
    date: '2023-05-18',
    description: 'Problemas de concentração durante as aulas teóricas.',
    type: 'behavioral',
    priority: 'medium',
    instructorId: '3',
    createdAt: '2023-05-18T09:45:00'
  }
];

export const mockStudentPerformance: StudentPerformance[] = [
  {
    id: '1',
    studentId: '4',
    disciplineId: '1',
    assessmentId: '1',
    score: 85,
    maxScore: 100,
    date: '2023-04-15',
    feedback: 'Bom desempenho geral, precisa melhorar em técnicas de resgate.'
  },
  {
    id: '2',
    studentId: '4',
    disciplineId: '2',
    assessmentId: '2',
    score: 70,
    maxScore: 100,
    date: '2023-04-22',
    feedback: 'Desempenho satisfatório, porém precisa melhorar em primeiros socorros.'
  },
  {
    id: '3',
    studentId: '4',
    disciplineId: '1',
    assessmentId: '3',
    score: 90,
    maxScore: 100,
    date: '2023-05-10',
    feedback: 'Excelente melhoria nas técnicas de resgate.'
  },
  {
    id: '4',
    studentId: '5',
    disciplineId: '1',
    assessmentId: '1',
    score: 65,
    maxScore: 100,
    date: '2023-04-15',
    feedback: 'Precisa reforçar conhecimentos básicos.'
  }
];

export const mockAssessments: Assessment[] = [
  {
    id: '1',
    title: 'Avaliação de Técnicas de Resgate',
    description: 'Avaliação sobre técnicas básicas de resgate e salvamento.',
    disciplineId: '1',
    classId: '1',
    date: '2023-04-15',
    duration: 60,
    totalPoints: 100,
    questions: [],
    isPublished: true,
    createdAt: '2023-04-01',
    updatedAt: '2023-04-01'
  },
  {
    id: '2',
    title: 'Avaliação de Primeiros Socorros',
    description: 'Avaliação sobre procedimentos básicos de primeiros socorros.',
    disciplineId: '2',
    classId: '1',
    date: '2023-04-22',
    duration: 45,
    totalPoints: 100,
    questions: [],
    isPublished: true,
    createdAt: '2023-04-08',
    updatedAt: '2023-04-08'
  }
];

export const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'Qual o procedimento correto para imobilização de uma vítima com suspeita de trauma na coluna?',
    type: 'multiple_choice',
    points: 10,
    difficultyLevel: 'medium',
    disciplineId: '1',
    options: [
      { id: '1a', text: 'Mover rapidamente para uma posição mais confortável', isCorrect: false },
      { id: '1b', text: 'Utilizar prancha rígida e colar cervical', isCorrect: true },
      { id: '1c', text: 'Sentar a vítima para avaliar a mobilidade', isCorrect: false },
      { id: '1d', text: 'Aplicar compressas quentes na região da coluna', isCorrect: false }
    ]
  },
  {
    id: '2',
    text: 'Descreva o procedimento para avaliação de vias aéreas em uma vítima inconsciente.',
    type: 'essay',
    points: 15,
    difficultyLevel: 'hard',
    disciplineId: '2'
  }
];

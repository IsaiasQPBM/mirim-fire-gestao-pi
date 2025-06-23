
import React from 'react';
import { User, FileText, BookOpen, Calendar, MessageSquare } from 'lucide-react';
import { SearchResult } from './types';

export const mockResults: SearchResult[] = [
  {
    id: 'user-1',
    title: 'Pedro Santos',
    description: 'Aluno - Turma A',
    icon: <User className="h-4 w-4" />,
    path: '/pedagogical/student/user-1',
    type: 'user'
  },
  {
    id: 'user-2',
    title: 'Maria Oliveira',
    description: 'Aluno - Turma B',
    icon: <User className="h-4 w-4" />,
    path: '/pedagogical/student/user-2',
    type: 'user'
  },
  {
    id: 'user-3',
    title: 'Pedro Oliveira',
    description: 'Instrutor - Turma C',
    icon: <User className="h-4 w-4" />,
    path: '/pedagogical/student/user-3',
    type: 'user'
  },
  {
    id: 'user-4',
    title: 'Ana Costa',
    description: 'Aluno - Turma A',
    icon: <User className="h-4 w-4" />,
    path: '/pedagogical/student/user-4',
    type: 'user'
  },
  {
    id: 'course-1',
    title: 'Bombeiro Mirim',
    description: 'Curso principal',
    icon: <BookOpen className="h-4 w-4" />,
    path: '/courses/course-1',
    type: 'course'
  },
  {
    id: 'class-1',
    title: 'Turma A - 2025',
    description: 'Bombeiro Mirim',
    icon: <User className="h-4 w-4" />,
    path: '/classes/class-1',
    type: 'class'
  },
  {
    id: 'report-1',
    title: 'Boletim Individual',
    description: 'Relatório de desempenho individual',
    icon: <FileText className="h-4 w-4" />,
    path: '/reports/student-bulletin',
    type: 'report'
  },
  {
    id: 'report-2',
    title: 'Relatório de Frequência',
    description: 'Acompanhamento de presença',
    icon: <Calendar className="h-4 w-4" />,
    path: '/reports/attendance',
    type: 'report'
  },
  {
    id: 'message-1',
    title: 'Instruções para a próxima aula',
    description: 'Mensagem do Instrutor Carlos',
    icon: <MessageSquare className="h-4 w-4" />,
    path: '/communication/messages',
    type: 'message'
  }
];

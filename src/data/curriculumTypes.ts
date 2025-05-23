export interface Course {
  id: string;
  name: string;
  description: string;
  objectives: string;
  totalHours: number;
  prerequisites: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Discipline {
  id: string;
  courseId: string;
  courseName?: string;
  name: string;
  description: string;
  theoryHours: number;
  practiceHours: number;
  workload: number; // Total hours (theory + practice)
  status: 'active' | 'inactive' | 'draft';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  name: string;
  courseId: string;
  courseName?: string;
  startDate: string;
  endDate: string;
  timeSchedule: string;
  location: string;
  status: 'active' | 'upcoming' | 'concluded';
  studentIds: string[];
  instructorIds: string[];
  disciplineIds: string[]; // List of discipline IDs for this class
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  classId: string;
  disciplineId: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  instructorId: string;
  resources: string[];
  content: string;
  status: 'planned' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'lesson' | 'exam' | 'event';
  classId?: string;
  disciplineId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumItem {
  courseId: string;
  courseName: string;
  disciplines: {
    id: string;
    name: string;
    theoryHours: number;
    practiceHours: number;
  }[];
}

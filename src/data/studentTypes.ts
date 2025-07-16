import { supabase } from '@/lib/supabase';

export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'dropped';

export interface Student {
  id: string;
  fullName: string;
  email: string;
  status: StudentStatus;
}

export interface StudentDocument {
  id: string;
  studentId: string;
  name: string;
  url: string;
  uploadedAt: string;
}

// Histórico acadêmico
export async function getAcademicRecordByStudentId(studentId: string) {
  const { data, error } = await supabase
    .from('academic_records')
    .select('*')
    .eq('student_id', studentId)
    .single();
  if (error || !data) return null;
  return data;
}

// Comunicações
export async function getCommunicationsByStudentId(studentId: string) {
  const { data, error } = await supabase
    .from('communications')
    .select('*')
    .eq('student_id', studentId);
  if (error || !data) return [];
  return data;
}

// Linha do tempo
export async function getTimelineEventsByStudentId(studentId: string) {
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('student_id', studentId);
  if (error || !data) return [];
  return data;
}

// Frequência
export async function getAttendanceByStudentId(studentId: string) {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('student_id', studentId);
  if (error || !data) return [];
  return data;
} 

import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Class = Tables<'classes'>;
export type ClassInsert = TablesInsert<'classes'>;
export type ClassUpdate = TablesUpdate<'classes'>;

export interface ClassWithDetails extends Class {
  courses: {
    id: string;
    name: string;
  } | null;
  class_students: {
    id: string;
    student_id: string;
    profiles: {
      id: string;
      full_name: string;
    };
  }[];
  class_instructors: {
    id: string;
    instructor_id: string;
    is_primary: boolean;
    profiles: {
      id: string;
      full_name: string;
    };
  }[];
}

class ClassesService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          courses:course_id (
            id,
            name
          ),
          class_students (
            id,
            student_id,
            profiles:student_id (
              id,
              full_name
            )
          ),
          class_instructors (
            id,
            instructor_id,
            is_primary,
            profiles:instructor_id (
              id,
              full_name
            )
          )
        `)
        .order('start_date', { ascending: false });

      if (error) throw error;
      return { data: data as ClassWithDetails[], error: null };
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      return { data: null, error: error.message };
    }
  }

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          courses:course_id (
            id,
            name
          ),
          class_students (
            id,
            student_id,
            enrollment_date,
            status,
            profiles:student_id (
              id,
              full_name,
              phone
            )
          ),
          class_instructors (
            id,
            instructor_id,
            is_primary,
            assignment_date,
            profiles:instructor_id (
              id,
              full_name,
              phone
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data: data as ClassWithDetails, error: null };
    } catch (error: any) {
      console.error('Error fetching class:', error);
      return { data: null, error: error.message };
    }
  }

  async create(classData: ClassInsert) {
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert(classData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating class:', error);
      return { data: null, error: error.message };
    }
  }

  async update(id: string, updates: ClassUpdate) {
    try {
      const { data, error } = await supabase
        .from('classes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating class:', error);
      return { data: null, error: error.message };
    }
  }

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting class:', error);
      return { error: error.message };
    }
  }

  async addStudent(classId: string, studentId: string) {
    try {
      const { data, error } = await supabase
        .from('class_students')
        .insert({
          class_id: classId,
          student_id: studentId
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error adding student to class:', error);
      return { data: null, error: error.message };
    }
  }

  async removeStudent(classId: string, studentId: string) {
    try {
      const { error } = await supabase
        .from('class_students')
        .delete()
        .eq('class_id', classId)
        .eq('student_id', studentId);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Error removing student from class:', error);
      return { error: error.message };
    }
  }

  async addInstructor(classId: string, instructorId: string, isPrimary = false) {
    try {
      const { data, error } = await supabase
        .from('class_instructors')
        .insert({
          class_id: classId,
          instructor_id: instructorId,
          is_primary: isPrimary
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error adding instructor to class:', error);
      return { data: null, error: error.message };
    }
  }

  async removeInstructor(classId: string, instructorId: string) {
    try {
      const { error } = await supabase
        .from('class_instructors')
        .delete()
        .eq('class_id', classId)
        .eq('instructor_id', instructorId);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Error removing instructor from class:', error);
      return { error: error.message };
    }
  }
}

export const classesService = new ClassesService();


import { supabase } from '@/integrations/supabase/client';
import { authService } from './authService';
import { coursesService } from './coursesService';
import { classesService } from './classesService';
import { toast } from '@/hooks/use-toast';

interface MigrationLog {
  timestamp: string;
  operation: string;
  entity: string;
  success: boolean;
  details?: string;
  error?: string;
}

interface MigrationDetail {
  id: string;
  newId?: string;
  status: 'success' | 'failed';
  reason?: string;
}

interface MigrationResult {
  total: number;
  success: number;
  failed: number;
  details: MigrationDetail[];
}

interface ExecutionResult {
  success: boolean;
  message: string;
}

class MigrationService {
  private logs: MigrationLog[] = [];

  private logOperation(operation: string, entity: string, success: boolean, details?: string, error?: string): MigrationLog {
    const log: MigrationLog = {
      timestamp: new Date().toISOString(),
      operation,
      entity,
      success,
      details,
      error
    };
    
    this.logs.push(log);
    console.log(`[Migration Log] ${log.timestamp} - ${operation} - ${entity}: ${success ? 'SUCCESS' : 'FAILED'}${details ? ' - ' + details : ''}${error ? ' - ERROR: ' + error : ''}`);
    return log;
  }

  private validateData(data: any, entity: string): boolean {
    if (!data) {
      this.logOperation('Validation', entity, false, 'Data is null or undefined');
      return false;
    }
    return true;
  }

  async createAdminUser(): Promise<ExecutionResult> {
    try {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'erisman@admin.com')
        .maybeSingle();

      if (existingUser) {
        this.logOperation('Create', 'AdminUser', true, 'Admin user already exists');
        return { success: true, message: 'Usuário administrador já existe' };
      }

      const result = await authService.signUp({
        email: 'erisman@admin.com',
        password: 'admin',
        full_name: 'Administrador Sistema',
        role: 'admin',
      });

      if (result.error) {
        this.logOperation('Create', 'AdminUser', false, undefined, result.error);
        return { success: false, message: 'Erro ao criar usuário administrador: ' + result.error };
      }

      this.logOperation('Create', 'AdminUser', true, `Admin user created with ID: ${result.user?.id}`);
      return { success: true, message: 'Usuário administrador criado com sucesso' };
    } catch (err: any) {
      this.logOperation('Create', 'AdminUser', false, undefined, err.message);
      return { success: false, message: 'Erro ao criar usuário administrador: ' + err.message };
    }
  }

  async migrateCourses(coursesData: any[]): Promise<MigrationResult> {
    const results: MigrationResult = {
      total: coursesData.length,
      success: 0,
      failed: 0,
      details: []
    };

    for (const course of coursesData) {
      if (!this.validateData(course, 'Course')) {
        results.failed++;
        results.details.push({ id: course.id, status: 'failed', reason: 'Validation failed' });
        continue;
      }

      try {
        const courseData = {
          name: course.name,
          description: course.description || null,
          objectives: course.objectives || null,
          total_hours: course.total_hours || 0,
          prerequisites: course.prerequisites || null,
          is_active: course.is_active !== undefined ? course.is_active : true
        };

        const { data, error } = await coursesService.create(courseData);

        if (error) {
          this.logOperation('Migrate', 'Course', false, `Failed to migrate course: ${course.name}`, error);
          results.failed++;
          results.details.push({ id: course.id, status: 'failed', reason: error });
        } else {
          this.logOperation('Migrate', 'Course', true, `Course migrated: ${course.name} -> ${data.id}`);
          results.success++;
          results.details.push({ id: course.id, newId: data.id, status: 'success' });
        }
      } catch (err: any) {
        this.logOperation('Migrate', 'Course', false, `Failed to migrate course: ${course.name}`, err.message);
        results.failed++;
        results.details.push({ id: course.id, status: 'failed', reason: err.message });
      }
    }

    return results;
  }

  async migrateDisciplines(disciplinesData: any[], courseMappings: Record<string, string>): Promise<MigrationResult> {
    return {
      total: disciplinesData.length,
      success: 0,
      failed: 0,
      details: []
    };
  }

  async migrateClasses(classesData: any[], courseMappings: Record<string, string>): Promise<MigrationResult> {
    const results: MigrationResult = {
      total: classesData.length,
      success: 0,
      failed: 0,
      details: []
    };

    for (const classItem of classesData) {
      if (!this.validateData(classItem, 'Class')) {
        results.failed++;
        results.details.push({ id: classItem.id, status: 'failed', reason: 'Validation failed' });
        continue;
      }

      const newCourseId = courseMappings[classItem.courseId];
      if (!newCourseId) {
        this.logOperation('Migrate', 'Class', false, `No course mapping found for: ${classItem.courseId}`);
        results.failed++;
        results.details.push({ id: classItem.id, status: 'failed', reason: 'Course mapping not found' });
        continue;
      }

      try {
        const classData = {
          name: classItem.name,
          course_id: newCourseId,
          start_date: classItem.startDate,
          end_date: classItem.endDate,
          time_schedule: classItem.timeSchedule,
          location: classItem.location,
          status: classItem.status
        };

        const { data, error } = await classesService.create(classData);

        if (error) {
          this.logOperation('Migrate', 'Class', false, `Failed to migrate class: ${classItem.name}`, error);
          results.failed++;
          results.details.push({ id: classItem.id, status: 'failed', reason: error });
        } else {
          this.logOperation('Migrate', 'Class', true, `Class migrated: ${classItem.name} -> ${data.id}`);
          results.success++;
          results.details.push({ id: classItem.id, newId: data.id, status: 'success' });
        }
      } catch (err: any) {
        this.logOperation('Migrate', 'Class', false, `Failed to migrate class: ${classItem.name}`, err.message);
        results.failed++;
        results.details.push({ id: classItem.id, status: 'failed', reason: err.message });
      }
    }

    return results;
  }

  async executeMigration(data: any) {
    const results = {
      adminUser: await this.createAdminUser(),
      courses: { success: false, message: 'Não executado' },
      disciplines: { success: false, message: 'Não executado' },
      classes: { success: false, message: 'Não executado' },
      students: { success: false, message: 'Não executado' },
      instructors: { success: false, message: 'Não executado' },
      assessments: { success: false, message: 'Não executado' },
    };

    try {
      if (data.courses && data.courses.length > 0) {
        const coursesResult = await this.migrateCourses(data.courses);
        results.courses = {
          success: coursesResult.success === coursesResult.total,
          message: `Migrados ${coursesResult.success} de ${coursesResult.total} cursos`
        };

        const courseMappings: Record<string, string> = {};
        coursesResult.details.forEach(detail => {
          if (detail.status === 'success' && detail.newId) {
            courseMappings[detail.id] = detail.newId;
          }
        });

        if (data.disciplines && data.disciplines.length > 0) {
          const disciplinesResult = await this.migrateDisciplines(data.disciplines, courseMappings);
          results.disciplines = {
            success: disciplinesResult.success === disciplinesResult.total,
            message: `Migradas ${disciplinesResult.success} de ${disciplinesResult.total} disciplinas`
          };
        }

        if (data.classes && data.classes.length > 0) {
          const classesResult = await this.migrateClasses(data.classes, courseMappings);
          results.classes = {
            success: classesResult.success === classesResult.total,
            message: `Migradas ${classesResult.success} de ${classesResult.total} turmas`
          };
        }
      }

      return {
        success: true,
        results
      };
    } catch (err: any) {
      this.logOperation('ExecuteMigration', 'All', false, undefined, err.message);
      return {
        success: false,
        error: err.message,
        results
      };
    }
  }

  getLogs(): MigrationLog[] {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const migrationService = new MigrationService();

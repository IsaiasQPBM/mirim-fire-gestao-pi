import type { MigrationResults, ExecutionResult } from './types';
import { MigrationLogger } from './logger';
import { AdminUserMigration } from './adminUserMigration';
import { CoursesMigration } from './coursesMigration';
import { ClassesMigration } from './classesMigration';
import { DisciplinesMigration } from './disciplinesMigration';

export class MigrationService {
  private logger: MigrationLogger;
  private coursesMigration: CoursesMigration;
  private disciplinesMigration: DisciplinesMigration;
  private classesMigration: ClassesMigration;
  private adminUserMigration: AdminUserMigration;

  constructor() {
    this.logger = new MigrationLogger();
    this.coursesMigration = new CoursesMigration(this.logger);
    this.disciplinesMigration = new DisciplinesMigration(this.logger);
    this.classesMigration = new ClassesMigration(this.logger);
    this.adminUserMigration = new AdminUserMigration(this.logger);
  }

  async createAdminUser() {
    return this.adminUserMigration.createAdminUser();
  }

  async migrateCourses(coursesData: any[]) {
    return this.coursesMigration.migrateCourses(coursesData);
  }

  async migrateDisciplines(disciplinesData: any[], courseMappings: Record<string, string>) {
    return this.disciplinesMigration.migrateDisciplines(disciplinesData, courseMappings);
  }

  async migrateClasses(classesData: any[], courseMappings: Record<string, string>) {
    return this.classesMigration.migrateClasses(classesData, courseMappings);
  }

  async executeMigration(data: any) {
    const results: MigrationResults = {
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
      this.logger.logOperation('ExecuteMigration', 'All', false, undefined, err.message);
      return {
        success: false,
        error: err.message,
        results
      };
    }
  }

  getLogs() {
    return this.logger.getLogs();
  }

  clearLogs() {
    this.logger.clearLogs();
  }

  async runAdminUserMigration(): Promise<ExecutionResult> {
    const startTime = Date.now();
    this.logger.logStart('Admin User Migration');

    try {
      const result = await this.adminUserMigration.createAdminUser();
      
      const duration = Date.now() - startTime;
      
      if (result.success) {
        this.logger.logComplete('Admin User Migration', duration);
        return {
          success: true,
          message: result.message,
          duration,
          operations: this.logger.getOperations()
        };
      } else {
        this.logger.logError('Admin User Migration', result.message);
        return {
          success: false,
          message: result.message,
          duration,
          operations: this.logger.getOperations(),
          error: result.message
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.logError('Admin User Migration', errorMessage);
      
      return {
        success: false,
        message: 'Erro crítico na migração do usuário administrador',
        duration,
        operations: this.logger.getOperations(),
        error: errorMessage
      };
    }
  }

  async diagnoseAdminUser(): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      const result = await this.adminUserMigration.diagnoseAdminUser();
      const duration = Date.now() - startTime;
      
      return {
        success: result.success,
        message: result.message,
        duration,
        operations: this.logger.getOperations()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      return {
        success: false,
        message: 'Erro no diagnóstico: ' + errorMessage,
        duration,
        operations: this.logger.getOperations(),
        error: errorMessage
      };
    }
  }

  async resetAdminPassword(): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      const result = await this.adminUserMigration.resetAdminPassword();
      const duration = Date.now() - startTime;
      
      return {
        success: result.success,
        message: result.message,
        duration,
        operations: this.logger.getOperations()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      return {
        success: false,
        message: 'Erro no reset: ' + errorMessage,
        duration,
        operations: this.logger.getOperations(),
        error: errorMessage
      };
    }
  }
}

export const migrationService = new MigrationService();


import type { MigrationResults } from './types';
import { MigrationLogger } from './logger';
import { AdminUserMigration } from './adminUserMigration';
import { CoursesMigration } from './coursesMigration';
import { ClassesMigration } from './classesMigration';
import { DisciplinesMigration } from './disciplinesMigration';

class MigrationService {
  private logger = new MigrationLogger();
  private adminUserMigration = new AdminUserMigration(this.logger);
  private coursesMigration = new CoursesMigration(this.logger);
  private classesMigration = new ClassesMigration(this.logger);
  private disciplinesMigration = new DisciplinesMigration(this.logger);

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
}

export const migrationService = new MigrationService();

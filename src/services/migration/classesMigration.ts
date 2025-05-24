
import { classesService } from '../classesService';
import type { MigrationResult } from './types';
import type { MigrationLogger } from './logger';

export class ClassesMigration {
  constructor(private logger: MigrationLogger) {}

  private validateData(data: any, entity: string): boolean {
    if (!data) {
      this.logger.logOperation('Validation', entity, false, 'Data is null or undefined');
      return false;
    }
    return true;
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
        results.details.push({ 
          id: classItem.id || 'unknown', 
          status: 'failed', 
          reason: 'Validation failed' 
        });
        continue;
      }

      const newCourseId = courseMappings[classItem.courseId];
      if (!newCourseId) {
        this.logger.logOperation('Migrate', 'Class', false, `No course mapping found for: ${classItem.courseId}`);
        results.failed++;
        results.details.push({ 
          id: classItem.id || 'unknown', 
          status: 'failed', 
          reason: 'Course mapping not found' 
        });
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
          this.logger.logOperation('Migrate', 'Class', false, `Failed to migrate class: ${classItem.name}`, error);
          results.failed++;
          results.details.push({ 
            id: classItem.id || 'unknown', 
            status: 'failed', 
            reason: error 
          });
        } else {
          this.logger.logOperation('Migrate', 'Class', true, `Class migrated: ${classItem.name} -> ${data.id}`);
          results.success++;
          results.details.push({ 
            id: classItem.id || 'unknown', 
            newId: data.id, 
            status: 'success' 
          });
        }
      } catch (err: any) {
        this.logger.logOperation('Migrate', 'Class', false, `Failed to migrate class: ${classItem.name}`, err.message);
        results.failed++;
        results.details.push({ 
          id: classItem.id || 'unknown', 
          status: 'failed', 
          reason: err.message 
        });
      }
    }

    return results;
  }
}

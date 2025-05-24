
import { coursesService } from '../coursesService';
import type { MigrationResult } from './types';
import type { MigrationLogger } from './logger';

export class CoursesMigration {
  constructor(private logger: MigrationLogger) {}

  private validateData(data: any, entity: string): boolean {
    if (!data) {
      this.logger.logOperation('Validation', entity, false, 'Data is null or undefined');
      return false;
    }
    return true;
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
        results.details.push({ 
          id: course.id || 'unknown', 
          status: 'failed', 
          reason: 'Validation failed' 
        });
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
          this.logger.logOperation('Migrate', 'Course', false, `Failed to migrate course: ${course.name}`, error);
          results.failed++;
          results.details.push({ 
            id: course.id || 'unknown', 
            status: 'failed', 
            reason: error 
          });
        } else {
          this.logger.logOperation('Migrate', 'Course', true, `Course migrated: ${course.name} -> ${data.id}`);
          results.success++;
          results.details.push({ 
            id: course.id || 'unknown', 
            newId: data.id, 
            status: 'success' 
          });
        }
      } catch (err: any) {
        this.logger.logOperation('Migrate', 'Course', false, `Failed to migrate course: ${course.name}`, err.message);
        results.failed++;
        results.details.push({ 
          id: course.id || 'unknown', 
          status: 'failed', 
          reason: err.message 
        });
      }
    }

    return results;
  }
}

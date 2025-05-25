
import type { MigrationLog } from './types';

export class MigrationLogger {
  private logs: MigrationLog[] = [];

  logOperation(operation: string, entity: string, success: boolean, details?: string, error?: string): MigrationLog {
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

  logStart(operation: string): void {
    this.logOperation('Start', operation, true, `Starting ${operation}`);
  }

  logComplete(operation: string, duration?: number): void {
    this.logOperation('Complete', operation, true, `Completed in ${duration}ms`);
  }

  logError(operation: string, error: string): void {
    this.logOperation('Error', operation, false, undefined, error);
  }

  getLogs(): MigrationLog[] {
    return this.logs;
  }

  getOperations(): MigrationLog[] {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }
}


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

  getLogs(): MigrationLog[] {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }
}

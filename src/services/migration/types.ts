
export interface MigrationLog {
  timestamp: string;
  operation: string;
  entity: string;
  success: boolean;
  details?: string;
  error?: string;
}

export interface MigrationDetailItem {
  id: string;
  newId?: string;
  status: 'success' | 'failed';
  reason?: string;
}

export interface MigrationResult {
  total: number;
  success: number;
  failed: number;
  details: MigrationDetailItem[];
}

export interface ExecutionResult {
  success: boolean;
  message: string;
  duration?: number;
  operations?: MigrationLog[];
  error?: string;
}

export interface MigrationResults {
  adminUser: ExecutionResult;
  courses: ExecutionResult;
  disciplines: ExecutionResult;
  classes: ExecutionResult;
  students: ExecutionResult;
  instructors: ExecutionResult;
  assessments: ExecutionResult;
}

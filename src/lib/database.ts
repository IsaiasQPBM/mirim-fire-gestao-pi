
import Database from 'better-sqlite3';

// Initialize SQLite database
const db = new Database('database.sqlite');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const createTables = () => {
  // Profiles table (users)
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      role TEXT NOT NULL CHECK (role IN ('admin', 'instructor', 'student')),
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      birth_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Courses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      objectives TEXT,
      total_hours INTEGER DEFAULT 0,
      prerequisites TEXT, -- JSON array as string
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Disciplines table
  db.exec(`
    CREATE TABLE IF NOT EXISTS disciplines (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      theory_hours INTEGER DEFAULT 0,
      practice_hours INTEGER DEFAULT 0,
      workload INTEGER,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id)
    )
  `);

  // Classes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS classes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      course_id TEXT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      time_schedule TEXT NOT NULL,
      location TEXT NOT NULL,
      status TEXT DEFAULT 'upcoming' CHECK (status IN ('active', 'upcoming', 'concluded')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id)
    )
  `);

  // Students table
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      registration_number TEXT NOT NULL UNIQUE,
      birth_date DATE,
      phone TEXT,
      address TEXT, -- JSON as string
      profile_image TEXT,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      enrollment_date DATE DEFAULT CURRENT_DATE,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES profiles(id)
    )
  `);

  // Guardians table
  db.exec(`
    CREATE TABLE IF NOT EXISTS guardians (
      id TEXT PRIMARY KEY,
      student_id TEXT,
      name TEXT NOT NULL,
      relationship TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      is_emergency_contact BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id)
    )
  `);

  // Class students relationship
  db.exec(`
    CREATE TABLE IF NOT EXISTS class_students (
      id TEXT PRIMARY KEY,
      class_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      enrollment_date DATE DEFAULT CURRENT_DATE,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (student_id) REFERENCES students(id)
    )
  `);

  // Class instructors relationship
  db.exec(`
    CREATE TABLE IF NOT EXISTS class_instructors (
      id TEXT PRIMARY KEY,
      class_id TEXT NOT NULL,
      instructor_id TEXT NOT NULL,
      assignment_date DATE DEFAULT CURRENT_DATE,
      is_primary BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (instructor_id) REFERENCES profiles(id)
    )
  `);

  // Class disciplines relationship
  db.exec(`
    CREATE TABLE IF NOT EXISTS class_disciplines (
      id TEXT PRIMARY KEY,
      class_id TEXT NOT NULL,
      discipline_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (discipline_id) REFERENCES disciplines(id)
    )
  `);

  // Lessons table
  db.exec(`
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      class_id TEXT NOT NULL,
      discipline_id TEXT NOT NULL,
      instructor_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      lesson_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      resources TEXT, -- JSON array as string
      content TEXT,
      status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'cancelled')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (discipline_id) REFERENCES disciplines(id),
      FOREIGN KEY (instructor_id) REFERENCES profiles(id)
    )
  `);

  // Calendar events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS calendar_events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      start_date DATETIME NOT NULL,
      end_date DATETIME NOT NULL,
      event_type TEXT NOT NULL CHECK (event_type IN ('lesson', 'exam', 'event')),
      class_id TEXT,
      discipline_id TEXT,
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (discipline_id) REFERENCES disciplines(id),
      FOREIGN KEY (created_by) REFERENCES profiles(id)
    )
  `);

  // Assessments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      class_id TEXT NOT NULL,
      discipline_id TEXT NOT NULL,
      instructor_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      assessment_type TEXT NOT NULL,
      assessment_date DATE NOT NULL,
      total_points DECIMAL(5,2) DEFAULT 100.00,
      status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (discipline_id) REFERENCES disciplines(id),
      FOREIGN KEY (instructor_id) REFERENCES profiles(id)
    )
  `);

  // Assessment results table
  db.exec(`
    CREATE TABLE IF NOT EXISTS assessment_results (
      id TEXT PRIMARY KEY,
      assessment_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      score DECIMAL(5,2) DEFAULT 0.00,
      feedback TEXT,
      submitted_at DATETIME,
      graded_at DATETIME,
      graded_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assessment_id) REFERENCES assessments(id),
      FOREIGN KEY (student_id) REFERENCES profiles(id),
      FOREIGN KEY (graded_by) REFERENCES profiles(id)
    )
  `);

  // Communications table
  db.exec(`
    CREATE TABLE IF NOT EXISTS communications (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      recipient_id TEXT,
      class_id TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      message_type TEXT NOT NULL,
      priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
      is_read BOOLEAN DEFAULT 0,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      read_at DATETIME,
      FOREIGN KEY (sender_id) REFERENCES profiles(id),
      FOREIGN KEY (recipient_id) REFERENCES profiles(id),
      FOREIGN KEY (class_id) REFERENCES classes(id)
    )
  `);

  // Pedagogical observations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pedagogical_observations (
      id TEXT PRIMARY KEY,
      student_id TEXT,
      instructor_id TEXT,
      date DATE DEFAULT CURRENT_DATE,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
      follow_up_required BOOLEAN DEFAULT 0,
      follow_up_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (instructor_id) REFERENCES profiles(id)
    )
  `);

  // Student documents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS student_documents (
      id TEXT PRIMARY KEY,
      student_id TEXT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      file_path TEXT,
      notes TEXT,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id)
    )
  `);

  // CMS Content table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cms_content (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL CHECK (type IN ('text', 'image', 'document', 'menu', 'contact', 'logo')),
      value TEXT NOT NULL,
      label TEXT NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT NOT NULL,
      FOREIGN KEY (updated_by) REFERENCES profiles(id)
    )
  `);

  // CMS Menu Items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cms_menu_items (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT,
      order_index INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      roles TEXT NOT NULL, -- JSON array as string
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('All tables created successfully');
};

// Initialize database
createTables();

export default db;

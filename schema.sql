-- =====================================================
-- SCHEMA COMPLETO DO SISTEMA PELOTÃO MIRIM - CBMEPI
-- =====================================================

-- Criar tabela de perfis (usuários)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  birth_date DATE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'instructor', 'student')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de cursos
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  objectives TEXT,
  total_hours INTEGER DEFAULT 0,
  prerequisites TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de disciplinas
CREATE TABLE IF NOT EXISTS disciplines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  theory_hours INTEGER DEFAULT 0,
  practice_hours INTEGER DEFAULT 0,
  workload INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de turmas
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  time_schedule TEXT,
  location TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de alunos
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  registration_number TEXT UNIQUE NOT NULL,
  birth_date DATE,
  phone TEXT,
  profile_image TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  enrollment_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de relacionamento turma-aluno
CREATE TABLE IF NOT EXISTS class_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'dropped')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

-- Criar tabela de relacionamento turma-instrutor
CREATE TABLE IF NOT EXISTS class_instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  assignment_date DATE DEFAULT CURRENT_DATE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, instructor_id)
);

-- Criar tabela de avaliações
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  discipline_id UUID REFERENCES disciplines(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assessment_date DATE,
  assessment_type TEXT DEFAULT 'written' CHECK (assessment_type IN ('written', 'practical', 'oral')),
  total_points INTEGER DEFAULT 100,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de observações pedagógicas
CREATE TABLE IF NOT EXISTS pedagogical_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  date DATE DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  type TEXT DEFAULT 'behavioral' CHECK (type IN ('behavioral', 'academic', 'attendance', 'health', 'personal')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de comunicação
CREATE TABLE IF NOT EXISTS communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'message' CHECK (message_type IN ('message', 'announcement', 'notification')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL
);

-- Criar tabela de responsáveis
CREATE TABLE IF NOT EXISTS guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  is_emergency_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de documentos do aluno
CREATE TABLE IF NOT EXISTS student_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  file_path TEXT,
  upload_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de aulas
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  discipline_id UUID REFERENCES disciplines(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  lesson_date DATE,
  start_time TIME,
  end_time TIME,
  content TEXT,
  resources TEXT[],
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de eventos do calendário
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type TEXT DEFAULT 'general' CHECK (event_type IN ('general', 'class', 'assessment', 'meeting', 'holiday')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  discipline_id UUID REFERENCES disciplines(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de resultados de avaliação
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OTIMIZAÇÃO
-- =====================================================

-- Índices para perfis
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

-- Índices para alunos
CREATE INDEX IF NOT EXISTS idx_students_registration_number ON students(registration_number);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);

-- Índices para turmas
CREATE INDEX IF NOT EXISTS idx_classes_course_id ON classes(course_id);
CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);

-- Índices para disciplinas
CREATE INDEX IF NOT EXISTS idx_disciplines_course_id ON disciplines(course_id);
CREATE INDEX IF NOT EXISTS idx_disciplines_status ON disciplines(status);

-- Índices para relacionamentos
CREATE INDEX IF NOT EXISTS idx_class_students_class_id ON class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student_id ON class_students(student_id);
CREATE INDEX IF NOT EXISTS idx_class_instructors_class_id ON class_instructors(class_id);
CREATE INDEX IF NOT EXISTS idx_class_instructors_instructor_id ON class_instructors(instructor_id);

-- Índices para avaliações
CREATE INDEX IF NOT EXISTS idx_assessments_discipline_id ON assessments(discipline_id);
CREATE INDEX IF NOT EXISTS idx_assessments_class_id ON assessments(class_id);
CREATE INDEX IF NOT EXISTS idx_assessments_instructor_id ON assessments(instructor_id);

-- Índices para observações
CREATE INDEX IF NOT EXISTS idx_observations_student_id ON pedagogical_observations(student_id);
CREATE INDEX IF NOT EXISTS idx_observations_instructor_id ON pedagogical_observations(instructor_id);
CREATE INDEX IF NOT EXISTS idx_observations_date ON pedagogical_observations(date);

-- Índices para comunicação
CREATE INDEX IF NOT EXISTS idx_communications_sender_id ON communications(sender_id);
CREATE INDEX IF NOT EXISTS idx_communications_recipient_id ON communications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_communications_sent_at ON communications(sent_at);

-- =====================================================
-- FUNÇÕES ÚTEIS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disciplines_updated_at BEFORE UPDATE ON disciplines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_observations_updated_at BEFORE UPDATE ON pedagogical_observations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_results_updated_at BEFORE UPDATE ON assessment_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS INICIAIS (SEEDS)
-- =====================================================

-- Inserir usuários iniciais
INSERT INTO profiles (id, full_name, email, phone, role, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'João Silva', 'joao.silva@cbmepi.gov.br', '(86) 98765-4321', 'admin', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'Maria Oliveira', 'maria.oliveira@cbmepi.gov.br', '(86) 98765-1234', 'instructor', 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'Pedro Santos', 'pedro.santos@cbmepi.gov.br', '(86) 99876-5432', 'instructor', 'active'),
('550e8400-e29b-41d4-a716-446655440004', 'Ana Souza', 'ana.souza@estudante.cbmepi.gov.br', '(86) 98877-6655', 'student', 'active'),
('550e8400-e29b-41d4-a716-446655440005', 'Lucas Pereira', 'lucas.pereira@estudante.cbmepi.gov.br', '(86) 99988-7766', 'student', 'active'),
('550e8400-e29b-41d4-a716-446655440006', 'Juliana Costa', 'juliana.costa@estudante.cbmepi.gov.br', '(86) 98765-9876', 'student', 'inactive')
ON CONFLICT (id) DO NOTHING;

-- Inserir cursos iniciais
INSERT INTO courses (id, name, description, objectives, total_hours, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'Formação Básica de Bombeiro Mirim', 'Curso introdutório aos princípios e práticas do Corpo de Bombeiros para crianças e adolescentes.', 'Formar jovens com princípios de cidadania, noções básicas de prevenção e combate a incêndio, primeiros socorros e educação física.', 120, true),
('550e8400-e29b-41d4-a716-446655440102', 'Prevenção e Combate a Incêndio Mirim', 'Capacitação específica em técnicas de prevenção e combate a princípios de incêndio.', 'Desenvolver habilidades básicas de identificação de riscos e ações iniciais de combate a incêndio.', 80, true),
('550e8400-e29b-41d4-a716-446655440103', 'Primeiros Socorros para Jovens', 'Treinamento em procedimentos básicos de primeiros socorros adaptados para jovens.', 'Capacitar os alunos a reconhecer situações de emergência e realizar os primeiros atendimentos.', 60, true),
('550e8400-e29b-41d4-a716-446655440104', 'Salvamento Aquático Júnior', 'Introdução às técnicas de salvamento aquático e prevenção de afogamentos.', 'Ensinar técnicas básicas de segurança aquática, identificação de riscos e procedimentos de salvamento.', 90, true)
ON CONFLICT (id) DO NOTHING;

-- Inserir disciplinas iniciais
INSERT INTO disciplines (id, course_id, name, description, theory_hours, practice_hours, workload, status) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101', 'Introdução ao CBMEPI', 'História, valores e estrutura do Corpo de Bombeiros Militar do Piauí.', 20, 0, 20, 'active'),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440101', 'Noções de Primeiros Socorros', 'Conceitos básicos e práticas iniciais de primeiros socorros.', 15, 25, 40, 'active'),
('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440101', 'Prevenção de Incêndios', 'Princípios de prevenção e comportamento seguro em relação ao fogo.', 10, 20, 30, 'active'),
('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440101', 'Ordem Unida', 'Disciplina, movimentos básicos de marcha e formação.', 5, 25, 30, 'active'),
('550e8400-e29b-41d4-a716-446655440205', '550e8400-e29b-41d4-a716-446655440102', 'Classes de Incêndio', 'Identificação e classificação de diferentes tipos de incêndio.', 15, 10, 25, 'active'),
('550e8400-e29b-41d4-a716-446655440206', '550e8400-e29b-41d4-a716-446655440102', 'Equipamentos de Combate', 'Conhecimento e manuseio básico de equipamentos de combate a incêndio.', 10, 25, 35, 'active')
ON CONFLICT (id) DO NOTHING;

-- Inserir turmas iniciais
INSERT INTO classes (id, course_id, name, start_date, end_date, time_schedule, location, status) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440101', 'Turma 1 - Formação Básica 2023', '2023-03-01', '2023-08-30', 'Seg, Qua e Sex, 08:00 - 12:00', 'Unidade Central CBMEPI', 'active'),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440102', 'Turma 2 - Prevenção e Combate a Incêndio 2023', '2023-04-15', '2023-08-15', 'Ter e Qui, 14:00 - 18:00', 'Centro de Treinamento Leste', 'active'),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440103', 'Turma 1 - Primeiros Socorros 2023', '2023-05-01', '2023-07-30', 'Sáb, 08:00 - 12:00', 'Unidade Central CBMEPI', 'active')
ON CONFLICT (id) DO NOTHING;

-- Inserir alunos iniciais
INSERT INTO students (id, user_id, registration_number, birth_date, phone, status, enrollment_date, notes) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440004', '2023001', '2005-07-12', '(86) 98877-6655', 'active', '2023-03-01', 'Aluna exemplar, demonstra grande interesse nas atividades.'),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440005', '2023002', '2006-02-28', '(86) 99988-7766', 'active', '2023-03-10', 'Aluno dedicado, precisa melhorar em primeiros socorros.'),
('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440006', '2023003', '2005-11-05', '(86) 98765-9876', 'inactive', '2023-04-01', 'Aluna transferida para outra unidade.')
ON CONFLICT (id) DO NOTHING;

-- Inserir relacionamentos turma-aluno
INSERT INTO class_students (class_id, student_id, enrollment_date, status) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440401', '2023-03-01', 'active'),
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440402', '2023-03-10', 'active'),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440401', '2023-04-15', 'active'),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440403', '2023-04-15', 'inactive')
ON CONFLICT (class_id, student_id) DO NOTHING;

-- Inserir relacionamentos turma-instrutor
INSERT INTO class_instructors (class_id, instructor_id, assignment_date, is_primary) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440002', '2023-02-15', true),
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440003', '2023-02-15', false),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440003', '2023-03-20', true),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440002', '2023-04-25', true)
ON CONFLICT (class_id, instructor_id) DO NOTHING;

-- Inserir responsáveis
INSERT INTO guardians (student_id, name, relationship, phone, email, is_emergency_contact) VALUES
('550e8400-e29b-41d4-a716-446655440401', 'Carlos Souza', 'Pai', '(86) 99999-8888', 'carlos.souza@email.com', true),
('550e8400-e29b-41d4-a716-446655440401', 'Marta Souza', 'Mãe', '(86) 99999-7777', 'marta.souza@email.com', true),
('550e8400-e29b-41d4-a716-446655440402', 'Roberto Pereira', 'Pai', '(86) 99888-7777', 'roberto.pereira@email.com', true),
('550e8400-e29b-41d4-a716-446655440403', 'Fernanda Costa', 'Mãe', '(86) 99777-6666', 'fernanda.costa@email.com', true)
ON CONFLICT DO NOTHING;

-- Inserir documentos
INSERT INTO student_documents (student_id, name, type, upload_date, notes) VALUES
('550e8400-e29b-41d4-a716-446655440401', 'RG', 'identification', '2023-03-01', 'Documento completo'),
('550e8400-e29b-41d4-a716-446655440401', 'Atestado Médico', 'medical', '2023-03-01', 'Apto para atividades físicas'),
('550e8400-e29b-41d4-a716-446655440402', 'RG', 'identification', '2023-03-10', 'Documento completo'),
('550e8400-e29b-41d4-a716-446655440402', 'Atestado Médico', 'medical', '2023-03-10', 'Apto para atividades físicas')
ON CONFLICT DO NOTHING;

-- Inserir observações pedagógicas
INSERT INTO pedagogical_observations (student_id, instructor_id, date, description, type, priority) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440002', '2023-05-10', 'Demonstrou excelente liderança durante o exercício em grupo.', 'behavioral', 'medium'),
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440002', '2023-05-15', 'Dificuldade em compreender conceitos básicos de primeiros socorros.', 'academic', 'high'),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440003', '2023-05-18', 'Problemas de concentração durante as aulas teóricas.', 'behavioral', 'medium')
ON CONFLICT DO NOTHING;

-- Inserir avaliações
INSERT INTO assessments (id, title, description, discipline_id, class_id, instructor_id, assessment_date, assessment_type, total_points, status) VALUES
('550e8400-e29b-41d4-a716-446655440501', 'Avaliação de Técnicas de Resgate', 'Avaliação sobre técnicas básicas de resgate e salvamento.', '550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440002', '2023-04-15', 'written', 100, 'completed'),
('550e8400-e29b-41d4-a716-446655440502', 'Avaliação de Primeiros Socorros', 'Avaliação sobre procedimentos básicos de primeiros socorros.', '550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440002', '2023-04-22', 'practical', 100, 'completed')
ON CONFLICT (id) DO NOTHING;

-- Inserir resultados de avaliação
INSERT INTO assessment_results (assessment_id, student_id, score, feedback, submitted_at, graded_at, graded_by) VALUES
('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440401', 85, 'Bom desempenho geral, precisa melhorar em técnicas de resgate.', '2023-04-15 10:00:00', '2023-04-15 14:00:00', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440402', 65, 'Precisa reforçar conhecimentos básicos.', '2023-04-15 10:00:00', '2023-04-15 14:00:00', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440502', '550e8400-e29b-41d4-a716-446655440401', 70, 'Desempenho satisfatório, porém precisa melhorar em primeiros socorros.', '2023-04-22 10:00:00', '2023-04-22 14:00:00', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440502', '550e8400-e29b-41d4-a716-446655440402', 75, 'Bom progresso, continue praticando.', '2023-04-22 10:00:00', '2023-04-22 14:00:00', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT DO NOTHING;

-- Inserir mensagens
INSERT INTO communications (sender_id, recipient_id, title, content, message_type, priority, sent_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Reunião de coordenação', 'Prezada instrutora, gostaria de agendar uma reunião para discutirmos o desempenho da turma A.', 'message', 'normal', '2023-05-15 14:30:00'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Re: Reunião de coordenação', 'Claro! Estou disponível amanhã às 14h. Podemos nos reunir na sala de instrutores.', 'message', 'normal', '2023-05-15 15:45:00'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'Avaliação de Desempenho', 'Olá Ana, gostaria de informar que sua avaliação de primeiros socorros está agendada para a próxima semana.', 'message', 'normal', '2023-05-16 09:15:00')
ON CONFLICT DO NOTHING;

-- Inserir eventos do calendário
INSERT INTO calendar_events (title, description, start_date, end_date, event_type, created_by, class_id) VALUES
('Avaliação de Técnicas de Resgate', 'Avaliação escrita sobre técnicas básicas de resgate', '2023-04-15 10:00:00', '2023-04-15 12:00:00', 'assessment', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440301'),
('Avaliação de Primeiros Socorros', 'Avaliação prática de primeiros socorros', '2023-04-22 10:00:00', '2023-04-22 12:00:00', 'assessment', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440301'),
('Reunião de Coordenação', 'Reunião mensal de coordenação dos instrutores', '2023-05-20 14:00:00', '2023-05-20 16:00:00', 'meeting', '550e8400-e29b-41d4-a716-446655440001', NULL)
ON CONFLICT DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedagogical_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (você pode ajustar conforme necessário)
-- Por enquanto, permitir acesso total para desenvolvimento
CREATE POLICY "Allow all access for development" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow all access for development" ON courses FOR ALL USING (true);
CREATE POLICY "Allow all access for development" ON disciplines FOR ALL USING (true);
CREATE POLICY "Allow all access for development" ON classes FOR ALL USING (true);
CREATE POLICY "Allow all access for development" ON students FOR ALL USING (true);
CREATE POLICY "Allow all access for development" ON class_students FOR ALL USING (true);
CREATE POLICY "Allow all access for development" ON class_instructors FOR ALL USING (true);
CREATE POLICY "Allow all access for development" ON assessments FOR ALL USING (true);
CREATE POLICY "Allow all access for development" ON pedagogical_observations FOR ALL USING (true);
CREATE POLICY "Allow all access for development" ON communications FOR ALL USING (true);
CREATE POLICY "Allow all access for development" ON guardians FOR ALL USING (true);
CREATE POLICY "Allow all access for development" ON student_documents FOR ALL USING (true);
CREATE POLICY "Allow all access for development" ON lessons FOR ALL USING (true);
CREATE POLICY "Allow all access for development" ON calendar_events FOR ALL USING (true);
CREATE POLICY "Allow all access for development" ON assessment_results FOR ALL USING (true);

-- =====================================================
-- MENSAGEM DE SUCESSO
-- =====================================================

-- Esta query deve retornar o número total de registros inseridos
SELECT 
  'Schema criado com sucesso!' as message,
  (SELECT COUNT(*) FROM profiles) as total_users,
  (SELECT COUNT(*) FROM courses) as total_courses,
  (SELECT COUNT(*) FROM classes) as total_classes,
  (SELECT COUNT(*) FROM students) as total_students; 
-- ===== TABELAS PARA COMPLETAR O MÓDULO DE AVALIAÇÕES =====

-- Tabela de questões
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('multiple_choice', 'essay', 'practical')),
  points INTEGER NOT NULL DEFAULT 1,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  discipline_id UUID NOT NULL REFERENCES disciplines(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de opções para questões de múltipla escolha
CREATE TABLE question_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de questões por avaliação
CREATE TABLE assessment_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assessment_id, question_id)
);

-- Tabela de respostas dos alunos
CREATE TABLE student_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_result_id UUID NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id),
  answer_text TEXT,
  selected_options UUID[] DEFAULT '{}',
  score DECIMAL(5,2),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_questions_discipline_id ON questions(discipline_id);
CREATE INDEX idx_questions_created_by ON questions(created_by);
CREATE INDEX idx_question_options_question_id ON question_options(question_id);
CREATE INDEX idx_assessment_questions_assessment_id ON assessment_questions(assessment_id);
CREATE INDEX idx_assessment_questions_question_id ON assessment_questions(question_id);
CREATE INDEX idx_student_answers_result_id ON student_answers(assessment_result_id);
CREATE INDEX idx_student_answers_question_id ON student_answers(question_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;

-- Políticas para questions
CREATE POLICY "Questions are viewable by authenticated users" ON questions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Questions are insertable by instructors" ON questions
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'instructor'
        )
    );

CREATE POLICY "Questions are updatable by creator" ON questions
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Questions are deletable by creator" ON questions
    FOR DELETE USING (auth.uid() = created_by);

-- Políticas para question_options
CREATE POLICY "Question options are viewable by authenticated users" ON question_options
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Question options are insertable by question creator" ON question_options
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM questions 
            WHERE questions.id = question_id 
            AND questions.created_by = auth.uid()
        )
    );

CREATE POLICY "Question options are updatable by question creator" ON question_options
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM questions 
            WHERE questions.id = question_id 
            AND questions.created_by = auth.uid()
        )
    );

CREATE POLICY "Question options are deletable by question creator" ON question_options
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM questions 
            WHERE questions.id = question_id 
            AND questions.created_by = auth.uid()
        )
    );

-- Políticas para assessment_questions
CREATE POLICY "Assessment questions are viewable by authenticated users" ON assessment_questions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Assessment questions are insertable by assessment creator" ON assessment_questions
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM assessments 
            WHERE assessments.id = assessment_id 
            AND assessments.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Assessment questions are updatable by assessment creator" ON assessment_questions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM assessments 
            WHERE assessments.id = assessment_id 
            AND assessments.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Assessment questions are deletable by assessment creator" ON assessment_questions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM assessments 
            WHERE assessments.id = assessment_id 
            AND assessments.instructor_id = auth.uid()
        )
    );

-- Políticas para student_answers
CREATE POLICY "Student answers are viewable by student and instructor" ON student_answers
    FOR SELECT USING (
        auth.role() = 'authenticated' AND (
            EXISTS (
                SELECT 1 FROM assessment_results 
                WHERE assessment_results.id = assessment_result_id 
                AND assessment_results.student_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM assessment_results ar
                JOIN assessments a ON ar.assessment_id = a.id
                WHERE ar.id = assessment_result_id 
                AND a.instructor_id = auth.uid()
            )
        )
    );

CREATE POLICY "Student answers are insertable by student" ON student_answers
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM assessment_results 
            WHERE assessment_results.id = assessment_result_id 
            AND assessment_results.student_id = auth.uid()
        )
    );

CREATE POLICY "Student answers are updatable by instructor" ON student_answers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM assessment_results ar
            JOIN assessments a ON ar.assessment_id = a.id
            WHERE ar.id = assessment_result_id 
            AND a.instructor_id = auth.uid()
        )
    ); 
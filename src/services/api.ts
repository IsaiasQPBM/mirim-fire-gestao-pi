import { supabase, TableRow, TableInsert, TableUpdate } from '@/lib/supabase'

// ===== SERVIÇOS DE USUÁRIOS =====
export const userService = {
  // Buscar todos os usuários
  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar usuário por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar usuário
  async create(user: TableInsert<'profiles'>) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(user)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar usuário
  async update(id: string, updates: TableUpdate<'profiles'>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar usuário
  async delete(id: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// ===== SERVIÇOS DE ALUNOS =====
export const studentService = {
  // Buscar todos os alunos
  async getAll() {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        profiles!students_user_id_fkey(*),
        guardians(*),
        student_documents(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar aluno por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        profiles!students_user_id_fkey(*),
        guardians(*),
        student_documents(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar aluno
  async create(student: TableInsert<'students'>) {
    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar aluno
  async update(id: string, updates: TableUpdate<'students'>) {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar alunos por turma
  async getByClass(classId: string) {
    const { data, error } = await supabase
      .from('class_students')
      .select(`
        *,
        students!class_students_student_id_fkey(
          *,
          profiles!students_user_id_fkey(*)
        )
      `)
      .eq('class_id', classId)
    
    if (error) throw error
    return data
  }
}

// ===== SERVIÇOS DE CURSOS =====
export const courseService = {
  // Buscar todos os cursos
  async getAll() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar curso por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        disciplines(*),
        classes(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar curso
  async create(course: TableInsert<'courses'>) {
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar curso
  async update(id: string, updates: TableUpdate<'courses'>) {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// ===== SERVIÇOS DE DISCIPLINAS =====
export const disciplineService = {
  // Buscar todas as disciplinas
  async getAll() {
    const { data, error } = await supabase
      .from('disciplines')
      .select(`
        *,
        courses(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar disciplina por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('disciplines')
      .select(`
        *,
        courses(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar disciplina
  async create(discipline: TableInsert<'disciplines'>) {
    const { data, error } = await supabase
      .from('disciplines')
      .insert(discipline)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar disciplina
  async update(id: string, updates: TableUpdate<'disciplines'>) {
    const { data, error } = await supabase
      .from('disciplines')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// ===== SERVIÇOS DE TURMAS =====
export const classService = {
  // Buscar todas as turmas
  async getAll() {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        courses(*),
        class_students(
          *,
          students!class_students_student_id_fkey(
            *,
            profiles!students_user_id_fkey(*)
          )
        ),
        class_instructors(
          *,
          profiles!class_instructors_instructor_id_fkey(*)
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar turma por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        courses(*),
        class_students(
          *,
          students!class_students_student_id_fkey(
            *,
            profiles!students_user_id_fkey(*)
          )
        ),
        class_instructors(
          *,
          profiles!class_instructors_instructor_id_fkey(*)
        ),
        lessons(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar turma
  async create(classData: TableInsert<'classes'>) {
    const { data, error } = await supabase
      .from('classes')
      .insert(classData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar turma
  async update(id: string, updates: TableUpdate<'classes'>) {
    const { data, error } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// ===== SERVIÇOS DE AVALIAÇÕES =====
export const assessmentService = {
  // Buscar todas as avaliações
  async getAll() {
    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        disciplines(*),
        classes(*),
        profiles!assessments_instructor_id_fkey(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar avaliação por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        disciplines(*),
        classes(*),
        profiles!assessments_instructor_id_fkey(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar avaliações por disciplina
  async getByDiscipline(disciplineId: string) {
    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        disciplines(*),
        classes(*),
        profiles!assessments_instructor_id_fkey(*)
      `)
      .eq('discipline_id', disciplineId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar avaliações por turma
  async getByClass(classId: string) {
    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        disciplines(*),
        classes(*),
        profiles!assessments_instructor_id_fkey(*)
      `)
      .eq('class_id', classId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Criar avaliação
  async create(assessment: TableInsert<'assessments'>) {
    const { data, error } = await supabase
      .from('assessments')
      .insert(assessment)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar avaliação
  async update(id: string, updates: TableUpdate<'assessments'>) {
    const { data, error } = await supabase
      .from('assessments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar avaliação
  async delete(id: string) {
    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async getAllResults() {
    const { data, error } = await supabase.from('assessment_results').select('*');
    if (error) throw error;
    return data;
  },
  async getResultsByStudent(studentId: string) {
    const { data, error } = await supabase.from('assessment_results').select('*').eq('student_id', studentId);
    if (error) throw error;
    return data;
  }
}

// ===== SERVIÇOS DE OBSERVAÇÕES PEDAGÓGICAS =====
export const observationService = {
  // Buscar todas as observações
  async getAll() {
    const { data, error } = await supabase
      .from('pedagogical_observations')
      .select(`
        *,
        students!pedagogical_observations_student_id_fkey(
          *,
          profiles!students_user_id_fkey(*)
        ),
        profiles!pedagogical_observations_instructor_id_fkey(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar observações por aluno
  async getByStudent(studentId: string) {
    const { data, error } = await supabase
      .from('pedagogical_observations')
      .select(`
        *,
        profiles!pedagogical_observations_instructor_id_fkey(*)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Criar observação
  async create(observation: TableInsert<'pedagogical_observations'>) {
    const { data, error } = await supabase
      .from('pedagogical_observations')
      .insert(observation)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// ===== SERVIÇOS DE COMUNICAÇÃO =====
export const communicationService = {
  // Buscar mensagens do usuário
  async getMessages(userId: string) {
    const { data, error } = await supabase
      .from('communications')
      .select(`
        *,
        profiles!communications_sender_id_fkey(*),
        profiles!communications_recipient_id_fkey(*)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('sent_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Enviar mensagem
  async sendMessage(message: TableInsert<'communications'>) {
    const { data, error } = await supabase
      .from('communications')
      .insert(message)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Marcar como lida
  async markAsRead(id: string) {
    const { data, error } = await supabase
      .from('communications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// ===== SERVIÇOS DE QUESTÕES =====
export const questionService = {
  // Buscar todas as questões
  async getAll() {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        disciplines(*),
        profiles!questions_created_by_fkey(*),
        question_options(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar questão por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        disciplines(*),
        profiles!questions_created_by_fkey(*),
        question_options(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar questões por disciplina
  async getByDiscipline(disciplineId: string) {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        disciplines(*),
        profiles!questions_created_by_fkey(*),
        question_options(*)
      `)
      .eq('discipline_id', disciplineId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Criar questão
  async create(question: TableInsert<'questions'>) {
    const { data, error } = await supabase
      .from('questions')
      .insert(question)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar questão
  async update(id: string, updates: TableUpdate<'questions'>) {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar questão
  async delete(id: string) {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// ===== SERVIÇOS DE OPÇÕES DE QUESTÕES =====
export const questionOptionService = {
  // Buscar opções por questão
  async getByQuestion(questionId: string) {
    const { data, error } = await supabase
      .from('question_options')
      .select('*')
      .eq('question_id', questionId)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Criar opção
  async create(option: TableInsert<'question_options'>) {
    const { data, error } = await supabase
      .from('question_options')
      .insert(option)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Criar múltiplas opções
  async createMany(options: TableInsert<'question_options'>[]) {
    const { data, error } = await supabase
      .from('question_options')
      .insert(options)
      .select()
    
    if (error) throw error
    return data
  },

  // Atualizar opção
  async update(id: string, updates: TableUpdate<'question_options'>) {
    const { data, error } = await supabase
      .from('question_options')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar opção
  async delete(id: string) {
    const { error } = await supabase
      .from('question_options')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Deletar todas as opções de uma questão
  async deleteByQuestion(questionId: string) {
    const { error } = await supabase
      .from('question_options')
      .delete()
      .eq('question_id', questionId)
    
    if (error) throw error
  }
}

// ===== SERVIÇOS DE QUESTÕES POR AVALIAÇÃO =====
export const assessmentQuestionService = {
  // Buscar questões de uma avaliação
  async getByAssessment(assessmentId: string) {
    const { data, error } = await supabase
      .from('assessment_questions')
      .select(`
        *,
        questions(
          *,
          question_options(*)
        )
      `)
      .eq('assessment_id', assessmentId)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Adicionar questão à avaliação
  async addQuestion(assessmentQuestion: TableInsert<'assessment_questions'>) {
    const { data, error } = await supabase
      .from('assessment_questions')
      .insert(assessmentQuestion)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Adicionar múltiplas questões à avaliação
  async addQuestions(assessmentQuestions: TableInsert<'assessment_questions'>[]) {
    const { data, error } = await supabase
      .from('assessment_questions')
      .insert(assessmentQuestions)
      .select()
    
    if (error) throw error
    return data
  },

  // Remover questão da avaliação
  async removeQuestion(assessmentId: string, questionId: string) {
    const { error } = await supabase
      .from('assessment_questions')
      .delete()
      .eq('assessment_id', assessmentId)
      .eq('question_id', questionId)
    
    if (error) throw error
  },

  // Atualizar ordem das questões
  async updateOrder(assessmentId: string, questionId: string, orderIndex: number) {
    const { data, error } = await supabase
      .from('assessment_questions')
      .update({ order_index: orderIndex })
      .eq('assessment_id', assessmentId)
      .eq('question_id', questionId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// ===== SERVIÇOS DE RESPOSTAS DOS ALUNOS =====
export const studentAnswerService = {
  // Buscar respostas de um resultado de avaliação
  async getByAssessmentResult(resultId: string) {
    const { data, error } = await supabase
      .from('student_answers')
      .select(`
        *,
        questions(*)
      `)
      .eq('assessment_result_id', resultId)
    
    if (error) throw error
    return data
  },

  // Criar resposta
  async create(answer: TableInsert<'student_answers'>) {
    const { data, error } = await supabase
      .from('student_answers')
      .insert(answer)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Criar múltiplas respostas
  async createMany(answers: TableInsert<'student_answers'>[]) {
    const { data, error } = await supabase
      .from('student_answers')
      .insert(answers)
      .select()
    
    if (error) throw error
    return data
  },

  // Atualizar resposta (para correção)
  async update(id: string, updates: TableUpdate<'student_answers'>) {
    const { data, error } = await supabase
      .from('student_answers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// ===== SERVIÇOS DE CMS =====
export const cmsService = {
  // Buscar todo o conteúdo CMS
  async getAllContent() {
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .order('content_key', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar conteúdo por chave
  async getContentByKey(key: string) {
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('content_key', key)
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar conteúdo por tipo
  async getContentByType(type: string) {
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('content_type', type)
      .order('content_key', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Criar conteúdo
  async createContent(content: TableInsert<'cms_content'>) {
    const { data, error } = await supabase
      .from('cms_content')
      .insert(content)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar conteúdo
  async updateContent(id: string, updates: TableUpdate<'cms_content'>) {
    const { data, error } = await supabase
      .from('cms_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar conteúdo por chave
  async updateContentByKey(key: string, value: string, updatedBy?: string) {
    const { data, error } = await supabase
      .from('cms_content')
      .update({ 
        content_value: value, 
        updated_at: new Date().toISOString(),
        updated_by: updatedBy 
      })
      .eq('content_key', key)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar conteúdo
  async deleteContent(id: string) {
    const { error } = await supabase
      .from('cms_content')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// ===== SERVIÇOS DE CONFIGURAÇÕES DO SISTEMA =====
export const systemSettingsService = {
  // Buscar todas as configurações
  async getAll() {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('setting_key', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar configurações por categoria
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('category', category)
      .order('setting_key', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar configuração por chave
  async getByKey(key: string) {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('setting_key', key)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar configuração
  async create(setting: TableInsert<'system_settings'>) {
    const { data, error } = await supabase
      .from('system_settings')
      .insert(setting)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar configuração
  async update(id: string, updates: TableUpdate<'system_settings'>) {
    const { data, error } = await supabase
      .from('system_settings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar configuração por chave
  async updateByKey(key: string, value: string, updatedBy?: string) {
    const { data, error } = await supabase
      .from('system_settings')
      .update({ 
        setting_value: value, 
        updated_at: new Date().toISOString(),
        updated_by: updatedBy 
      })
      .eq('setting_key', key)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// ===== SERVIÇOS DE CONFIGURAÇÕES DE APARÊNCIA =====
export const appearanceSettingsService = {
  // Buscar todas as configurações de aparência
  async getAll() {
    const { data, error } = await supabase
      .from('appearance_settings')
      .select('*')
      .order('setting_key', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar configurações por categoria
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('appearance_settings')
      .select('*')
      .eq('category', category)
      .order('setting_key', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar configuração por chave
  async getByKey(key: string) {
    const { data, error } = await supabase
      .from('appearance_settings')
      .select('*')
      .eq('setting_key', key)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar configuração
  async create(setting: TableInsert<'appearance_settings'>) {
    const { data, error } = await supabase
      .from('appearance_settings')
      .insert(setting)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar configuração
  async update(id: string, updates: TableUpdate<'appearance_settings'>) {
    const { data, error } = await supabase
      .from('appearance_settings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar configuração por chave
  async updateByKey(key: string, value: string, updatedBy?: string) {
    const { data, error } = await supabase
      .from('appearance_settings')
      .update({ 
        setting_value: value, 
        updated_at: new Date().toISOString(),
        updated_by: updatedBy 
      })
      .eq('setting_key', key)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// ===== SERVIÇOS DE CONFIGURAÇÕES DE USUÁRIO =====
export const userSettingsService = {
  // Buscar configurações do usuário
  async getUserSettings(userId: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .order('setting_key', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar configuração específica do usuário
  async getUserSetting(userId: string, key: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .eq('setting_key', key)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar configuração do usuário
  async create(setting: TableInsert<'user_settings'>) {
    const { data, error } = await supabase
      .from('user_settings')
      .insert(setting)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar configuração do usuário
  async update(id: string, updates: TableUpdate<'user_settings'>) {
    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar configuração do usuário por chave
  async updateByKey(userId: string, key: string, value: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .update({ 
        setting_value: value, 
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('setting_key', key)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar configuração do usuário
  async delete(id: string) {
    const { error } = await supabase
      .from('user_settings')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// ===== SERVIÇOS DE MENUS =====
export const menuService = {
  // Buscar todos os menus
  async getAll() {
    const { data, error } = await supabase
      .from('cms_menus')
      .select(`
        *,
        cms_menu_items(*)
      `)
      .order('name', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar menu por localização
  async getByLocation(location: string) {
    const { data, error } = await supabase
      .from('cms_menus')
      .select(`
        *,
        cms_menu_items(*)
      `)
      .eq('location', location)
      .eq('is_active', true)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar menu
  async create(menu: TableInsert<'cms_menus'>) {
    const { data, error } = await supabase
      .from('cms_menus')
      .insert(menu)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar menu
  async update(id: string, updates: TableUpdate<'cms_menus'>) {
    const { data, error } = await supabase
      .from('cms_menus')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar menu
  async delete(id: string) {
    const { error } = await supabase
      .from('cms_menus')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// ===== SERVIÇOS DE ITENS DE MENU =====
export const menuItemService = {
  // Buscar itens de menu
  async getByMenu(menuId: string) {
    const { data, error } = await supabase
      .from('cms_menu_items')
      .select('*')
      .eq('menu_id', menuId)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Criar item de menu
  async create(item: TableInsert<'cms_menu_items'>) {
    const { data, error } = await supabase
      .from('cms_menu_items')
      .insert(item)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar item de menu
  async update(id: string, updates: TableUpdate<'cms_menu_items'>) {
    const { data, error } = await supabase
      .from('cms_menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar item de menu
  async delete(id: string) {
    const { error } = await supabase
      .from('cms_menu_items')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// ===== SERVIÇOS DE CONTATOS =====
export const contactService = {
  // Buscar todos os contatos
  async getAll() {
    const { data, error } = await supabase
      .from('cms_contacts')
      .select('*')
      .order('contact_type', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar contatos por tipo
  async getByType(type: string) {
    const { data, error } = await supabase
      .from('cms_contacts')
      .select('*')
      .eq('contact_type', type)
      .eq('is_primary', true)
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar contato principal por tipo
  async getPrimaryByType(type: string) {
    const { data, error } = await supabase
      .from('cms_contacts')
      .select('*')
      .eq('contact_type', type)
      .eq('is_primary', true)
      .eq('is_active', true)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar contato
  async create(contact: TableInsert<'cms_contacts'>) {
    const { data, error } = await supabase
      .from('cms_contacts')
      .insert(contact)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar contato
  async update(id: string, updates: TableUpdate<'cms_contacts'>) {
    const { data, error } = await supabase
      .from('cms_contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar contato
  async delete(id: string) {
    const { error } = await supabase
      .from('cms_contacts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// ===== SERVIÇOS DE DASHBOARD =====
export const dashboardService = {
  // Buscar estatísticas gerais do dashboard
  async getDashboardStats() {
    try {
      // Buscar dados em paralelo
      const [studentsData, classesData, coursesData, assessmentsData, observationsData] = await Promise.all([
        supabase.from('students').select('*'),
        supabase.from('classes').select('*'),
        supabase.from('courses').select('*'),
        supabase.from('assessments').select('*'),
        supabase.from('pedagogical_observations').select('*')
      ]);

      // Contar registros
      const totalStudents = studentsData.data?.length || 0;
      const totalClasses = classesData.data?.length || 0;
      const totalCourses = coursesData.data?.length || 0;
      const totalAssessments = assessmentsData.data?.length || 0;
      const totalObservations = observationsData.data?.length || 0;

      // Calcular alunos ativos (últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentStudents = studentsData.data?.filter(student => 
        new Date(student.created_at) >= thirtyDaysAgo
      ).length || 0;

      // Calcular turmas ativas
      const activeClasses = classesData.data?.filter(cls => 
        cls.is_active === true
      ).length || 0;

      // Calcular avaliações pendentes (criadas mas não aplicadas)
      const pendingAssessments = assessmentsData.data?.filter(assessment => 
        assessment.status === 'draft' || assessment.status === 'scheduled'
      ).length || 0;

      return {
        totalStudents,
        totalClasses,
        totalCourses,
        totalAssessments,
        totalObservations,
        recentStudents,
        activeClasses,
        pendingAssessments
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      throw error;
    }
  },

  // Buscar dados para gráficos
  async getChartData() {
    try {
      // Dados de matrículas por mês (últimos 6 meses)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const { data: studentsData } = await supabase
        .from('students')
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString());

      // Agrupar por mês
      const enrollmentByMonth = studentsData?.reduce((acc, student) => {
        const month = new Date(student.created_at).toLocaleDateString('pt-BR', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Dados de distribuição por curso
      const { data: courseStudents } = await supabase
        .from('students')
        .select('id, course_id');

      const courseDistribution = courseStudents?.reduce((acc, student) => {
        if (student.course_id) {
          acc[student.course_id] = (acc[student.course_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      // TODO: Integrar frequência e desempenho com Supabase
      // Por enquanto, retorna arrays vazios
      const attendanceData = [];
      const performanceData = [];

      return {
        enrollmentByMonth,
        courseDistribution,
        attendanceData,
        performanceData
      };
    } catch (error) {
      console.error('Erro ao buscar dados dos gráficos:', error);
      throw error;
    }
  }
}

// ===== SERVIÇO DE CALENDÁRIO =====
export const calendarService = {
  async getAll() {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_date', { ascending: true });
    if (error) throw error;
    return data;
  }
};

// ===== SERVIÇOS DE AULAS =====
export const lessonService = {
  // Buscar todas as aulas
  async getAll() {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('lessonDate', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Buscar aula por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // Criar aula
  async create(lesson: any) {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lesson)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Atualizar aula
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Deletar aula
  async delete(id: string) {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  userService, 
  studentService, 
  courseService, 
  classService, 
  assessmentService, 
  observationService,
  communicationService 
} from '@/services/api'

// ===== HOOKS PARA USUÁRIOS =====
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      userService.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', data.id] })
    },
  })
}

// ===== HOOKS PARA ALUNOS =====
export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAll,
  })
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => studentService.getById(id),
    enabled: !!id,
  })
}

export function useStudentsByClass(classId: string) {
  return useQuery({
    queryKey: ['students', 'class', classId],
    queryFn: () => studentService.getByClass(classId),
    enabled: !!classId,
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: studentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      studentService.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['students', data.id] })
    },
  })
}

// ===== HOOKS PARA CURSOS =====
export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getAll,
  })
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => courseService.getById(id),
    enabled: !!id,
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: courseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}

// ===== HOOKS PARA TURMAS =====
export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: classService.getAll,
  })
}

export function useClass(id: string) {
  return useQuery({
    queryKey: ['classes', id],
    queryFn: () => classService.getById(id),
    enabled: !!id,
  })
}

// ===== HOOKS PARA AVALIAÇÕES =====
export function useAssessments() {
  return useQuery({
    queryKey: ['assessments'],
    queryFn: assessmentService.getAll,
  })
}

export function useAssessment(id: string) {
  return useQuery({
    queryKey: ['assessments', id],
    queryFn: () => assessmentService.getById(id),
    enabled: !!id,
  })
}

export function useCreateAssessment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: assessmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] })
    },
  })
}

// ===== HOOKS PARA OBSERVAÇÕES =====
export function useObservations() {
  return useQuery({
    queryKey: ['observations'],
    queryFn: observationService.getAll,
  })
}

export function useObservationsByStudent(studentId: string) {
  return useQuery({
    queryKey: ['observations', 'student', studentId],
    queryFn: () => observationService.getByStudent(studentId),
    enabled: !!studentId,
  })
}

export function useCreateObservation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: observationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations'] })
    },
  })
}

// ===== HOOKS PARA COMUNICAÇÃO =====
export function useMessages(userId: string) {
  return useQuery({
    queryKey: ['messages', userId],
    queryFn: () => communicationService.getMessages(userId),
    enabled: !!userId,
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: communicationService.sendMessage,
    onSuccess: (data) => {
      // Invalidar mensagens do remetente e destinatário
      queryClient.invalidateQueries({ queryKey: ['messages', data.sender_id] })
      if (data.recipient_id) {
        queryClient.invalidateQueries({ queryKey: ['messages', data.recipient_id] })
      }
    },
  })
}

export function useMarkMessageAsRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: communicationService.markAsRead,
    onSuccess: (data) => {
      // Invalidar mensagens do usuário que marcou como lida
      queryClient.invalidateQueries({ queryKey: ['messages', data.recipient_id] })
    },
  })
} 
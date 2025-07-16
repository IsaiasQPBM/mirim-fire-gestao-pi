
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, 
  Filter, 
  Search, 
  GraduationCap,
  SlidersHorizontal,
  Badge,
  UserCheck,
  UserX,
  User
} from 'lucide-react';
import { Course } from '@/data/curriculumTypes';
import { classService } from '@/services/api';
import StudentCard from '@/components/students/StudentCard';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/students/Pagination';
import { useToast } from '@/hooks/use-toast';
import { studentService } from '@/services/api';
import { supabase } from '@/lib/supabase';

const ITEMS_PER_PAGE = 9;

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'registration' | 'status' | 'date'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentClasses, setStudentClasses] = useState<Record<string, string[]>>({});
  const [availableClasses, setAvailableClasses] = useState<{id: string, name: string}[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const userRole = localStorage.getItem('userRole') as 'admin' | 'instructor' | 'student' || 'student';
  const userName = localStorage.getItem('userName') || '';

  // Check access permission
  const canAccessStudents = () => {
    return ['admin', 'instructor'].includes(userRole);
  };

  // Helper function to get student display name
  const getStudentName = (student: any) => {
    if (student.profiles?.full_name) {
      return student.profiles.full_name;
    }
    if (student.full_name) {
      return student.full_name;
    }
    return student.fullName || 'Nome não informado';
  };

  // Helper function to get student registration number
  const getStudentRegistration = (student: any) => {
    return student.registration_number || student.registrationNumber || 'N/A';
  };

  // Helper function to get student status
  const getStudentStatus = (student: any) => {
    return student.status || 'active';
  };

  // Helper function to get student enrollment date
  const getStudentEnrollmentDate = (student: any) => {
    return student.enrollment_date || student.enrollmentDate || student.created_at || new Date().toISOString();
  };

  useEffect(() => {
    if (!canAccessStudents()) return;
    setLoading(true);
    setError(null);
    Promise.all([
      studentService.getAll(),
      classService.getAll()
    ])
      .then(([studentsData, classesData]) => {
        setStudents(studentsData || []);
        setFilteredStudents(studentsData || []);
        setClasses(classesData || []);
      })
      .catch(err => {
        console.error('Erro ao carregar alunos ou turmas:', err);
        setError('Erro ao carregar alunos ou turmas: ' + (err.message || err));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!canAccessStudents()) return;
    
    // Apply filters and sorting
    let result = [...students];
    
    // Apply search
    if (searchQuery) {
      result = result.filter(student => {
        const name = getStudentName(student);
        const registration = getStudentRegistration(student);
        const email = student.profiles?.email || student.email || '';
        
        return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
               email.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    // Apply class filter
    if (classFilter !== 'all') {
      result = result.filter(student => {
        const studentClassIds = Object.keys(studentClasses).includes(student.id) 
          ? studentClasses[student.id].map(className => 
              availableClasses.find(c => c.name === className)?.id
            ).filter(Boolean)
          : [];
        return studentClassIds.includes(classFilter);
      });
    }
    
    // Apply course filter
    if (courseFilter !== 'all') {
      result = result.filter(student => {
        const studentClassIds = Object.keys(studentClasses).includes(student.id) 
          ? studentClasses[student.id].map(className => 
              availableClasses.find(c => c.name === className)?.id
            ).filter(Boolean)
          : [];
        // Buscar cursos das turmas do aluno (se houver relação turma-curso)
        // Por enquanto, retorna true para não filtrar
        return true;
      });
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(student => getStudentStatus(student) === statusFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let compareResult = 0;
      
      switch(sortBy) {
        case 'name':
          const nameA = getStudentName(a);
          const nameB = getStudentName(b);
          compareResult = nameA.localeCompare(nameB);
          break;
        case 'registration':
          const regA = getStudentRegistration(a);
          const regB = getStudentRegistration(b);
          compareResult = regA.localeCompare(regB);
          break;
        case 'status':
          const statusA = getStudentStatus(a);
          const statusB = getStudentStatus(b);
          compareResult = statusA.localeCompare(statusB);
          break;
        case 'date':
          const dateA = new Date(getStudentEnrollmentDate(a)).getTime();
          const dateB = new Date(getStudentEnrollmentDate(b)).getTime();
          compareResult = dateA - dateB;
          break;
        default:
          compareResult = 0;
      }
      
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
    
    setFilteredStudents(result);
  }, [students, searchQuery, classFilter, courseFilter, statusFilter, sortBy, sortDirection]);

  useEffect(() => {
    const fetchData = async () => {
      // Busca todas as turmas disponíveis
      const { data: classes, error: classesError } = await supabase
        .from('classes')
        .select('id, name')
        .order('name');
      if (!classesError && classes) {
        setAvailableClasses(classes);
      }

      // Busca todas as relações aluno-turma
      const { data: relations, error: relationsError } = await supabase
        .from('class_students')
        .select('student_id, class_id, classes(name)');
      if (!relationsError && relations) {
        const map: Record<string, string[]> = {};
        relations.forEach(rel => {
          if (!map[rel.student_id]) map[rel.student_id] = [];
          if (rel.classes && rel.classes.name) map[rel.student_id].push(rel.classes.name);
        });
        setStudentClasses(map);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  const handleClassFilter = (value: string) => {
    setClassFilter(value);
    setCurrentPage(1);
  };
  
  const handleCourseFilter = (value: string) => {
    setCourseFilter(value);
    setCurrentPage(1);
  };
  
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value as 'active' | 'inactive' | 'pending' | 'all');
    setCurrentPage(1);
  };
  
  const handleSort = (key: 'name' | 'registration' | 'status' | 'date') => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleAddStudent = () => {
    navigate('/students/new');
  };

  const handleViewStudent = (studentId: string) => {
    navigate(`/students/${studentId}`);
  };

  const handleEditStudent = (studentId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/students/${studentId}/edit`);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  if (!canAccessStudents()) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto text-center py-12">
            <h3 className="text-lg font-medium text-red-600">Acesso Negado</h3>
            <p className="mt-1 text-sm text-gray-500">Você não tem permissão para acessar esta página.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto text-center py-12">
            <h3 className="text-lg font-medium text-red-600">Erro ao carregar alunos</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-200 ease-in-out"
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Alunos</h1>
                <p className="text-base text-gray-500 mt-1">Gerencie todos os alunos do sistema</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input
                  type="text"
                  placeholder="Pesquisar alunos..."
                  className="pl-10 w-full sm:w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <Button 
                onClick={handleAddStudent}
                className="bg-orange-500 text-white font-semibold rounded-lg px-4 py-2 hover:bg-orange-600 transition-all duration-200 ease-in-out"
              >
                <UserPlus className="mr-2" size={16} />
                Novo Aluno
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center bg-white rounded-lg shadow-sm p-4 mb-6">
            <Select value={classFilter} onValueChange={handleClassFilter}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-lg border border-gray-300 px-4 py-2 text-sm">
                <SelectValue placeholder="Filtrar por turma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as turmas</SelectItem>
                {availableClasses.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={courseFilter} onValueChange={handleCourseFilter}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-lg border border-gray-300 px-4 py-2 text-sm">
                <SelectValue placeholder="Filtrar por curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cursos</SelectItem>
                {/* Add course options here */}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-lg border border-gray-300 px-4 py-2 text-sm">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-100">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Ordenar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSort('name')}>
                  Por Nome {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('registration')}>
                  Por Matrícula {sortBy === 'registration' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('status')}>
                  Por Status {sortBy === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('date')}>
                  Por Data {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Students Grid */}
          {currentStudents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm p-5 border border-gray-200">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-800">Nenhum aluno encontrado</h3>
              <p className="mt-1 text-sm text-gray-600">
                {searchQuery ? `Não foram encontrados alunos com "${searchQuery}".` : 'Não há alunos cadastrados no sistema.'}
              </p>
              <div className="mt-6">
                <Button 
                  onClick={handleAddStudent}
                  className="bg-orange-500 text-white font-semibold rounded-lg px-4 py-2 hover:bg-orange-600 transition-all duration-200 ease-in-out"
                >
                  <UserPlus className="mr-2" size={16} />
                  Cadastrar Primeiro Aluno
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {currentStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onView={() => handleViewStudent(student.id)}
                    onEdit={(e) => handleEditStudent(student.id, e)}
                  />
                ))}
              </div>
              
              {Math.ceil(filteredStudents.length / ITEMS_PER_PAGE) > 1 && (
                <Pagination
                  currentPage={currentPage}
                  pageCount={Math.ceil(filteredStudents.length / ITEMS_PER_PAGE)}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsList;

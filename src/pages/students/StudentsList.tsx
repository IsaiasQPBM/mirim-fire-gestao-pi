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
  SlidersHorizontal
} from 'lucide-react';
import { Student, mockStudents, StudentStatus } from '@/data/studentTypes';
import { mockClasses } from '@/data/mockCurriculumData';
import { Course } from '@/data/curriculumTypes';
import StudentCard from '@/components/students/StudentCard';
import Header from '@/components/Header';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/students/Pagination';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 9;

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'registration' | 'status' | 'date'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const userRole = localStorage.getItem('userRole') as 'admin' | 'instructor' | 'student' || 'student';
  const userName = localStorage.getItem('userName') || '';

  // Check access permission
  const canAccessStudents = () => {
    return ['admin', 'instructor'].includes(userRole);
  };

  useEffect(() => {
    if (!canAccessStudents()) return;
    
    // Apply filters and sorting
    let result = [...students];
    
    // Apply search
    if (searchQuery) {
      result = result.filter(student => 
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply class filter
    if (classFilter !== 'all') {
      result = result.filter(student => student.classIds.includes(classFilter));
    }
    
    // Apply course filter
    if (courseFilter !== 'all') {
      result = result.filter(student => student.courseIds.includes(courseFilter));
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(student => student.status === statusFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let compareResult = 0;
      
      switch(sortBy) {
        case 'name':
          compareResult = a.fullName.localeCompare(b.fullName);
          break;
        case 'registration':
          compareResult = a.registrationNumber.localeCompare(b.registrationNumber);
          break;
        case 'status':
          compareResult = a.status.localeCompare(b.status);
          break;
        case 'date':
          compareResult = new Date(a.enrollmentDate).getTime() - new Date(b.enrollmentDate).getTime();
          break;
        default:
          compareResult = 0;
      }
      
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
    
    setFilteredStudents(result);
  }, [students, searchQuery, classFilter, courseFilter, statusFilter, sortBy, sortDirection]);

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
    setStatusFilter(value as StudentStatus | 'all');
    setCurrentPage(1);
  };
  
  const handleSort = (key: 'name' | 'registration' | 'status' | 'date') => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };
  
  const handleAddStudent = () => {
    // Navigate to the student registration page
    navigate('/students/new');
  };

  // Pagination
  const pageCount = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  // Get available classes and courses for filtering
  const availableClasses = mockClasses;
  const availableCourses: Course[] = [
    { id: '1', name: 'Formação Básica de Bombeiro Mirim', description: '', objectives: '', totalHours: 200, prerequisites: [], isActive: true, createdAt: '', updatedAt: '' },
    { id: '2', name: 'Técnicas Avançadas de Resgate', description: '', objectives: '', totalHours: 120, prerequisites: [], isActive: true, createdAt: '', updatedAt: '' },
  ];

  if (!canAccessStudents()) {
    return (
      <div className="p-6">
        <Header />
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-red-600">Acesso Restrito</h2>
          <p className="mt-2">Você não tem permissão para acessar esta página.</p>
          <Button 
            className="mt-4 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            onClick={() => navigate('/dashboard')}
          >
            Voltar para Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 mt-6">
        <div className="flex items-center gap-2">
          <GraduationCap size={20} className="text-cbmepi-orange" />
          <h2 className="text-lg font-semibold">Alunos</h2>
        </div>
        
        <Button 
          className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 w-full md:w-auto"
          onClick={handleAddStudent}
        >
          <UserPlus size={18} className="mr-2" />
          Novo Aluno
        </Button>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative flex-1 w-full md:w-auto">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Buscar alunos por nome, matrícula..." 
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 w-full" 
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal size={16} />
                Ordenar por
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort('name')}>
                Nome {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('registration')}>
                Matrícula {sortBy === 'registration' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('status')}>
                Status {sortBy === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('date')}>
                Data de Matrícula {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtros:</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={classFilter} onValueChange={handleClassFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por turma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as turmas</SelectItem>
              {availableClasses.map(cls => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={courseFilter} onValueChange={handleCourseFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cursos</SelectItem>
              {availableCourses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
              <SelectItem value="on_leave">Em licença</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Students List */}
      {paginatedStudents.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">Nenhum aluno encontrado com os filtros aplicados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {paginatedStudents.map(student => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {filteredStudents.length > ITEMS_PER_PAGE && (
        <Pagination 
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default StudentsList;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Calendar as CalendarIcon, Users, Clock, Download, TrendingUp, Loader2 } from 'lucide-react';
import { classService, studentService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';
import { supabase } from '@/lib/supabase';

type Class = Database['public']['Tables']['classes']['Row'];

type Student = Database['public']['Tables']['students']['Row'] & {
  profiles: {
    full_name: string;
  } | null;
};

const AttendanceReport: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [studentClasses, setStudentClasses] = useState<Record<string, string[]>>({});
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/login');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);

    // Load data
    loadReportData();
  }, [navigate]);

  useEffect(() => {
    const fetchStudentClasses = async () => {
      // Busca todas as relações aluno-turma
      const { data: relations, error } = await supabase
        .from('class_students')
        .select('student_id, class_id, classes(name)');
      if (!error && relations) {
        const map: Record<string, string[]> = {};
        relations.forEach(rel => {
          if (!map[rel.student_id]) map[rel.student_id] = [];
          if (rel.classes && rel.classes.name) map[rel.student_id].push(rel.classes.name);
        });
        setStudentClasses(map);
      }
    };
    fetchStudentClasses();
  }, []);

  const loadAttendanceRecords = async () => {
    const { data, error } = await supabase
      .from('attendance')
      .select('id, student_id, class_id, date, status');
    if (!error && data) setAttendanceRecords(data);
  };

  useEffect(() => {
    loadAttendanceRecords();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load classes and students in parallel
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);

      setClasses(classesData || []);
      setStudents(studentsData || []);
    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error);
      setError('Erro ao carregar dados do relatório. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do relatório.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    console.log('Generating attendance report PDF...');
    toast({
      title: "Relatório gerado",
      description: "O relatório de frequência foi preparado para impressão.",
    });
  };

  // Calculate attendance statistics
  const calculateAttendanceStats = () => {
    // TODO: Integrar cálculo real de frequência a partir dos dados do banco
    return {
      totalStudents: students.length,
      presentToday: 0,
      weeklyAverage: 0,
      attendanceRate: 0
    };
  };

  const stats = calculateAttendanceStats();

  // Agrupar frequência por turma
  const attendanceData = classes.map(classItem => {
    const records = attendanceRecords.filter(r => r.class_id === classItem.id);
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    return {
      class: classItem.name,
      present,
      absent,
      total: present + absent
    };
  });

  // Frequência individual dos alunos
  const studentAttendance = students.map(student => {
    const records = attendanceRecords.filter(r => r.student_id === student.id);
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const percentage = records.length > 0 ? Math.round((present / records.length) * 100) : 0;
    return {
      name: student.profiles?.full_name || 'Nome não disponível',
      class: studentClasses[student.id]?.join(', ') || 'Turma não definida',
      present,
      absent,
      percentage
    };
  });

  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (!userRole) return null;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
            <span className="ml-2 text-gray-600">Carregando dados do relatório...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadReportData} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <CalendarIcon className="h-6 w-6 text-cbmepi-red" />
                <h1 className="text-2xl font-bold text-cbmepi-black">Relatório de Frequência</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Turmas</SelectItem>
                    {classes.map(classItem => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button onClick={generatePDF} className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                      <p className="text-2xl font-bold">{stats.totalStudents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Presentes Hoje</p>
                      <p className="text-2xl font-bold">{stats.presentToday}</p>
                      <Badge className="bg-green-100 text-green-800">{stats.attendanceRate}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Média Semanal</p>
                      <p className="text-2xl font-bold">{stats.weeklyAverage}%</p>
                      <Badge className="bg-orange-100 text-orange-800">+2.1%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CalendarIcon className="h-8 w-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Data do Relatório</p>
                      <p className="text-2xl font-bold">
                        {selectedDate.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Attendance by Class */}
              <Card>
                <CardHeader>
                  <CardTitle>Frequência por Turma</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="class" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="present" fill="#10b981" name="Presentes" />
                        <Bar dataKey="absent" fill="#ef4444" name="Ausentes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Attendance Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Tendência Semanal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[80, 100]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="attendance" 
                          stroke="#FF6B35" 
                          strokeWidth={3}
                          name="Frequência (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Student Attendance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Frequência Individual dos Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aluno
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Turma
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Presentes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ausentes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Frequência
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentAttendance.map((student, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.class}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                            {student.present}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                            {student.absent}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.percentage}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getAttendanceBadge(student.percentage)}>
                              {student.percentage >= 90 ? 'Excelente' : 
                               student.percentage >= 80 ? 'Bom' : 'Atenção'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;

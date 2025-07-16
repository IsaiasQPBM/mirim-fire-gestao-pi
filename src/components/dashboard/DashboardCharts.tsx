
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { dashboardService } from '@/services/api';
import { Loader2 } from 'lucide-react';

interface DashboardChartsProps {
  userRole?: string;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ userRole }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    enrollmentByMonth: {},
    courseDistribution: {},
    attendanceData: [],
    performanceData: []
  });

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getChartData();
      setChartData(data);
    } catch (error) {
      console.error('Erro ao carregar dados dos gráficos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Converter dados de matrículas para formato do gráfico
  const studentEnrollmentData = Object.entries(chartData.enrollmentByMonth).map(([month, students]) => ({
    month,
    students
  }));

  // Converter dados de distribuição por curso para formato do gráfico
  const courseDistributionData = Object.entries(chartData.courseDistribution).map(([courseId, value], index) => {
    const colors = ['#f97316', '#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];
    return {
      name: `Curso ${courseId}`,
      value,
      color: colors[index % colors.length]
    };
  });

  const attendanceData = chartData.attendanceData;
  const performanceData = chartData.performanceData;

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold text-gray-800 leading-tight">Carregando dados...</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole === 'admin') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Enrollment Trend */}
        <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold text-gray-800 leading-tight">Evolução de Matrículas</CardTitle>
            <CardDescription className="text-base text-gray-500">Número de novos alunos por mês</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64">
              {studentEnrollmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={studentEnrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area type="monotone" dataKey="students" stroke="#f97316" fill="#f97316" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>Nenhum dado de matrícula disponível</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Course Distribution */}
        <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold text-gray-800 leading-tight">Distribuição por Curso</CardTitle>
            <CardDescription className="text-base text-gray-500">Alunos matriculados em cada curso</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64">
              {courseDistributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={courseDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {courseDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>Nenhum dado de curso disponível</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold text-gray-800 leading-tight">Taxa de Frequência</CardTitle>
            <CardDescription className="text-base text-gray-500">Frequência semanal dos alunos (%)</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64">
              {attendanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" stroke="#6b7280" />
                    <YAxis domain={[80, 100]} stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line type="monotone" dataKey="attendance" stroke="#22c55e" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>Nenhum dado de frequência disponível</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance by Discipline */}
        <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold text-gray-800 leading-tight">Desempenho por Disciplina</CardTitle>
            <CardDescription className="text-base text-gray-500">Nota média por disciplina</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64">
              {performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="discipline" stroke="#6b7280" />
                    <YAxis domain={[0, 10]} stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="average" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>Nenhum dado de desempenho disponível</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole === 'instructor') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Attendance */}
        <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold text-gray-800 leading-tight">Frequência da Turma</CardTitle>
            <CardDescription className="text-base text-gray-500">Frequência semanal dos alunos (%)</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64">
              {attendanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" stroke="#6b7280" />
                    <YAxis domain={[80, 100]} stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line type="monotone" dataKey="attendance" stroke="#22c55e" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>Nenhum dado de frequência disponível</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Student Performance */}
        <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold text-gray-800 leading-tight">Desempenho dos Alunos</CardTitle>
            <CardDescription className="text-base text-gray-500">Nota média por disciplina</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64">
              {performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="discipline" stroke="#6b7280" />
                    <YAxis domain={[0, 10]} stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="average" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>Nenhum dado de desempenho disponível</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default view for students or other roles
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-2xl font-bold text-gray-800 leading-tight">Meu Progresso</CardTitle>
          <CardDescription className="text-base text-gray-500">Acompanhe seu desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>Dados de progresso em desenvolvimento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

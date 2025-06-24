
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

// Mock data for charts
const studentEnrollmentData = [
  { month: 'Jan', students: 15 },
  { month: 'Fev', students: 22 },
  { month: 'Mar', students: 18 },
  { month: 'Abr', students: 28 },
  { month: 'Mai', students: 32 },
  { month: 'Jun', students: 25 },
];

const courseDistributionData = [
  { name: 'Bombeiro Mirim Básico', value: 45, color: '#FF6B35' },
  { name: 'Primeiros Socorros', value: 30, color: '#004D7A' },
  { name: 'Prevenção de Incêndios', value: 35, color: '#8600b3' },
  { name: 'Salvamento Aquático', value: 20, color: '#00A86B' },
];

const attendanceData = [
  { week: 'Sem 1', attendance: 92 },
  { week: 'Sem 2', attendance: 88 },
  { week: 'Sem 3', attendance: 95 },
  { week: 'Sem 4', attendance: 89 },
  { week: 'Sem 5', attendance: 94 },
  { week: 'Sem 6', attendance: 91 },
];

const performanceData = [
  { discipline: 'Primeiros Socorros', average: 8.5 },
  { discipline: 'Combate a Incêndio', average: 7.8 },
  { discipline: 'Prevenção', average: 9.2 },
  { discipline: 'Resgate', average: 8.1 },
  { discipline: 'Salvamento', average: 7.9 },
];

interface DashboardChartsProps {
  userRole: string;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ userRole }) => {
  if (userRole === 'admin') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Enrollment Trend */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Evolução de Matrículas</CardTitle>
            <CardDescription>Número de novos alunos por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studentEnrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="students" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Course Distribution */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Distribuição por Curso</CardTitle>
            <CardDescription>Alunos matriculados em cada curso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Taxa de Frequência</CardTitle>
            <CardDescription>Frequência semanal dos alunos (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#004D7A" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance by Discipline */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Desempenho por Disciplina</CardTitle>
            <CardDescription>Nota média por disciplina</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="discipline" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="average" fill="#00A86B" />
                </BarChart>
              </ResponsiveContainer>
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
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Frequência das Turmas</CardTitle>
            <CardDescription>Taxa de presença nas suas aulas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="#FF6B35" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Student Performance */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Desempenho dos Alunos</CardTitle>
            <CardDescription>Notas médias por disciplina que você leciona</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData.slice(0, 3)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="discipline" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="average" stroke="#004D7A" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Student role
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Seu Progresso Acadêmico</CardTitle>
          <CardDescription>Suas notas por disciplina</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="discipline" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="average" fill="#00A86B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

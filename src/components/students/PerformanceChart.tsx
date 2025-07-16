
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { mockStudentPerformance } from '@/data/pedagogicalTypes';

interface PerformanceChartProps {
  studentId: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ studentId }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // Filter performance data for this student
    // TODO: Integrar com Supabase
    const studentPerformance = [];
    
    if (studentPerformance.length === 0) {
      setChartData([]);
      return;
    }
    
    // Sort by date
    const sortedData = [...studentPerformance].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Transform for chart
    const formattedData = sortedData.map(item => {
      // Get only the discipline name for a shorter label
      const disciplineName = item.disciplineId === '1' 
        ? 'Técnicas de Resgate' 
        : item.disciplineId === '2' 
        ? 'Primeiros Socorros' 
        : `Disciplina ${item.disciplineId}`;
      
      // Format date to DD/MM/YYYY
      const dateParts = item.date.split('-');
      const formattedDate = `${dateParts[2]}/${dateParts[1]}`;
      
      return {
        name: `${formattedDate} - ${disciplineName}`,
        score: item.score,
        average: 70, // Mock average for comparison
        date: item.date
      };
    });
    
    setChartData(formattedData);
  }, [studentId]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-cbmepi-orange">
            Nota: {payload[0].value}
          </p>
          <p className="text-gray-600">
            Média da Turma: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Não há dados de desempenho para exibir.</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end"
            height={80} 
            tick={{ fontSize: 12 }} 
          />
          <YAxis domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#ea384c" 
            strokeWidth={2} 
            activeDot={{ r: 8 }} 
            name="Nota"
          />
          <Line 
            type="monotone" 
            dataKey="average" 
            stroke="#94a3b8" 
            strokeDasharray="5 5" 
            strokeWidth={2} 
            name="Média da Turma"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;


import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getAttendanceByStudentId } from '@/data/studentTypes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AttendanceChartProps {
  studentId: string;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ studentId }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [attendanceRate, setAttendanceRate] = useState<number>(0);
  
  useEffect(() => {
    const attendanceRecords = getAttendanceByStudentId(studentId);
    
    if (attendanceRecords.length === 0) {
      setChartData([
        { name: 'Sem dados', value: 1 }
      ]);
      return;
    }
    
    const counts = {
      present: 0,
      absent: 0,
      late: 0,
      justified: 0
    };
    
    attendanceRecords.forEach(record => {
      counts[record.status] += 1;
    });
    
    const total = attendanceRecords.length;
    const presentCount = counts.present + counts.late;
    const attendancePercentage = Math.round((presentCount / total) * 100);
    
    setAttendanceRate(attendancePercentage);
    
    const data = [
      { name: 'Presente', value: counts.present, color: '#4ade80' },
      { name: 'Atrasado', value: counts.late, color: '#facc15' },
      { name: 'Ausente', value: counts.absent, color: '#ef4444' },
      { name: 'Justificado', value: counts.justified, color: '#60a5fa' }
    ].filter(item => item.value > 0);
    
    setChartData(data);
  }, [studentId]);
  
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-gray-600">
            {`Quantidade: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {chartData.length === 1 && chartData[0].name === 'Sem dados' ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Não há dados de frequência para exibir.</p>
            </div>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {attendanceRate > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">Taxa de frequência</p>
          <p className="text-2xl font-bold">{attendanceRate}%</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceChart;

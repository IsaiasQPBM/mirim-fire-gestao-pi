
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  gradient = false 
}) => {
  return (
    <Card className={`transition-all duration-300 hover:shadow-lg hover:scale-105 ${
      gradient 
        ? 'bg-gradient-to-br from-[#F5A623]/10 to-[#E8941A]/10 border-[#F5A623]/30' 
        : 'bg-white border-gray-200'
    }`}>
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-2">
          <div className="p-3 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E8941A] text-white">
            <Icon size={24} />
          </div>
        </div>
        <CardTitle className="text-lg font-bold text-cbmepi-black">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default InfoCard;

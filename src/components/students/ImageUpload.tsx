
import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload as UploadIcon, 
  X, 
  RefreshCw,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleFiles = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative">
      {value ? (
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img 
              src={value} 
              alt="Profile preview" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full h-8 w-8 p-0 bg-white border border-gray-300"
                    onClick={handleClick}
                  >
                    <RefreshCw size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Trocar imagem</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full h-8 w-8 p-0 bg-white border border-gray-300"
                    onClick={handleRemove}
                  >
                    <X size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Remover imagem</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ) : (
        <div 
          className={`
            w-32 h-32 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer
            transition-all duration-200
            ${dragActive ? 'border-cbmepi-orange bg-orange-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <User size={32} className="text-gray-400 mb-2" />
          <span className="text-xs text-gray-500 text-center">
            Clique ou arraste<br />para adicionar foto
          </span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;

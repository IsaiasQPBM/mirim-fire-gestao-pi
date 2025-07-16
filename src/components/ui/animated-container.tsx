
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'zoom' | 'bounce';
  delay?: 'none' | 'short' | 'medium' | 'long';
  duration?: 'fast' | 'normal' | 'slow';
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animation = 'fadeIn',
  delay = 'none',
  duration = 'normal',
  className,
  ...props
}) => {
  const getAnimationClass = () => {
    switch (animation) {
      case 'fadeIn':
        return 'animate-fade-in';
      case 'slideUp':
        return 'animate-slide-up';
      case 'slideLeft':
        return 'animate-slide-left';
      case 'slideRight':
        return 'animate-slide-right';
      case 'zoom':
        return 'animate-zoom';
      case 'bounce':
        return 'animate-bounce';
      default:
        return 'animate-fade-in';
    }
  };

  const getDelayClass = () => {
    switch (delay) {
      case 'short':
        return 'animation-delay-100';
      case 'medium':
        return 'animation-delay-300';
      case 'long':
        return 'animation-delay-500';
      default:
        return '';
    }
  };

  const getDurationClass = () => {
    switch (duration) {
      case 'fast':
        return 'animation-duration-300';
      case 'slow':
        return 'animation-duration-1000';
      default:
        return 'animation-duration-500';
    }
  };

  return (
    <div
      className={cn(
        getAnimationClass(),
        getDelayClass(),
        getDurationClass(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { AnimatedContainer };

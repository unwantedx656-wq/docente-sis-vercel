import React from 'react';
import { cn } from './Button';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'outline';
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className, variant = 'glass', title }) => {
  const variants = {
    glass: 'glass-card',
    solid: 'bg-primary-900 border border-primary-800',
    outline: 'border border-primary-800 bg-transparent'
  };

  return (
    <div className={cn(
      'rounded-2xl p-6 overflow-hidden transition-all duration-300',
      variants[variant],
      className
    )}>
      {title && (
        <div className="mb-6 pb-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;

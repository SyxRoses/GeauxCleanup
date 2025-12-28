import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:transform hover:-translate-y-0.5 active:translate-y-0";

  const variants = {
    primary: "bg-brand-navy text-white hover:bg-opacity-90 border border-transparent shadow-lg shadow-brand-navy/30",
    secondary: "bg-brand-gold text-brand-navy hover:bg-brand-gold/90 border border-transparent shadow-md",
    outline: "bg-transparent text-brand-navy border-2 border-brand-navy/10 hover:border-brand-navy hover:bg-brand-navy/5",
    ghost: "bg-transparent text-brand-slate hover:bg-brand-navy/5 hover:text-brand-navy"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-4 text-base"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
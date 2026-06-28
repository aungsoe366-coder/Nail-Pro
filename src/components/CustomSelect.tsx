import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SelectOption {
  value: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  renderValue?: (option: SelectOption | undefined) => React.ReactNode;
  id?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className,
  buttonClassName,
  dropdownClassName,
  disabled = false,
  icon,
  renderValue,
  id
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const internalId = useId();
  const selectId = id || internalId;

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-4 py-3 bg-input border border-border rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed",
          isOpen && "border-primary/50 ring-2 ring-primary/20",
          buttonClassName
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {icon && <span className="text-muted-foreground flex-shrink-0">{icon}</span>}
          <span className={cn("truncate font-bold", !selectedOption && "text-muted-foreground font-normal")}>
            {selectedOption 
              ? (renderValue ? renderValue(selectedOption) : selectedOption.label) 
              : placeholder}
          </span>
        </div>
        <ChevronDown 
          className={cn("text-muted-foreground flex-shrink-0 transition-transform duration-200", isOpen && "rotate-180")} 
          size={16} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, scale: 0.96, filter: 'blur(4px)' }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute z-[999] w-full min-w-[200px] mt-2 bg-card border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl py-2 overflow-hidden",
              dropdownClassName
            )}
            style={{ maxHeight: '300px', overflowY: 'auto' }}
          >
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center font-medium">No options</div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-all duration-200 group relative overflow-hidden",
                    value === option.value ? "bg-primary/10 text-primary font-black" : "text-foreground font-bold hover:bg-muted/80"
                  )}
                >
                  <div className="flex items-center gap-3 truncate relative z-10">
                    {option.icon && <span className={cn(
                      "transition-colors duration-200",
                      value === option.value ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}>{option.icon}</span>}
                    <span className="truncate tracking-tight">{option.label}</span>
                  </div>
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Check size={16} className="text-primary flex-shrink-0 relative z-10" strokeWidth={3} />
                    </motion.div>
                  )}
                  {value === option.value && (
                    <motion.div 
                      layoutId={`active-select-bg-${selectId}`}
                      className="absolute inset-0 bg-primary/5 -z-0"
                    />
                  )}
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

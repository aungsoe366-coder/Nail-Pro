import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}> = ({ isOpen, onClose, title, children, maxWidth = "max-w-sm" }) => {
  if (!isOpen) return null;
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 z-[70000] flex items-center justify-center p-4 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeInOut" }}
      style={{ willChange: "transform, opacity" }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={cn("bg-card border border-border w-full rounded-2xl border-primary/30 flex flex-col relative max-h-[calc(100dvh-140px)] overflow-hidden", maxWidth)}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
        <div className="flex justify-between items-center shrink-0 p-4 pb-4">
          <h3 className="text-primary [.midnight_&]:text-amber-400 font-bold text-xl uppercase tracking-widest">{title}</h3>
          <motion.button whileTap={{ scale: 0.97 }} onClick={onClose} className="p-3 hover:bg-muted/10 rounded-2xl transition-all text-muted-foreground hover:text-foreground active:scale-90"><X size={24} /></motion.button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pt-4 space-y-4">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

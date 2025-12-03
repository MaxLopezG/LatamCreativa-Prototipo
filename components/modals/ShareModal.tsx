
import React, { useState } from 'react';
import { X, Copy, Check, Facebook, Twitter, Linkedin, Mail, Link as LinkIcon } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialOptions = [
    { name: 'WhatsApp', color: 'bg-[#25D366]', icon: <div className="font-bold text-lg select-none">Wa</div> },
    { name: 'Twitter', color: 'bg-black', icon: <Twitter className="h-5 w-5" /> },
    { name: 'Facebook', color: 'bg-[#1877F2]', icon: <Facebook className="h-5 w-5" /> },
    { name: 'LinkedIn', color: 'bg-[#0A66C2]', icon: <Linkedin className="h-5 w-5" /> },
    { name: 'Email', color: 'bg-slate-500', icon: <Mail className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100">
        
        <div className="p-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Compartir</h3>
            <button 
                onClick={onClose} 
                className="p-1.5 bg-slate-100 dark:bg-white/10 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
                <X className="h-5 w-5" />
            </button>
        </div>

        <div className="p-6">
            {/* Social Grid */}
            <div className="grid grid-cols-5 gap-4 mb-8">
                {socialOptions.map((option) => (
                    <button 
                        key={option.name}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 ${option.color}`}>
                            {option.icon}
                        </div>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{option.name}</span>
                    </button>
                ))}
            </div>

            {/* Copy Link Section */}
            <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-2 pl-4 flex items-center justify-between border border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-3 overflow-hidden">
                    <LinkIcon className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-300 truncate">{currentUrl}</span>
                </div>
                <button 
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                        copied 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20'
                    }`}
                >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copiado' : 'Copiar'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

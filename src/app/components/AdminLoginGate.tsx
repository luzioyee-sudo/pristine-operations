// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { KeyRound, Eye, EyeOff, ShieldAlert, ChevronLeft, ShieldCheck, Lock } from 'lucide-react';

interface AdminLoginGateProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulate verification
    setTimeout(() => {
      if (password === 'admin123' || password === 'admin') {
        onSuccess();
      } else {
        setError('Invalid administrative passcode. Please check your credentials and try again.');
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#F6F5F2] dark:bg-[#0D0F0B] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-sm sm:max-w-md bg-white dark:bg-[#151813] border border-[#D0E4FE] dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden my-auto"
      >
        {/* Sleek top ambient light */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-[#334DAF] to-amber-600" />

        {/* Back Button */}
        <button
          onClick={onCancel}
          className="absolute top-5 start-5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer p-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Exit Gate</span>
        </button>

        {/* Icon Header */}
        <div className="mt-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center border border-amber-200/50 dark:border-amber-900/40 text-[#334DAF] dark:text-amber-400 mb-4 sm:mb-5 shadow-2xs">
            <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#091F5C] dark:text-stone-50 tracking-tight">
            Administrative Portal
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 max-w-xs leading-relaxed">
            Unrestricted administrative console access requires secure high-level credentials.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">
              Executive Passcode
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 start-0 ps-3.5 flex items-center text-stone-400 dark:text-stone-500 pointer-events-none">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter admin passcode"
                required
                autoFocus
                className="w-full ps-10 pe-11 py-3.5 rounded-2xl border border-[#D0E4FE] dark:border-stone-800 bg-[#E8F2FE] dark:bg-stone-900 text-sm text-[#091F5C] dark:text-stone-100 focus:outline-none focus:border-[#334DAF] focus:ring-2 focus:ring-[#334DAF]/30 transition-all min-h-[48px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer p-1"
                title={showPassword ? "Hide passcode" : "Show passcode"}
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs font-medium leading-relaxed flex gap-2.5 items-start"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 sm:py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-[#091F5C] rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-stone-800 dark:hover:bg-white/90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 min-h-[48px]"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white dark:border-stone-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Authenticate Session'
            )}
          </button>
        </form>

        {/* Security Tip */}
        <div className="mt-6 sm:mt-8 pt-5 border-t border-[#D0E4FE]/60 dark:border-stone-800/60 flex flex-col items-center text-center gap-1.5">
          <div className="flex items-center gap-1 text-[11px] text-stone-400 dark:text-stone-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Default Admin Passcode:</span>
            <span className="text-[#334DAF] dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md font-mono">admin123</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

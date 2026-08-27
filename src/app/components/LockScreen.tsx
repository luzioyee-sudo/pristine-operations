// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, KeyRound, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, HelpCircle, X, Sparkles } from 'lucide-react';
import { getEffectiveAvatar } from '../utils/defaultAvatars';

interface LockScreenProps {
  correctPassword?: string;
  onUnlock: () => void;
  userName?: string;
  userAvatar?: string;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  correctPassword = '',
  onUnlock,
  userName = 'User',
  userAvatar = '',
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) {
      setErrorMsg('Please enter your passcode.');
      return;
    }

    if (passwordInput === correctPassword) {
      setErrorMsg('');
      onUnlock();
    } else {
      setErrorMsg('Incorrect passcode. Please try again.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121310] text-stone-100 flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-y-auto min-h-[100dvh]">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 start-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-[#334DAF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 start-10 w-60 sm:w-72 h-60 sm:h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-sm sm:max-w-md bg-[#1D201A] border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-5 sm:space-y-6 text-center my-auto ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* User Avatar / Lock Icon Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-stone-900 border-2 border-[#334DAF] text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-lg overflow-hidden">
              <img 
                src={getEffectiveAvatar(userAvatar, userName)} 
                alt={userName} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute -bottom-1 -end-1 p-1.5 sm:p-2 rounded-full bg-[#334DAF] text-white shadow-md border-2 border-[#1D201A]">
              <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-serif-classic font-bold text-stone-100">
              Welcome Back, {userName}
            </h1>
            <p className="text-stone-400 text-xs mt-1">
              Protected with a secure passcode lock.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="relative">
            <KeyRound className="w-4 h-4 absolute start-4 top-4 text-stone-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Enter Access Passcode"
              autoFocus
              className="w-full ps-11 pe-11 py-3.5 rounded-2xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#334DAF] focus:border-transparent transition-all min-h-[48px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3.5 top-3.5 p-1 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-bold pt-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#334DAF] hover:bg-[#091F5C] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.98] min-h-[48px]"
          >
            <span>Unlock Ribble</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-stone-800/80 text-[11px] text-stone-500 flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">Encrypted Passcode Lock</span>
          </div>
          <button
            type="button"
            onClick={() => setShowHintModal(true)}
            className="text-stone-400 hover:text-amber-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Need Help?</span>
          </button>
        </div>
      </motion.div>

      {/* Forgot Passcode / Reset Hint Modal */}
      <AnimatePresence>
        {showHintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#1D201A] border border-stone-800 rounded-3xl p-6 text-stone-200 shadow-2xl relative space-y-4"
            >
              <button
                onClick={() => setShowHintModal(false)}
                className="absolute top-4 end-4 text-stone-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2.5 text-amber-400">
                <Sparkles className="w-5 h-5 shrink-0" />
                <h3 className="font-serif-classic font-bold text-lg text-white">Passcode Help</h3>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                If you forgot your application passcode, you can reset or manage it directly from the <strong className="text-amber-300">Admin Portal (#admin-dashboard)</strong> using executive credentials, or update it in Settings after signing in.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setShowHintModal(false)}
                  className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

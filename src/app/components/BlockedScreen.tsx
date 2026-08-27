// @ts-nocheck
import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, LogOut } from 'lucide-react';
import { signOutFromSupabase } from '../lib/supabase';

interface BlockedScreenProps {
  userEmail: string;
}

export const BlockedScreen: React.FC<BlockedScreenProps> = ({ userEmail }) => {
  const handleLogout = async () => {
    try {
      await signOutFromSupabase();
    } catch (err) {
      console.error("Failed to sign out of Supabase:", err);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FDFBF7] dark:bg-[#151813] p-6 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-[#FDE3D9]/30 dark:bg-[#34241B]/20 blur-3xl rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white dark:bg-[#1D201A] border border-stone-200 dark:border-stone-800 rounded-2xl p-8 shadow-sm text-center relative z-10"
      >
        <div className="w-12 h-12 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h1 className="text-xl font-serif text-stone-900 dark:text-white mb-2">
          Access Suspended
        </h1>
        
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 max-w-sm mx-auto leading-relaxed">
          The administrator has suspended access for <span className="font-bold text-stone-700 dark:text-stone-300">{userEmail}</span>. Please contact support or your system administrator to resolve this issue.
        </p>

        <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out & Switch Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

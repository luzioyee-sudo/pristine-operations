// @ts-nocheck
import React from 'react';
import { motion } from 'motion/react';
import { QuizHistory } from '../types';
import { getTranslation } from '../utils/i18n';
import { Calendar, Trophy, Clock, CheckCircle2, ChevronRight, History, BarChart3 } from 'lucide-react';

interface QuizHistoryViewProps {
  history: QuizHistory[];
  settings: any;
  onSelectQuiz?: (quizId: string) => void;
}

export const QuizHistoryView: React.FC<QuizHistoryViewProps> = ({ history, settings, onSelectQuiz }) => {
  const t = getTranslation(settings?.interfaceLanguage || 'English');

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/50 rounded-3xl border border-dashed border-[#D0D2CF]">
        <div className="w-16 h-16 bg-[#D0D2CF]/20 rounded-2xl flex items-center justify-center mb-4">
          <History className="w-8 h-8 text-[#222222]/30" />
        </div>
        <h3 className="text-xl font-black text-[#222222] mb-2">No history yet</h3>
        <p className="text-[#666666] font-medium max-w-xs">
          Your examination results will appear here once you complete your first quiz.
        </p>
      </div>
    );
  }

  const averageScore = Math.round(history.reduce((acc, curr) => acc + curr.percentage, 0) / history.length);
  const totalQuizzes = history.length;

  return (
    <div className="space-y-8">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-[#D0D2CF] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-[#A4F5A6] rounded-2xl flex items-center justify-center shadow-xs">
            <Trophy className="w-6 h-6 text-[#222222]" />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#666666] uppercase tracking-widest">Average Score</p>
            <p className="text-2xl font-black text-[#222222]">{averageScore}%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-[#D0D2CF] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-[#222222] rounded-2xl flex items-center justify-center shadow-xs">
            <BarChart3 className="w-6 h-6 text-[#EFF1EE]" />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#666666] uppercase tracking-widest">Quizzes Taken</p>
            <p className="text-2xl font-black text-[#222222]">{totalQuizzes}</p>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-[#222222] px-1">Recent Examinations</h3>
        <div className="space-y-3">
          {history.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectQuiz?.(record.quizId)}
              className="bg-white p-4 md:p-5 rounded-2xl border border-[#D0D2CF] hover:border-[#222222] transition-all group flex items-center justify-between cursor-pointer active:scale-99 shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                  record.percentage >= 80 ? 'bg-[#A4F5A6] text-[#222222]' : 
                  record.percentage >= 50 ? 'bg-orange-100 text-orange-700' : 
                  'bg-red-100 text-red-700'
                }`}>
                  {record.percentage}%
                </div>
                <div>
                  <h4 className="font-black text-[#222222] text-base group-hover:text-[#222222] transition-colors">
                    {record.quizTitle}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-[#666666] font-bold">
                      <Clock className="w-3 h-3" />
                      {new Date(record.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#666666] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      {record.score}/{record.totalQuestions}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#D0D2CF] group-hover:text-[#222222] transition-all" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

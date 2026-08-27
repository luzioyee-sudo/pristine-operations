// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithApple,
  resendConfirmationEmail,
} from '../lib/supabase';
import { Eye, EyeOff, User, Sparkles, ArrowRight, ShieldCheck, Mail, Apple } from 'lucide-react';
import { RibbleLogo } from './RibbleLogo';
import { getTranslation } from '../utils/i18n';
import { tracker } from '../utils/tracker';

interface OnboardingViewProps {
  onComplete: (name: string, language: string, userId?: string, email?: string) => void;
  settings?: any;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete, settings }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState(settings?.interfaceLanguage || 'English');
  const t = getTranslation(language || settings?.interfaceLanguage);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResendConfirmation = async () => {
    setIsLoading(true);
    setAuthError('');
    try {
      const { error } = await resendConfirmationEmail(email);
      if (error) throw error;
      setAuthNotice('Confirmation email sent. Open the link in your inbox, then sign in.');
    } catch (err: any) {
      setAuthError(String(err?.message || 'Could not resend the confirmation email.'));
    } finally {
      setIsLoading(false);
    }
  };


  const formatAuthError = (error: any, mode: 'login' | 'signup', providerName?: string) => {
    const code = String(error?.code || '').toLowerCase();
    const rawMessage = String(error?.message || '');

    const providerMessage = rawMessage.toLowerCase();
    if (providerName && (code.includes('provider-not-enabled') || code.includes('unsupported-provider') || providerMessage.includes('provider is not enabled') || providerMessage.includes('unsupported provider') || providerMessage.includes('provider is disabled'))) {
      return `${providerName} sign-in is not enabled in Supabase yet. Enable the ${providerName} provider in Supabase Auth, then try again.`;
    }
    if (code.includes('operation-not-allowed') || code.includes('admin-restricted-operation') || code.includes('password-login-disabled')) {
      return 'Email and password sign-in is disabled for this app. Enable email/password authentication in Supabase Auth, then try again.';
    }
    if (code.includes('email-already-in-use') || code.includes('user_already_exists')) {
      return 'An account already exists for this email. Switch to Sign In or use a different email address.';
    }
    if (code.includes('email_not_confirmed') || providerMessage.includes('email not confirmed')) {
      return 'Your email address is not confirmed yet. Open the confirmation link we emailed you, or resend it below.';
    }
    if (
      code.includes('invalid-credential') ||
      code.includes('invalid_credentials') ||
      code.includes('wrong-password') ||
      code.includes('user-not-found') ||
      providerMessage.includes('invalid login credentials')
    ) {
      return 'The email or password is incorrect — if you just signed up, confirm your email first, then sign in.';
    }
    if (code.includes('over_email_send_rate_limit') || code.includes('over_request_rate_limit')) {
      return 'Too many attempts were made. Wait a minute and try again.';
    }
    if (code.includes('invalid-email')) {
      return 'Enter a valid email address.';
    }
    if (code.includes('weak-password')) {
      return 'Your password must be at least 6 characters long.';
    }
    if (code.includes('too-many-requests')) {
      return 'Too many attempts were made. Wait a moment and try again.';
    }
    if (code.includes('network-request-failed')) {
      return 'A network error prevented authentication. Check your connection and try again.';
    }
    if (rawMessage.includes('PASSWORD_LOGIN_DISABLED')) {
      return 'Email and password sign-in is disabled for this app. Enable email/password authentication in Supabase Auth, then try again.';
    }

    return rawMessage || `Unable to ${mode === 'login' ? 'sign in' : 'create your account'}. Please try again.`;
  };

  const handleEmailAuth = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    if (!normalizedEmail || !trimmedPassword) {
      setAuthError('Enter your email and password to continue.');
      return;
    }
    if (!isLogin && trimmedPassword.length < 6) {
      setAuthError('Your password must be at least 6 characters long.');
      return;
    }

    setAuthError('');
    setAuthNotice('');
    setNeedsConfirmation(false);
    setIsLoading(true);
    try {
      const result = isLogin
        ? await signInWithEmail(normalizedEmail, trimmedPassword)
        : await signUpWithEmail(normalizedEmail, trimmedPassword, name);
      if (result.error) throw result.error;

      const authenticatedUser = result.data.user;
      if (!authenticatedUser) {
        throw new Error('Supabase did not return a user account. Please try again.');
      }
      // Supabase returns an obfuscated user with no identities when the email is already registered.
      if (!isLogin && Array.isArray(authenticatedUser.identities) && authenticatedUser.identities.length === 0) {
        setIsLogin(true);
        setAuthError('An account already exists for this email. Sign in instead (or confirm your email first).');
        setNeedsConfirmation(true);
        return;
      }
      if (!result.data.session) {
        setNeedsConfirmation(true);
        setAuthNotice('Account created. Confirm your email using the link we just sent, then sign in.');
        return;
      }


      tracker.trackEvent(isLogin ? 'user_logged_in' : 'user_registered', 'auth', { method: 'email' }, true);
      tracker.trackEvent('onboarding_completed', 'funnel', { method: 'email' }, true);
      onComplete(
        name.trim() || authenticatedUser.user_metadata?.full_name || normalizedEmail.split('@')[0] || 'User',
        language,
        authenticatedUser.id,
        authenticatedUser.email || normalizedEmail,
      );
    } catch (err: any) {
      const message = formatAuthError(err, isLogin ? 'login' : 'signup');
      const lowered = `${err?.code || ''} ${err?.message || ''}`.toLowerCase();
      if (lowered.includes('not confirmed') || lowered.includes('invalid login credentials') || lowered.includes('invalid_credentials')) {
        setNeedsConfirmation(true);
      }
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    const providerName = provider === 'google' ? 'Google' : 'Apple';
    setAuthError('');
    setIsLoading(true);
    try {
      const result = provider === 'google' ? await signInWithGoogle() : await signInWithApple();
      if (result.error) throw result.error;
      tracker.trackEvent('user_logged_in', 'auth', { method: provider }, true);
    } catch (err: any) {
      setAuthError(formatAuthError(err, 'login', providerName));
      setIsLoading(false);
    }
  };

  // Track onboarding entry
  useEffect(() => {
    tracker.trackEvent('onboarding_started', 'funnel');
  }, []);

  // Auto-advance from welcome screen
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const languages = [
    { code: 'GB', name: 'English', sub: 'ENGLISH', id: 'English' },
    { code: 'FR', name: 'Français', sub: 'FRENCH', id: 'French' },
    { code: 'EG', name: 'العربية', sub: 'ARABIC', id: 'Arabic' },
    { code: 'ES', name: 'Español', sub: 'SPANISH', id: 'Spanish' },
    { code: 'DE', name: 'Deutsch', sub: 'GERMAN', id: 'German' },
  ];

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#EFF1EE] dark:bg-[#121312] relative overflow-y-auto text-[#222222] dark:text-[#EFF1EE] p-4 sm:p-6 md:p-12">
      {/* Subtle brand ambient glow */}
      <div className="absolute top-0 end-0 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-gradient-to-bl from-[#A4F5A6]/20 via-[#EFF1EE]/0 to-transparent dark:from-[#A4F5A6]/10 dark:via-[#121312]/0 blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3 rounded-full" />
      
      <div className="w-full max-w-xl md:max-w-2xl px-2 sm:px-6 md:px-10 relative z-10 flex flex-col justify-center my-auto py-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 flex flex-col justify-center"
            >
              <div className="mb-6 sm:mb-10 text-[#222222] dark:text-[#A4F5A6]">
                <RibbleLogo showWordmark={false} size="lg" animated />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-['Cabinet_Grotesk','Plus_Jakarta_Sans',sans-serif] font-bold text-[#222222] dark:text-white leading-tight flex flex-wrap gap-x-[0.3em] overflow-hidden">
                {(t.whatShouldWeCallYou || "What should we call you?").split(' ').map((word, wordIndex) => (
                  <span key={wordIndex} className="flex overflow-hidden">
                    {word.split('').map((char, charIndex) => (
                      <motion.span
                        key={`${wordIndex}-${charIndex}`}
                        initial={{ opacity: 0, y: "100%", rotate: 5 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: 0.1 + (wordIndex * 5 + charIndex) * 0.03,
                          ease: [0.2, 0.65, 0.3, 0.9],
                        }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h1>
              
              <input
                type="text"
                placeholder={t.typeYourName || "Type your name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && name.trim() && setStep(1)}
                className="mt-8 sm:mt-12 w-full bg-transparent border-b border-[#D0D2CF] dark:border-[#2C2E2A] pb-3 sm:pb-4 text-2xl sm:text-3xl md:text-4xl text-[#222222] dark:text-white placeholder:text-[#999999] dark:placeholder:text-[#666666] outline-none focus:border-[#222222] dark:focus:border-[#A4F5A6] transition-colors font-['Cabinet_Grotesk','Plus_Jakarta_Sans',sans-serif] min-h-[48px]"
                autoFocus
              />
              
              <div className="mt-8 sm:mt-12 flex items-center justify-between gap-4 flex-wrap">
                <button
                  onClick={() => name.trim() && setStep(1)}
                  disabled={!name.trim()}
                  className={`px-8 py-3.5 rounded-full text-sm font-bold transition-all min-h-[48px] ${
                    name.trim() 
                      ? 'bg-[#222222] dark:bg-[#A4F5A6] hover:bg-[#333333] dark:hover:bg-[#8AE88D] text-[#EFF1EE] dark:text-[#222222] cursor-pointer shadow-sm active:scale-95' 
                      : 'bg-[#D0D2CF] dark:bg-[#1E201D] text-[#999999] dark:text-[#666666] cursor-not-allowed'
                  }`}
                >
                  {t.continue || "Continue"}
                </button>

                {/* Direct skip to login / guest option */}
                <button
                  onClick={() => setStep(3)}
                  className="text-xs font-bold text-[#666666] hover:text-[#222222] dark:text-[#999999] dark:hover:text-[#A4F5A6] transition-colors cursor-pointer py-2 px-1"
                >
                  {t.alreadyHaveAccount || "Already have an account? Sign In →"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex-1 flex flex-col items-center justify-center text-center py-8"
            >
              <div className="text-[11px] font-bold tracking-[0.25em] text-[#666666] dark:text-[#999999] uppercase">
                {t.welcome || "WELCOME"}
              </div>
              <h1 className="mt-6 sm:mt-8 text-4xl sm:text-5xl md:text-7xl font-['Cabinet_Grotesk','Plus_Jakarta_Sans',sans-serif] font-bold text-[#222222] dark:text-white tracking-tight flex justify-center flex-wrap gap-x-[0.3em]">
                {name.split(' ').map((word, wordIndex) => (
                  <span key={wordIndex} className="flex overflow-hidden">
                    {word.split('').map((char, charIndex) => (
                      <motion.span
                        key={`${wordIndex}-${charIndex}`}
                        initial={{ opacity: 0, y: "100%", rotate: 5 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: 0.2 + (wordIndex * 5 + charIndex) * 0.05,
                          ease: [0.2, 0.65, 0.3, 0.9],
                        }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h1>
              <div className="w-20 sm:w-24 h-[1.5px] bg-[#222222] dark:bg-[#A4F5A6] my-6 sm:my-10" />
              <p className="text-[#666666] dark:text-[#999999] text-sm sm:text-[15px] max-w-sm leading-relaxed">
                {t.onboardingWelcomeDesc || "Lovely to meet you. Let's shape a reading habit that actually fits your days."}
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 flex flex-col justify-center py-6 sm:py-10"
            >
              <div className="self-start px-2.5 py-1 bg-[#D0D2CF]/40 dark:bg-[#1E201D] text-[#222222] dark:text-[#A4F5A6] text-[10px] font-bold tracking-[0.15em] uppercase rounded-full border border-[#D0D2CF]/60 dark:border-[#2C2E2A]">
                {t.preference || "PREFERENCE"}
              </div>
              
              <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-[40px] font-['Cabinet_Grotesk','Plus_Jakarta_Sans',sans-serif] font-bold text-[#222222] dark:text-white leading-tight flex flex-wrap gap-x-[0.3em] overflow-hidden">
                {(t.whatsYourNativeLanguage || "What's your native language?").split(' ').map((word, wordIndex) => (
                  <span key={wordIndex} className="flex overflow-hidden">
                    {word.split('').map((char, charIndex) => (
                      <motion.span
                        key={`${wordIndex}-${charIndex}`}
                        initial={{ opacity: 0, y: "100%", rotate: 5 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: 0.1 + (wordIndex * 5 + charIndex) * 0.02,
                          ease: [0.2, 0.65, 0.3, 0.9],
                        }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h1>
              
              <p className="mt-2 sm:mt-4 text-[#666666] dark:text-[#999999] text-xs sm:text-[15px]">
                {t.nativeLanguageDesc || "Explanations and definitions will be adapted to this language."}
              </p>
              
              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      tracker.trackEvent('onboarding_preference_selected', 'funnel', { native_language: lang.id });
                      setLanguage(lang.id);
                      setStep(3);
                    }}
                    className="px-5 sm:px-6 py-5 sm:py-6 rounded-[20px] border border-[#D0D2CF] dark:border-[#2C2E2A] bg-white dark:bg-[#1A1C19] hover:bg-[#EFF1EE] dark:hover:bg-[#252824] hover:border-[#222222] dark:hover:border-[#A4F5A6] transition-all text-start group cursor-pointer shadow-xs hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-xs font-bold tracking-wide text-[#222222] dark:text-[#EFF1EE]">{lang.code}</span>
                      <span className="text-2xl sm:text-3xl font-serif text-[#222222] dark:text-white">{lang.name}</span>
                    </div>
                    <div className="mt-2 sm:mt-3 text-[10px] font-bold tracking-[0.15em] uppercase text-[#666666] dark:text-[#999999]">
                      {lang.sub}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 sm:mt-10 flex items-center justify-start">
                <button
                  onClick={() => setStep(0)}
                  className="text-[#666666] dark:text-[#999999] text-sm hover:text-[#222222] dark:hover:text-white transition-colors cursor-pointer py-2"
                >
                  ← {t.back || "Back"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 flex flex-col justify-center py-4 sm:py-8"
            >
              <div className="mb-4 sm:mb-6 text-[#222222] dark:text-[#EFF1EE] flex items-center justify-start">
                <RibbleLogo showWordmark={false} size="md" animated />
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-[36px] font-['Cabinet_Grotesk','Plus_Jakarta_Sans',sans-serif] font-bold text-[#222222] dark:text-white leading-tight">
                {isLogin ? (t.welcomeBack || 'Welcome back to Ribble') : (t.createYourAccount || 'Create your account')}
              </h1>
              
              <p className="mt-2 sm:mt-3 text-[#666666] dark:text-[#999999] text-xs sm:text-[14px]">
                {isLogin ? (t.signInToAccessLibrary || 'Sign in to access your library, vocabulary, and decks.') : (t.syncLibraryDescription || 'Sync your reading library, flashcards, and progress across all your devices.')}
              </p>

              <div className="mt-6 sm:mt-8 flex flex-col gap-3.5 w-full max-w-md">
                {/* Social sign-in buttons: clicking either icon or label starts OAuth immediately. */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => void handleSocialAuth('google')}
                    disabled={isLoading}
                    aria-label="Continue with Google"
                    title="Continue with Google"
                    className="w-full flex items-center justify-center gap-2 px-3 py-3.5 rounded-2xl border border-[#D0D2CF] dark:border-[#2C2E2A] bg-white dark:bg-[#1A1C19] hover:bg-[#EFF1EE] dark:hover:bg-[#252824] text-[#222222] dark:text-[#EFF1EE] text-sm font-semibold transition-all cursor-pointer shadow-xs min-h-[48px] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="hidden sm:inline">{t.continueWithGoogle || "Google"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSocialAuth('apple')}
                    disabled={isLoading}
                    aria-label="Continue with Apple"
                    title="Continue with Apple"
                    className="w-full flex items-center justify-center gap-2 px-3 py-3.5 rounded-2xl border border-[#D0D2CF] dark:border-[#2C2E2A] bg-white dark:bg-[#1A1C19] hover:bg-[#EFF1EE] dark:hover:bg-[#252824] text-[#222222] dark:text-[#EFF1EE] text-sm font-semibold transition-all cursor-pointer shadow-xs min-h-[48px] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Apple className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline">{t.continueWithApple || "Apple"}</span>
                  </button>
                </div>

                <div className="relative my-2 sm:my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#D0D2CF] dark:border-[#2C2E2A]"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] font-bold tracking-wider uppercase">
                    <span className="px-3 bg-[#EFF1EE] dark:bg-[#121312] text-[#666666] dark:text-[#999999]">{t.orContinueWithEmail || "Or continue with email"}</span>
                  </div>
                </div>

                {/* Email Input */}
                <div className="relative">
                  <Mail className="w-4 h-4 absolute start-4 top-3.5 text-[#666666] dark:text-[#999999]" />
                  <input
                    type="email"
                    placeholder={t.emailAddress || "Email address"}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full ps-11 pe-4 py-3.5 rounded-2xl border border-[#D0D2CF] dark:border-[#2C2E2A] bg-white dark:bg-[#1A1C19] text-sm text-[#222222] dark:text-white placeholder:text-[#999999] dark:placeholder:text-[#666666] focus:border-[#222222] dark:focus:border-[#A4F5A6] outline-none transition-all min-h-[48px]"
                  />
                </div>
                
                {/* Password Input with Toggle */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t.password || "Password"}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEmailAuth();
                      }
                    }}
                    className="w-full ps-4 pe-11 py-3.5 rounded-2xl border border-[#D0D2CF] dark:border-[#2C2E2A] bg-white dark:bg-[#1A1C19] text-sm text-[#222222] dark:text-white placeholder:text-[#999999] dark:placeholder:text-[#666666] focus:border-[#222222] dark:focus:border-[#A4F5A6] outline-none transition-all min-h-[48px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3.5 top-3.5 p-1 text-[#666666] hover:text-[#222222] dark:text-[#999999] dark:hover:text-white transition-colors cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authError && (
                  <p className="text-red-500 text-xs font-semibold px-1">{authError}</p>
                )}

                {authNotice && (
                  <p className="text-emerald-600 dark:text-[#A4F5A6] text-xs font-semibold px-1">{authNotice}</p>
                )}

                {needsConfirmation && email.trim() && (
                  <button
                    type="button"
                    onClick={() => void handleResendConfirmation()}
                    disabled={isLoading}
                    className="self-start text-xs font-bold underline text-[#222222] dark:text-[#A4F5A6] disabled:opacity-60 cursor-pointer px-1 py-1"
                  >
                    Resend confirmation email
                  </button>
                )}

                <button
                  onClick={handleEmailAuth}
                  disabled={isLoading || !email.trim() || !password.trim()}
                  className={`w-full px-6 py-3.5 rounded-2xl text-sm font-semibold transition-all shadow-xs min-h-[48px] flex items-center justify-center gap-2 ${
                    !email.trim() || !password.trim() || isLoading
                      ? 'bg-[#D0D2CF] dark:bg-[#1E201D] text-[#999999] dark:text-[#666666] cursor-not-allowed'
                      : 'bg-[#222222] dark:bg-[#A4F5A6] text-[#EFF1EE] dark:text-[#222222] hover:bg-[#333333] dark:hover:bg-[#8AE88D] cursor-pointer active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? (t.pleaseWait || 'Please wait...') : (isLogin ? (t.login || 'Sign In') : (t.createAccount || 'Create Account'))}
                </button>

                <p className="text-center text-xs text-[#666666] dark:text-[#999999] mt-1">
                  {isLogin ? (t.dontHaveAccount || "Don't have an account? ") : (t.alreadyHaveAccount || "Already have an account? ")}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setAuthError('');
                    }}
                    className="font-bold text-[#222222] dark:text-[#A4F5A6] hover:underline cursor-pointer py-1"
                  >
                    {isLogin ? (t.signUp || 'Sign up') : (t.logIn || 'Log in')}
                  </button>
                </p>
              </div>

              <div className="mt-5 sm:mt-6">
                <button
                  onClick={() => {
                    tracker.trackEvent('onboarding_skipped_auth', 'funnel', { method: 'guest' }, true);
                    onComplete(name.trim() || 'Guest', language);
                  }}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-full border border-[#D0D2CF] dark:border-[#2C2E2A] bg-transparent text-[#222222] dark:text-[#EFF1EE] text-sm font-bold hover:bg-white dark:hover:bg-[#1A1C19] transition-all cursor-pointer disabled:opacity-50"
                >
                  {t.continueAsGuest || 'Continue without an account'}
                </button>
                <p className="mt-2 text-center text-[11px] text-[#666666] dark:text-[#999999]">
                  {t.guestNotice || 'Your data stays on this device until you sign in.'}
                </p>
              </div>

              <div className="mt-6 sm:mt-8 flex items-center justify-start">
                <button
                  onClick={() => setStep(2)}
                  className="text-[#666666] dark:text-[#999999] text-sm hover:text-[#222222] dark:hover:text-white transition-colors cursor-pointer py-1"
                >
                  ← {t.back || "Back"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

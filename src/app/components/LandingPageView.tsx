// @ts-nocheck
import React, { useEffect } from 'react';

interface LandingPageViewProps {
  onNavigate?: (view: any) => void;
  onStartLearning?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onNavigate, onStartLearning }) => {
  useEffect(() => {
    // Listen for messages from the iframe when user clicks "Start learning"
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'navigate-home' || event.data === 'navigate-onboarding' || event.data === 'start-learning') {
        if (onStartLearning) {
          onStartLearning();
        } else if (onNavigate) {
          onNavigate('onboarding');
        } else {
          window.location.hash = '#onboarding';
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onNavigate, onStartLearning]);

  return (
    <div className="w-screen h-screen overflow-hidden m-0 p-0 fixed inset-0 z-50 bg-[#EFF1EE]">
      <iframe 
        src="/landing.html" 
        className="w-full h-full border-none block" 
        title="Ribble Landing Page" 
      />
    </div>
  );
};

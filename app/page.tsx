'use client';

import { useState } from 'react';
import RiskForm from '@/components/RiskForm';
import ResultCard from '@/components/ResultCard';
import LoadingState from '@/components/LoadingState';
import { AnalysisResult, UserInput } from '@/lib/types';
import { Sparkles, ShieldQuestion, Briefcase } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [prefillRole, setPrefillRole] = useState<string>('');

  const handleCalculate = async (data: UserInput) => {
    setIsLoading(true);
    setUserInput(data);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const analysisResult: AnalysisResult = await response.json();
      setResult(analysisResult);
    } catch (error) {
      console.error('Error calculating risk:', error);
      alert('An error occurred while calculating your risk. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setUserInput(null);
    setPrefillRole('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleSelect = (role: string) => {
    setPrefillRole(role);
    // Scroll to form
    const formElement = document.getElementById('risk-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* Navigation / Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2 text-xl font-bold text-white tracking-tight">
          <Sparkles className="w-6 h-6 text-blue-500" />
          Am I Replaceable?
        </div>
        <div className="text-sm font-medium text-gray-400 bg-gray-900/50 border border-gray-800 px-4 py-1.5 rounded-full backdrop-blur-md">
          v1.0
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 relative z-10 flex flex-col items-center">
        
        {!result && !isLoading && (
          <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400 mb-6 tracking-tight leading-tight pb-2">
              Will AI replace your job?
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed font-medium">
              Paste what you do every day. Get your AI automation exposure score, your career moat, and a 30-day plan to become harder to replace.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Product Manager', 'Software Engineer', 'Designer', 'Data Analyst', 'Marketer', 'Customer Support'].map((role) => (
                <button 
                  key={role} 
                  onClick={() => handleRoleSelect(role)}
                  className="flex items-center gap-2 bg-gray-900/40 border border-gray-800 px-4 py-2 rounded-full text-sm text-gray-300 shadow-sm backdrop-blur-sm cursor-pointer hover:bg-gray-800 hover:text-white transition-all"
                >
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="w-full">
          {isLoading ? (
            <LoadingState />
          ) : result && userInput ? (
            <ResultCard result={result} userInput={userInput} onReset={resetForm} />
          ) : (
            <div id="risk-form">
              <RiskForm onSubmit={handleCalculate} isLoading={isLoading} prefillRole={prefillRole} />
            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full relative z-10 border-t border-gray-900/50 mt-12 bg-gray-950/50 backdrop-blur-md">
        {/* Contact row */}
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              RM
            </div>
            <div className="text-left">
              <div className="text-white font-semibold text-sm">Rajani Maski</div>
              <div className="text-gray-400 text-xs">Passionate Staff / Principal AI Engineer</div>
            </div>
          </div>
          <a
            href="https://www.linkedin.com/in/rajanimaski/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 hover:border-[#0A66C2]/60 text-[#60a5fa] hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            Connect on LinkedIn
          </a>
        </div>

        {/* Disclaimer row */}
        <div className="border-t border-gray-900/50 py-4 text-center">
          <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-2 text-xs text-gray-600">
            <ShieldQuestion className="w-3.5 h-3.5" />
            For education and entertainment. Not career, hiring, or employment advice.
          </div>
        </div>
      </footer>

    </main>
  );
}

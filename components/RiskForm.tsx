'use client';

import { useState, useEffect } from 'react';
import { UserInput } from '@/lib/types';
import { ArrowRight, Loader2, Sparkles, Plus } from 'lucide-react';

export default function RiskForm({ onSubmit, isLoading, prefillRole }: { onSubmit: (data: UserInput) => void, isLoading: boolean, prefillRole?: string }) {
  const [formData, setFormData] = useState<UserInput>({
    jobTitle: '',
    company: '',
    yearsExperience: '',
    seniority: 'Mid-level',
    dailyTasks: '',
    toolsUsed: '',
    workStyle: 'Mixed',
    futureRole: '',
  });

  const [error, setError] = useState('');
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState<string[]>([]);

  useEffect(() => {
    if (prefillRole) {
      // eslint-disable-next-line
      setFormData(prev => ({ ...prev, jobTitle: prefillRole }));
    }
  }, [prefillRole]);

  const handleSuggestTasks = async () => {
    if (!formData.jobTitle) {
      setError('Please enter a Job Title first to generate tasks.');
      return;
    }
    
    setIsGeneratingTasks(true);
    setError('');
    
    try {
      const response = await fetch('/api/suggest-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          company: formData.company,
          yearsExperience: formData.yearsExperience,
          seniority: formData.seniority,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      if (data.suggestedTasks) {
        setSuggestedTasks(data.suggestedTasks);
      }
    } catch (err) {
      console.error('Error generating tasks:', err);
      setError('Could not generate tasks. Please enter them manually.');
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const handleAddSuggestedTask = (task: string) => {
    setFormData(prev => ({
      ...prev,
      dailyTasks: prev.dailyTasks 
        ? `${prev.dailyTasks}\n- ${task}`
        : `- ${task}`
    }));
    // Remove from suggestions once added
    setSuggestedTasks(prev => prev.filter(t => t !== task));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobTitle) {
      setError('Job title is required.');
      return;
    }
    if (formData.dailyTasks.length < 30) {
      setError('Please provide more detail in your daily tasks (at least 30 characters).');
      return;
    }
    setError('');
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Job Title & Industry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Job Title *</label>
            <input 
              type="text" 
              placeholder="e.g. Product Manager" 
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Company Name (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. Google, Acme Corp" 
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.company || ''}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
        </div>

        {/* Experience & Seniority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Years of Experience</label>
            <input 
              type="text" 
              placeholder="e.g. 5" 
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.yearsExperience}
              onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Seniority Level</label>
            <select 
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.seniority}
              onChange={(e) => setFormData({ ...formData, seniority: e.target.value as UserInput['seniority'] })}
            >
              <option value="Entry-level">Entry-level</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
              <option value="Lead/Manager">Lead/Manager</option>
              <option value="Executive">Executive</option>
              <option value="Founder">Founder</option>
            </select>
          </div>
        </div>

        {/* Daily Tasks */}
        <div className="space-y-4 bg-gray-950/50 p-4 md:p-6 rounded-2xl border border-gray-800/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1">
                Main Daily Tasks *
              </label>
              <span className="text-gray-500 text-xs">Be specific for an accurate AI exposure score</span>
            </div>
            <button
              type="button"
              onClick={handleSuggestTasks}
              disabled={isGeneratingTasks || !formData.jobTitle}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingTasks ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGeneratingTasks ? 'Generating...' : 'Suggest Tasks'}
            </button>
          </div>

          {suggestedTasks.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {suggestedTasks.map((task, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSuggestedTask(task)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-900 border border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/10 rounded-full text-gray-300 transition-colors text-left"
                >
                  <Plus className="w-3 h-3 text-blue-400 shrink-0" />
                  <span className="truncate max-w-[200px] md:max-w-[300px]">{task}</span>
                </button>
              ))}
            </div>
          )}

          <textarea 
            placeholder="I spend 2 hours a day organizing data in Excel, writing emails to clients, attending sync meetings, and drafting project specs..." 
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-32 resize-none"
            value={formData.dailyTasks}
            onChange={(e) => setFormData({ ...formData, dailyTasks: e.target.value })}
          />
          <div className="text-xs text-gray-500 text-right">
            {formData.dailyTasks.length} chars (min 30)
          </div>
        </div>

        {/* Tools */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Tools You Use</label>
          <input 
            type="text" 
            placeholder="Jira, Figma, Excel, ChatGPT, Slack..." 
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={formData.toolsUsed}
            onChange={(e) => setFormData({ ...formData, toolsUsed: e.target.value })}
          />
        </div>

        {/* Work Style & Future Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Dominant Work Style</label>
            <select 
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.workStyle}
              onChange={(e) => setFormData({ ...formData, workStyle: e.target.value })}
            >
              <option value="Repetitive">Repetitive / Routine</option>
              <option value="Creative">Creative / Generative</option>
              <option value="Analytical">Analytical / Data-driven</option>
              <option value="People-heavy">People-heavy / Relational</option>
              <option value="Strategic">Strategic / Visionary</option>
              <option value="Mixed">Mixed / Balanced</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Target Future Role (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. VP of Product" 
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.futureRole}
              onChange={(e) => setFormData({ ...formData, futureRole: e.target.value })}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="pt-4">
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Calculating Risk...
              </>
            ) : (
              <>
                Calculate My AI Risk
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

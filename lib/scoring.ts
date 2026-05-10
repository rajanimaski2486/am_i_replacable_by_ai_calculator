import { UserInput, AnalysisResult } from './types';

export function calculateFallbackScore(input: UserInput): AnalysisResult {
  let score = 50;

  const repetitiveKeywords = [
    'data entry', 'summarizing', 'scheduling', 'reporting', 'formatting',
    'basic analysis', 'content repurposing', 'transcription', 'ticket triage',
    'qa checks', 'document processing', 'simple coding', 'customer support scripts',
    'copy', 'paste', 'sort', 'filter', 'organize'
  ];

  const judgmentKeywords = [
    'strategy', 'leadership', 'negotiation', 'stakeholder management',
    'original research', 'decision-making', 'uncertainty', 'customer discovery',
    'relationship building', 'creative direction', 'domain expertise', 'people management',
    'vision', 'mentor', 'advise', 'empathy', 'convince'
  ];

  const toolKeywords = ['ai', 'chatgpt', 'copilot', 'automation', 'zapier', 'python', 'sql', 'tableau', 'aws'];

  const lowerTasks = input.dailyTasks.toLowerCase();
  const lowerTools = input.toolsUsed.toLowerCase();
  
  const automatableFound: string[] = [];
  const judgmentFound: string[] = [];

  repetitiveKeywords.forEach(kw => {
    if (lowerTasks.includes(kw)) {
      score += 5;
      automatableFound.push(kw);
    }
  });

  judgmentKeywords.forEach(kw => {
    if (lowerTasks.includes(kw)) {
      score -= 5;
      judgmentFound.push(kw);
    }
  });

  toolKeywords.forEach(kw => {
    if (lowerTools.includes(kw)) {
      score -= 2;
    }
  });

  switch (input.seniority) {
    case 'Founder':
    case 'Executive':
      score -= 15;
      break;
    case 'Lead/Manager':
      score -= 10;
      break;
    case 'Senior':
      score -= 5;
      break;
    case 'Entry-level':
      score += 5;
      break;
  }

  const style = input.workStyle.toLowerCase();
  if (style.includes('repetitive')) score += 10;
  if (style.includes('creative')) score -= 2;
  if (style.includes('analytical')) score -= 2;
  if (style.includes('people-heavy')) score -= 8;
  if (style.includes('strategic')) score -= 10;
  
  // Clamp score
  score = Math.max(5, Math.min(95, score));

  let riskLabel = '';
  if (score <= 25) riskLabel = 'Low Risk';
  else if (score <= 50) riskLabel = 'Moderate Risk';
  else if (score <= 75) riskLabel = 'High Exposure';
  else riskLabel = 'Very High Exposure';

  const automatableTasks = automatableFound.length > 0 ? automatableFound : ['Routine data processing', 'Standard reporting'];
  const hardToReplaceTasks = judgmentFound.length > 0 ? judgmentFound : ['Complex problem solving', 'Human connection'];

  const verdict = score > 50 
    ? "A significant portion of your daily tasks is highly exposed to AI automation. It's time to pivot towards strategy and relationship building."
    : "Your role relies heavily on human judgment, creativity, or relationships, making you highly resilient to AI automation.";

  const humanAdvantage = score > 50 ? "Adaptability" : "Strategic Vision";
  const careerMoatScore = 100 - score;

  return {
    riskScore: score,
    riskLabel,
    verdict,
    careerMoatScore,
    humanAdvantage,
    automatableTasks,
    aiAssistedTasks: ['Drafting emails', 'Initial research', 'Data formatting'],
    hardToReplaceTasks,
    skillsToBuild: ['AI Tool Orchestration', 'Strategic Thinking', 'Stakeholder Management'],
    actionPlan30Days: [
      'Audit your daily tasks to see what takes the most time.',
      'Automate one repetitive task using an AI tool this week.',
      'Schedule a coffee chat to build relationships in a different department.'
    ],
    recommendedTitle: input.futureRole || 'AI-Augmented ' + input.jobTitle,
    recommendedCompanies: ['Tech innovators', 'AI-first startups', 'Companies with large R&D budgets'],
    aiMindsetShift: 'Stop thinking of AI as a replacement and start treating it as your highly capable intern. Delegate the busywork so you can focus on strategy.',
    linkedinPost: `I tested how replaceable my role is by AI.

Role: ${input.jobTitle}
AI Replaceability Risk: ${score}%
Human Advantage: ${humanAdvantage}

The most automatable part of my job:
${automatableTasks[0]}

The thing that makes me harder to replace:
${hardToReplaceTasks[0]}

Try yours: https://amireplaceablebyai.vercel.app/

Curious what score others get.`,
    caveat: "This is a deterministic fallback result. For a personalized AI analysis, an API key must be configured."
  };
}

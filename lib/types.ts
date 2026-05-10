export interface UserInput {
  jobTitle: string;
  company?: string;
  yearsExperience: string;
  seniority:
    | 'Entry-level'
    | 'Mid-level'
    | 'Senior'
    | 'Lead/Manager'
    | 'Executive'
    | 'Founder';
  dailyTasks: string;
  toolsUsed: string;
  workStyle: string;
  futureRole?: string;
}

export interface AnalysisResult {
  riskScore: number;
  riskLabel: string;
  verdict: string;
  careerMoatScore: number;
  humanAdvantage: string;
  automatableTasks: string[];
  aiAssistedTasks: string[];
  hardToReplaceTasks: string[];
  skillsToBuild: string[];
  actionPlan30Days: string[];
  recommendedTitle: string;
  recommendedCompanies: string[];
  aiMindsetShift: string;
  linkedinPost: string;
  caveat: string;
}

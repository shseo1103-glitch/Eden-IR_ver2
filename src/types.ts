export type UserRole = 'ADMIN' | 'JUDGE' | 'STARTUP' | 'CONSULTANT' | 'CLIENT' | 'MASTER_DB';
export type Role = UserRole;

export interface AuthAccount {
  id: string;
  password: string;
  name: string;
  role: UserRole;
  roleKor: string;
  affiliation: string;
  department?: string;
  position?: string;
  description: string;
  badgeBg: string;
  badgeFg: string;
  badgeBorder: string;
  avatarText: string;
}

export type ProgramStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
export type AiGrade = 'HIGH' | 'MEDIUM' | 'LOW';
export type QuestionSource = 'AI' | 'EXPERT' | 'ADMIN' | 'JUDGE';
export type InvestmentInterest = 'STRONG_RECOMMEND' | 'REVIEW' | 'PASS';

export interface Program {
  id: string;
  code: string;
  title: string;
  organization: string;
  description?: string;
  hasPreConsulting: boolean;
  status: ProgramStatus;
  startDate: string;
  endDate: string;
  venue: string;
  budget: string;
  currentStage: string;
  currentPitchOrder: number;
}

export interface ProgramParticipant {
  id: string;
  programId: string;
  name: string;
  title: string;
  affiliation: string;
  role: UserRole;
  roleKor: string;
  email: string;
  phone: string;
  isAdmitted: boolean;
  admittedAt: string | null;
  idCardStatus: 'VERIFIED' | 'PENDING' | 'NONE';
  bankbookStatus: 'VERIFIED' | 'PENDING' | 'NONE';
  idCardFile?: string;
  bankbookFile?: string;
  assignedCategory?: string;
  isEvaluatedAll?: boolean;
}

export interface SuggestedQuestion {
  id: number;
  text: string;
  source: string;
  isChecked: boolean;
}

export interface PitchEvaluation {
  judgeId: string;
  judgeName: string;
  affiliation: string;
  scores: {
    tech: number;      // max 30
    business: number;  // max 30
    team: number;      // max 20
    pitch: number;     // max 20
  };
  totalScore: number;
  feedback: string;
  investmentInterest: InvestmentInterest;
  evaluatedAt: string;
}

export interface PitchStartup {
  id: number;
  order: number;
  programId: string;
  companyName: string;
  representative: string;
  businessNumber: string;
  category: string;
  title: string;
  deckFileName: string;
  deckFileSize: string;
  deckPages: number;
  currentDeckPage?: number;
  uploadedAt: string;
  summaryText: string;
  
  // AI 1st pass evaluation
  aiGrade: AiGrade;
  aiScore: number;
  aiRank: number;
  aiMetrics: {
    techMoat: number;       // 100 max
    marketFit: number;      // 100 max
    businessModel: number;  // 100 max
    pitchQuality: number;   // 100 max
  };
  aiSummary: string;
  aiStrengths: string[];
  aiWeaknesses: string[];

  // Pre-consulting Q&As
  preConsultingQnAs: {
    id: number;
    question: string;
    answer: string;
    source: QuestionSource;
    status: 'ANSWERED' | 'PENDING';
  }[];

  // Core suggested questions pool
  suggestedQuestions: SuggestedQuestion[];

  // Evaluations by judges
  evaluations: PitchEvaluation[];

  // Consultant assessment
  consultantAssessment?: {
    consultantName: string;
    scores: {
      techTrl: number;       // 25 max
      marketBm: number;      // 25 max
      financeRunway: number; // 25 max
      tipsFit: number;       // 25 max
    };
    totalScore: number;
    qualitativeSummary: string;
    scaleUpRoadmap: {
      phase: string;
      timeline: string;
      goal: string;
      actionItem: string;
    }[];
    recommendedGrant: string;
  };

  // Status & Deliverables
  pitchStatus: 'PENDING' | 'ON_STAGE' | 'COMPLETED';
  isDeliverableApproved: boolean;
}

export interface MasterRawRow {
  eventId: string;
  rowId: string;
  role: UserRole;
  roleKor: string;
  name: string;
  title: string;
  affiliation: string;
  email: string;
  phone: string;
  bizNumOrAccount: string;
  field: string;
  submittedDoc: string;
  preConsultingSummary: string;
  aiGrade: string;
  aiScore: number;
  aiSummary: string;
  judgeScoresDetail: string;
  judgeAvgScore: number;
  judgeComments: string;
  consultantScoresDetail: string;
  consultantScore: number;
  consultantSummary: string;
  recommendedGrant: string;
  clientAuditStatus: string;
  collectedAt: string;
}

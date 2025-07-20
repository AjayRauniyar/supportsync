// Core Application Types
export interface AppState {
  currentPage: string;
  transferredData: TransferredData | null;
  selectedExpert: Expert | null;
  meetingInfo: MeetingInfo | null;
  ticketStatus: 'open' | 'in_progress' | 'resolved' | 'escalated' | 'closed';
  systemMetrics: SystemMetrics;
  notifications: Notification[];
  activeTickets: ActiveTicket[];
  userSession?: UserSession;
  errorState?: ErrorState;
}

// System Metrics for Dashboard
export interface SystemMetrics {
  totalCases: number;
  completedToday: number;
  activeMeetings: number;
  customerSatisfaction: number;
  aiAccuracy: number;
  expertUtilization: number;
  avgResolutionTime: string;
  activeTransfers: number;
  responseTime?: number;
  resolutionRate?: number;
  escalationRate?: number;
}

// Customer Chat and Transfer Data
export interface TransferredData {
  ticketId: string;
  customerInfo: CustomerInfo;
  issueDetails: IssueDetails;
  conversationHistory: ChatMessage[];
  redirectReason: string;
  timestamp: Date;
  aiAnalysis?: AIAnalysis;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: 'customer_chat' | 'phone' | 'email' | 'portal';
  urgency: 'low' | 'medium' | 'high' | 'immediate';
}

export interface CustomerInfo {
  name: string;
  email: string;
  company: string;
  location?: string;
  timezone?: string;
  phoneNumber?: string;
  preferredLanguage?: string;
  customerTier?: 'standard' | 'premium' | 'enterprise';
  previousCases?: number;
  contractType?: 'basic' | 'standard' | 'premium' | 'enterprise';
}

export interface IssueDetails {
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  components: string[];
  module: string;
  businessImpact: string;
  urgency: string;
  errorCodes?: string[];
  systemInfo?: SystemInfo;
  affectedUsers?: number;
  environment: 'development' | 'testing' | 'production';
  reproductionSteps?: string[];
  workaroundExists?: boolean;
}

export interface SystemInfo {
  version: string;
  environment: 'development' | 'testing' | 'production';
  region?: string;
  instanceSize?: string;
  database?: string;
  operatingSystem?: string;
  lastUpdate?: Date;
}

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'normal' | 'system' | 'error' | 'success' | 'action_required';
  sender?: string;
  metadata?: MessageMetadata;
  attachments?: Attachment[];
}

export interface MessageMetadata {
  confidence?: number;
  intent?: string;
  entities?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  language?: string;
  containsTechnicalTerms?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'log' | 'screenshot';
  url: string;
  size: number;
  uploadedAt: Date;
}

// Expert and Matching System
export interface Expert {
  id: string;
  name: string;
  title: string;
  email: string;
  avatar?: string;
  expertise: string[];
  specializations: string[];
  availability: 'available' | 'busy' | 'away' | 'offline';
  timezone: string;
  location: string;
  rating: number;
  responseTime: string;
  workload: number;
  calendar: CalendarSlot[];
  recentCases: number;
  successRate: number;
  languages: string[];
  certifications?: Certification[];
  experience: ExpertExperience;
  contactMethods: ContactMethod[];
  preferences?: ExpertPreferences;
}

export interface Certification {
  name: string;
  issuer: string;
  dateObtained: Date;
  expiryDate?: Date;
  credentialId?: string;
}

export interface ExpertExperience {
  totalYears: number;
  sapYears: number;
  industries: string[];
  companySize: string[];
  projectTypes: string[];
}

export interface ContactMethod {
  type: 'email' | 'phone' | 'teams' | 'slack' | 'whatsapp';
  value: string;
  preferred: boolean;
  availability?: string;
}

export interface ExpertPreferences {
  preferredMeetingTimes: string[];
  maxCasesPerDay: number;
  specialInterests: string[];
  avoidTopics?: string[];
}

export interface CalendarSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  type?: 'meeting' | 'busy' | 'free' | 'ai_meeting' | 'break';
  title?: string;
  participantCount?: number;
  meetingType?: 'consultation' | 'workshop' | 'emergency' | 'follow_up';
  description?: string;
  recurring?: boolean;
  meetingUrl?: string;
}

// Meeting and Video Conference
export interface MeetingInfo {
  id: string;
  title: string;
  description?: string;
  dateTime: string;
  duration: number;
  participants: MeetingParticipant[];
  expertName: string;
  expertId: string;
  customerName: string;
  customerId: string;
  meetingLink: string;
  roomId: string;
  status: 'scheduled' | 'starting' | 'active' | 'completed' | 'cancelled' | 'failed';
  aiAssistantEnabled: boolean;
  recordingEnabled: boolean;
  transcriptionEnabled: boolean;
  caseContext: TransferredData;
  preReadingMaterials?: string[];
  agenda?: string[];
  expectedOutcomes?: string[];
  followUpRequired?: boolean;
  meetingNotes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface MeetingParticipant {
  id: string;
  name: string;
  email: string;
  role: 'expert' | 'customer' | 'ai_assistant' | 'moderator' | 'observer';
  status: 'accepted' | 'pending' | 'declined' | 'tentative';
  isOnline?: boolean;
  joinTime?: Date;
  leaveTime?: Date;
  timezone?: string;
  connectionQuality?: 'excellent' | 'good' | 'poor' | 'disconnected';
  permissions?: ParticipantPermissions;
}

export interface ParticipantPermissions {
  canShare: boolean;
  canRecord: boolean;
  canMute: boolean;
  canManageParticipants: boolean;
  canEndMeeting: boolean;
}

// AI and Meeting Assistant
export interface AIAnalysis {
  confidence: number;
  recommendedExperts: number;
  estimatedResolution: string;
  complexity: string;
  similarCases?: string[];
  suggestedActions?: string[];
  riskAssessment?: string;
  businessImpactScore?: number;
  technicalComplexity?: number;
  urgencyScore?: number;
}

export interface MeetingSummary {
  id: string;
  meetingId: string;
  caseId: string;
  title: string;
  summary: string;
  keyPoints: string[];
  technicalSolutions: TechnicalSolution[];
  actionItems: ActionItem[];
  nextSteps: string[];
  resolutionStatus: 'resolved' | 'partial' | 'escalated' | 'follow_up_needed';
  participantFeedback: ParticipantFeedback[];
  knowledgebaseUpdates: KnowledgebaseUpdate[];
  customerSatisfactionScore: number;
  expertRating: number;
  aiInsights: AIInsight[];
  meetingMetrics: MeetingMetrics;
  followUpRequired: boolean;
  generatedAt: Date;
  approvedBy?: string;
  exportedFormats?: string[];
}

export interface TechnicalSolution {
  id: string;
  problem: string;
  solution: string;
  steps: string[];
  category: string;
  effectiveness: number;
  applicableModules: string[];
  complexity: 'low' | 'medium' | 'high';
  implementationTime: string;
  riskLevel: 'low' | 'medium' | 'high';
  prerequisites: string[];
  dependencies?: string[];
  testingRequired?: boolean;
  rollbackPlan?: string;
  validatedBy?: string;
  confidence: number;
}

export interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  assigneeEmail?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
  relatedToIssue: boolean;
  estimatedEffort: string;
  dependencies: string[];
  category: 'technical' | 'process' | 'follow_up' | 'documentation' | 'testing';
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;
  notes?: string;
  attachments?: string[];
}

export interface ParticipantFeedback {
  participantId: string;
  participantName: string;
  rating: number;
  comments: string;
  wouldRecommend: boolean;
  meetingQuality: number;
  aiAssistantRating: number;
  expertKnowledge: number;
  communicationClarity: number;
  problemResolution: number;
  suggestions: string[];
  followUpNeeded: boolean;
  submittedAt: Date;
}

export interface KnowledgebaseUpdate {
  id: string;
  category: string;
  subcategory?: string;
  keywords: string[];
  solution: string;
  confidenceLevel: number;
  usage: 'immediate' | 'review' | 'archive';
  relatedCases: string[];
  impactScore: number;
  validatedBy?: string;
  validatedAt?: Date;
  tags: string[];
  searchableContent: string;
  lastUpdated: Date;
}

export interface AIInsight {
  id: string;
  type: 'technical_solution' | 'action_item' | 'knowledge_suggestion' | 'escalation_recommendation' | 'process_improvement';
  content: string;
  confidence: number;
  timestamp: Date;
  relatedKeywords: string[];
  priority: 'low' | 'medium' | 'high';
  category: string;
  actionable: boolean;
  validated: boolean;
  source: 'transcription' | 'chat' | 'system' | 'historical_data';
  impact?: 'low' | 'medium' | 'high';
  implementationComplexity?: 'simple' | 'moderate' | 'complex';
}

export interface MeetingMetrics {
  totalDuration: number;
  speakingTime: { [participantId: string]: number };
  questionCount: number;
  resolutionAttempts: number;
  engagementScore: number;
  technicalComplexity: number;
  collaborationScore: number;
  efficiencyRating: number;
  interruptionCount?: number;
  silentPeriods?: number;
  screenShareDuration?: number;
  participantJoinDelay?: number;
  audioQualityScore?: number;
  videoQualityScore?: number;
}

// Transcription and Real-time Processing
export interface TranscriptionSegment {
  id: string;
  timestamp: Date;
  speaker: string;
  speakerId?: string;
  text: string;
  confidence: number;
  isActionItem: boolean;
  isTechnicalTerm: boolean;
  isResolution: boolean;
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  priority: 'low' | 'medium' | 'high';
  language?: string;
  duration?: number;
  wordCount?: number;
  technicalComplexity?: number;
}

// Notifications and Alerts
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: Date;
  isRead: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
  category?: 'system' | 'meeting' | 'case' | 'expert' | 'ai';
  recipientId?: string;
  expiresAt?: Date;
  metadata?: any;
}

export interface ActiveTicket {
  id: string;
  customerName: string;
  customerEmail?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'analyzing' | 'matched' | 'scheduled' | 'in_meeting' | 'resolved' | 'escalated';
  stage: 'customer_chat' | 'sap_analysis' | 'expert_matching' | 'meeting_scheduled' | 'ai_meeting' | 'resolved';
  timestamp: Date;
  lastActivity?: Date;
  assignedExpert?: string;
  expertId?: string;
  estimatedResolution?: Date;
  progress: number;
  category?: string;
  businessImpact?: string;
  notes?: string[];
}

// User and Session Management
export interface UserSession {
  id: string;
  userId: string;
  userType: 'customer' | 'expert' | 'admin' | 'system';
  userName: string;
  email: string;
  loginTime: Date;
  lastActivity: Date;
  permissions: string[];
  preferences: UserPreferences;
  currentCases?: string[];
  timezone: string;
  language: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationPreferences;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  autoSave: boolean;
  defaultView: string;
  expertiseAreas?: string[];
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'hourly' | 'daily';
  types: string[];
}

// Error Handling
export interface ErrorState {
  hasError: boolean;
  errorType: 'connection' | 'audio' | 'video' | 'ai' | 'system' | 'permission' | 'validation';
  errorMessage: string;
  errorCode?: string;
  canRecover: boolean;
  recoverySteps: string[];
  timestamp: Date;
  component?: string;
  stackTrace?: string;
  userAction?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// API and Network Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  timestamp: Date;
  requestId: string;
  cached?: boolean;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
  timestamp: Date;
}

// Configuration and Settings
export interface SystemConfiguration {
  enableRecording: boolean;
  enableTranscription: boolean;
  enableAI: boolean;
  autoSaveInterval: number;
  qualityThreshold: number;
  maxMeetingDuration: number;
  maxParticipants: number;
  supportedLanguages: string[];
  jitsiDomain?: string;
  aiModelVersion?: string;
  debugMode: boolean;
}

export interface ComponentConfiguration {
  chatBot: {
    enableFileUpload: boolean;
    maxMessageLength: number;
    typingTimeout: number;
    autoTranslate: boolean;
  };
  expertMatching: {
    maxRecommendations: number;
    matchingAlgorithm: string;
    scoreThreshold: number;
  };
  meeting: {
    defaultDuration: number;
    reminderMinutes: number[];
    autoRecord: boolean;
  };
  aiAssistant: {
    confidenceThreshold: number;
    maxInsights: number;
    enableLearning: boolean;
  };
}

// Event Types for Component Communication
export interface AppEvent {
  type: string;
  payload: any;
  timestamp: Date;
  source: string;
  target?: string;
}

// Search and Filtering
export interface SearchFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  priority?: string[];
  status?: string[];
  expertId?: string;
  category?: string[];
  textQuery?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Analytics and Reporting
export interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: Date;
  endDate: Date;
  metrics: {
    [key: string]: number | string;
  };
  trends: {
    [key: string]: TrendData[];
  };
  comparisons?: {
    [key: string]: ComparisonData;
  };
}

export interface TrendData {
  date: Date;
  value: number;
  change?: number;
  changePercent?: number;
}

export interface ComparisonData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

// File and Document Management
export interface DocumentMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
  tags: string[];
  relatedCases: string[];
  accessLevel: 'public' | 'internal' | 'restricted';
  version: number;
  checksum?: string;
}

// Integration Types
export interface JitsiConfiguration {
  domain: string;
  roomName: string;
  displayName: string;
  userEmail: string;
  enableAI: boolean;
  recordMeeting: boolean;
  transcriptionEnabled: boolean;
  moderatorMode: boolean;
}

export interface CalendarIntegration {
  provider: 'outlook' | 'google' | 'exchange';
  credentials: any;
  syncEnabled: boolean;
  defaultDuration: number;
  reminderSettings: {
    enabled: boolean;
    minutes: number[];
    methods: string[];
  };
}

// Utility Types
export type NavigationPage = 
  | 'home' 
  | 'customer-chat' 
  | 'sap-support' 
  | 'expert-matching' 
  | 'calendar' 
  | 'meeting-room' 
  | 'ai-assistant'
  | 'analytics'
  | 'settings'
  | 'admin';

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
export type UserRole = 'customer' | 'expert' | 'admin' | 'system';
export type MeetingStatus = 'scheduled' | 'starting' | 'active' | 'completed' | 'cancelled';

// Component Props Base Types
export interface BaseComponentProps {
  onNavigate: (page: NavigationPage, data?: any) => void;
  onError?: (error: Error) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

// Form and Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

// Export all types as a namespace for easier importing
export namespace SAPSupportSync {
  export type App = AppState;
  export type Metrics = SystemMetrics;
  export type Transfer = TransferredData;
  export type ExpertProfile = Expert;
  export type Meeting = MeetingInfo;
  export type Summary = MeetingSummary;
  export type AI = AIInsight;
  export type Error = ErrorState;
  export type Config = SystemConfiguration;
}

// Default values and constants
export const DEFAULT_SYSTEM_METRICS: SystemMetrics = {
  totalCases: 0,
  completedToday: 0,
  activeMeetings: 0,
  customerSatisfaction: 0,
  aiAccuracy: 0,
  expertUtilization: 0,
  avgResolutionTime: '0 hours',
  activeTransfers: 0
};

export const PRIORITY_LEVELS: Priority[] = ['low', 'medium', 'high', 'critical'];
export const USER_ROLES: UserRole[] = ['customer', 'expert', 'admin', 'system'];
export const NAVIGATION_PAGES: NavigationPage[] = [
  'home', 'customer-chat', 'sap-support', 'expert-matching', 
  'calendar', 'meeting-room', 'ai-assistant', 'analytics', 'settings', 'admin'
];

// Type guards for runtime type checking
export const isTransferredData = (obj: any): obj is TransferredData => {
  return obj && typeof obj.ticketId === 'string' && typeof obj.customerInfo === 'object';
};

export const isExpert = (obj: any): obj is Expert => {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string' && Array.isArray(obj.expertise);
};

export const isMeetingInfo = (obj: any): obj is MeetingInfo => {
  return obj && typeof obj.id === 'string' && typeof obj.meetingLink === 'string';
};

export const isErrorState = (obj: any): obj is ErrorState => {
  return obj && typeof obj.hasError === 'boolean' && typeof obj.errorMessage === 'string';
};

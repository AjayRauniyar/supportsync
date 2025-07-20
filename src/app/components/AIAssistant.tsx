import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Mic, MicOff, VideoOff, Users, MessageSquare, FileText,ArrowLeft,
  Download, Share, Clock, CheckCircle, AlertCircle, Bot, Settings,
  Play, Pause, Square, Zap, Brain, BookOpen, Target, TrendingUp,
  Calendar, Mail, Phone, Copy, ExternalLink, RefreshCw
} from 'lucide-react';

// Types and Interfaces
interface MeetingSession {
  id: string;
  title: string;
  participants: Participant[];
  startTime: Date;
  endTime?: Date;
  status: 'waiting' | 'active' | 'recording' | 'completed';
  meetingLink: string;
  caseId: string;
  aiAssistantActive: boolean;
}

interface Participant {
  id: string;
  name: string;
  role: 'expert' | 'customer' | 'ai_assistant';
  isOnline: boolean;
  isSpeaking: boolean;
  micMuted: boolean;
  videoOn: boolean;
}

interface TranscriptionSegment {
  id: string;
  timestamp: Date;
  speaker: string;
  text: string;
  confidence: number;
  isActionItem: boolean;
  isTechnicalTerm: boolean;
  isResolution: boolean;
}

interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  status: 'pending' | 'in-progress' | 'completed';
  relatedToIssue: boolean;
}

interface MeetingSummary {
  id: string;
  meetingId: string;
  caseId: string;
  summary: string;
  keyPoints: string[];
  technicalSolutions: TechnicalSolution[];
  actionItems: ActionItem[];
  nextSteps: string[];
  resolutionStatus: 'resolved' | 'partial' | 'escalated' | 'follow-up-needed';
  participantFeedback: ParticipantFeedback[];
  knowledgebaseUpdates: KnowledgebaseUpdate[];
  customerSatisfactionScore: number;
}

interface TechnicalSolution {
  id: string;
  problem: string;
  solution: string;
  steps: string[];
  category: string;
  effectiveness: number;
  applicableModules: string[];
}

interface ParticipantFeedback {
  participantId: string;
  rating: number;
  comments: string;
  wouldRecommend: boolean;
}

interface KnowledgebaseUpdate {
  id: string;
  category: string;
  keywords: string[];
  solution: string;
  confidenceLevel: number;
  usage: 'immediate' | 'review' | 'archive';
}

// Main AI Meeting Assistant Component
const AIMeetingAssistant: React.FC<{
  meetingData?: MeetingSession;
  onNavigate: (page: string) => void;
}> = ({ meetingData, onNavigate }) => {

  // State Management
  const [currentMeeting, setCurrentMeeting] = useState<MeetingSession | null>(meetingData || null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionSegment[]>([]);
  const [currentSummary, setCurrentSummary] = useState<MeetingSummary | null>(null);
  const [aiStatus, setAiStatus] = useState<'connecting' | 'listening' | 'processing' | 'summarizing' | 'completed'>('connecting');
  const [currentView, setCurrentView] = useState<'meeting' | 'transcription' | 'summary' | 'documentation'>('meeting');
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const transcriptionRef = useRef<HTMLDivElement>(null);
  const meetingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mock meeting data if none provided
  useEffect(() => {
    if (!currentMeeting) {
      initializeDemoMeeting();
    }
    startMeetingTimer();
    return () => {
      if (meetingTimerRef.current) {
        clearInterval(meetingTimerRef.current);
      }
    };
  }, []);

  // Auto-scroll transcription
  useEffect(() => {
    if (transcriptionRef.current) {
      transcriptionRef.current.scrollTop = transcriptionRef.current.scrollHeight;
    }
  }, [transcription]);

  // Initialize demo meeting
  const initializeDemoMeeting = () => {
    const demoMeeting: MeetingSession = {
      id: 'meeting-demo-001',
      title: 'SAP HANA Performance Consultation - SAP-784521',
      participants: [
        {
          id: 'expert-1',
          name: 'Dr. Sarah Chen',
          role: 'expert',
          isOnline: true,
          isSpeaking: false,
          micMuted: false,
          videoOn: true
        },
        {
          id: 'customer-1',
          name: 'John Doe',
          role: 'customer',
          isOnline: true,
          isSpeaking: false,
          micMuted: false,
          videoOn: true
        },
        {
          id: 'ai-assistant',
          name: 'SAP AI Assistant',
          role: 'ai_assistant',
          isOnline: true,
          isSpeaking: false,
          micMuted: true,
          videoOn: false
        }
      ],
      startTime: new Date(),
      status: 'active',
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/meeting-demo-001',
      caseId: 'SAP-784521',
      aiAssistantActive: true
    };
    
    setCurrentMeeting(demoMeeting);
    setAiStatus('listening');
    
    // Start demo transcription
    setTimeout(() => {
      simulateMeetingTranscription();
    }, 3000);
  };

  // Meeting timer
  const startMeetingTimer = () => {
    meetingTimerRef.current = setInterval(() => {
      setMeetingDuration(prev => prev + 1);
    }, 1000);
  };

  // Simulate real-time transcription
  const simulateMeetingTranscription = () => {
    const demoTranscripts = [
      {
        speaker: 'Dr. Sarah Chen',
        text: 'Hello John! I\'ve reviewed your HANA performance case. Let me start by understanding your current system configuration.',
        isActionItem: false,
        isTechnicalTerm: true,
        isResolution: false
      },
      {
        speaker: 'John Doe',
        text: 'Hi Dr. Chen! We\'re experiencing significant slowdowns during our end-of-month reporting. The system becomes almost unusable.',
        isActionItem: false,
        isTechnicalTerm: false,
        isResolution: false
      },
      {
        speaker: 'Dr. Sarah Chen',
        text: 'I see. Can you tell me your HANA database version and current memory allocation? Also, have you run ST05 SQL traces during these slow periods?',
        isActionItem: true,
        isTechnicalTerm: true,
        isResolution: false
      },
      {
        speaker: 'John Doe',
        text: 'We\'re running HANA 2.0 SPS06 with 512GB memory. I haven\'t run ST05 traces yet - should I do that now?',
        isActionItem: false,
        isTechnicalTerm: true,
        isResolution: false
      },
      {
        speaker: 'Dr. Sarah Chen',
        text: 'Yes, let\'s run ST05 now. I\'ll guide you through it. This will help us identify expensive SQL statements. Please open HANA Studio.',
        isActionItem: true,
        isTechnicalTerm: true,
        isResolution: true
      },
      {
        speaker: 'John Doe',
        text: 'HANA Studio is open. I can see the system is currently using 78% memory during normal operations.',
        isActionItem: false,
        isTechnicalTerm: true,
        isResolution: false
      },
      {
        speaker: 'Dr. Sarah Chen',
        text: 'That\'s quite high for normal operations. Let\'s check the column store statistics and look for memory-intensive queries. Navigate to the SQL Console.',
        isActionItem: true,
        isTechnicalTerm: true,
        isResolution: true
      },
      {
        speaker: 'John Doe',
        text: 'I see several queries taking over 30 seconds. There\'s one SELECT statement on the SALES_DATA table that\'s particularly slow.',
        isActionItem: false,
        isTechnicalTerm: true,
        isResolution: false
      },
      {
        speaker: 'Dr. Sarah Chen',
        text: 'Perfect! That\'s likely our culprit. Let\'s optimize that query by creating column store indexes. I\'ll send you the exact SQL commands after this meeting.',
        isActionItem: true,
        isTechnicalTerm: true,
        isResolution: true
      },
      {
        speaker: 'John Doe',
        text: 'This is extremely helpful! Should we also schedule a follow-up to monitor the improvements?',
        isActionItem: true,
        isTechnicalTerm: false,
        isResolution: false
      },
      {
        speaker: 'Dr. Sarah Chen',
        text: 'Absolutely. Let\'s schedule a follow-up in one week to review performance metrics and ensure the optimization is working as expected.',
        isActionItem: true,
        isTechnicalTerm: false,
        isResolution: true
      }
    ];

    let index = 0;
    const addTranscript = () => {
      if (index < demoTranscripts.length) {
        const segment = demoTranscripts[index];
        const newSegment: TranscriptionSegment = {
          id: `transcript-${Date.now()}-${index}`,
          timestamp: new Date(),
          speaker: segment.speaker,
          text: segment.text,
          confidence: 0.95,
          isActionItem: segment.isActionItem,
          isTechnicalTerm: segment.isTechnicalTerm,
          isResolution: segment.isResolution
        };

        setTranscription(prev => [...prev, newSegment]);

        // Update participant speaking status
        setCurrentMeeting(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            participants: prev.participants.map(p => ({
              ...p,
              isSpeaking: p.name === segment.speaker
            }))
          };
        });

        // Extract action items
        if (segment.isActionItem) {
          const actionItem: ActionItem = {
            id: `action-${Date.now()}`,
            description: segment.text,
            assignee: segment.speaker === 'Dr. Sarah Chen' ? 'John Doe' : 'Dr. Sarah Chen',
            priority: segment.isResolution ? 'high' : 'medium',
            status: 'pending',
            relatedToIssue: true
          };
          setActionItems(prev => [...prev, actionItem]);
        }

        index++;
        setTimeout(addTranscript, 8000 + Math.random() * 4000); // 8-12 seconds between messages
      } else {
        // Meeting completed
        setTimeout(() => {
          completeMeeting();
        }, 5000);
      }
    };

    addTranscript();
  };

  // Complete meeting and generate summary
  const completeMeeting = () => {
    setCurrentMeeting(prev => prev ? { ...prev, status: 'completed', endTime: new Date() } : null);
    setAiStatus('summarizing');
    setIsAIProcessing(true);

    setTimeout(() => {
      generateMeetingSummary();
    }, 3000);
  };

  // Generate comprehensive meeting summary
  const generateMeetingSummary = () => {
    const summary: MeetingSummary = {
      id: `summary-${Date.now()}`,
      meetingId: currentMeeting?.id || '',
      caseId: currentMeeting?.caseId || '',
      summary: 'Comprehensive HANA performance consultation successfully identified root cause of slowdowns during end-of-month reporting. Expert guidance provided on SQL optimization, memory management, and column store indexing. Customer demonstrated good understanding of recommended solutions.',
      keyPoints: [
        'HANA 2.0 SPS06 system experiencing 78% memory usage during normal operations',
        'Expensive SELECT queries on SALES_DATA table identified as primary performance bottleneck',
        'SQL trace analysis (ST05) revealed optimization opportunities',
        'Column store index recommendations provided for immediate implementation',
        'Memory-intensive queries causing end-of-month reporting delays'
      ],
      technicalSolutions: [
        {
          id: 'tech-sol-1',
          problem: 'Slow HANA database performance during reporting',
          solution: 'Optimize SQL queries and create column store indexes',
          steps: [
            'Run ST05 SQL trace during peak usage periods',
            'Identify expensive queries on SALES_DATA table',
            'Create column store indexes: CREATE COLUMN INDEX idx_sales_date ON SALES_DATA (sales_date)',
            'Monitor memory usage with M_HOST_RESOURCE_UTILIZATION',
            'Schedule regular performance reviews'
          ],
          category: 'HANA Performance',
          effectiveness: 85,
          applicableModules: ['SAP HANA', 'Reporting', 'SQL Optimization']
        }
      ],
      actionItems: actionItems.map(item => ({
        ...item,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
      })),
      nextSteps: [
        'Implement column store indexes on SALES_DATA table',
        'Monitor system performance for one week',
        'Schedule follow-up meeting to review improvements',
        'Document optimization results for knowledge base',
        'Consider additional memory allocation if needed'
      ],
      resolutionStatus: 'partial',
      participantFeedback: [
        {
          participantId: 'customer-1',
          rating: 5,
          comments: 'Extremely helpful session. Clear explanations and actionable solutions provided.',
          wouldRecommend: true
        }
      ],
      knowledgebaseUpdates: [
        {
          id: 'kb-update-1',
          category: 'HANA Performance',
          keywords: ['HANA', 'performance', 'SQL optimization', 'column store', 'memory usage'],
          solution: 'For HANA performance issues during reporting, check memory usage and optimize SQL queries with column store indexes',
          confidenceLevel: 0.92,
          usage: 'immediate'
        }
      ],
      customerSatisfactionScore: 95
    };

    setCurrentSummary(summary);
    setAiStatus('completed');
    setIsAIProcessing(false);
  };

  // Format meeting duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Export functionality
  const exportMeetingData = (format: 'pdf' | 'docx' | 'json') => {
    const exportData = {
      meeting: currentMeeting,
      transcription,
      summary: currentSummary,
      actionItems,
      exportDate: new Date(),
      format
    };
    
    // Simulate file download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${currentMeeting?.caseId}.${format === 'json' ? 'json' : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render Functions
  const renderMeetingView = () => (
    <div className="flex-1 p-6 space-y-6">
      {/* Meeting Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentMeeting?.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Case ID: {currentMeeting?.caseId}</span>
              <span>Duration: {formatDuration(meetingDuration)}</span>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentMeeting?.status === 'active' ? 'bg-green-100 text-green-800' :
                currentMeeting?.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {currentMeeting?.status?.toUpperCase()}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              aiStatus === 'listening' ? 'bg-green-100 text-green-800' :
              aiStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
              aiStatus === 'summarizing' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <Bot className="h-4 w-4" />
              <span className="text-sm font-medium">AI: {aiStatus.toUpperCase()}</span>
              {isAIProcessing && <RefreshCw className="h-4 w-4 animate-spin" />}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-3 rounded-lg transition-all ${
                  isRecording 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isRecording ? <Square className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Participants</h3>
          <div className="grid grid-cols-3 gap-4">
            {currentMeeting?.participants.map((participant) => (
              <div key={participant.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{participant.name}</span>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      participant.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    {participant.isSpeaking && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    participant.role === 'expert' ? 'bg-purple-100 text-purple-800' :
                    participant.role === 'customer' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {participant.role.replace('_', ' ').toUpperCase()}
                  </span>
                  <div className="flex space-x-1">
                    <Mic className={`h-4 w-4 ${participant.micMuted ? 'text-red-500' : 'text-green-500'}`} />
                    <Video className={`h-4 w-4 ${participant.videoOn ? 'text-green-500' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time AI Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">AI Real-time Insights</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Key Topics Detected</h4>
            <div className="flex flex-wrap gap-2">
              {['HANA Performance', 'SQL Optimization', 'Memory Management', 'Column Store'].map((topic) => (
                <span key={topic} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {topic}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Action Items Identified</h4>
            <div className="text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{actionItems.length} action items extracted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTranscriptionView = () => (
    <div className="flex-1 p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Live Transcription</h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>Live Recording</span>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
                <Download className="h-4 w-4 inline mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        <div 
          ref={transcriptionRef}
          className="flex-1 p-6 overflow-y-auto space-y-4"
        >
          {transcription.map((segment) => (
            <div key={segment.id} className="flex space-x-4">
              <div className="text-xs text-gray-500 w-16 flex-shrink-0 pt-1">
                {segment.timestamp.toLocaleTimeString()}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-900">{segment.speaker}</span>
                  <div className="flex space-x-1">
                    {segment.isActionItem && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                        Action
                      </span>
                    )}
                    {segment.isTechnicalTerm && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        Technical
                      </span>
                    )}
                    {segment.isResolution && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">
                        Solution
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{segment.text}</p>
                <div className="text-xs text-gray-500 mt-1">
                  Confidence: {Math.round(segment.confidence * 100)}%
                </div>
              </div>
            </div>
          ))}
          {isAIProcessing && (
            <div className="text-center py-8">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>AI is processing transcription...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSummaryView = () => {
    if (!currentSummary) {
      return (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary Not Ready</h3>
            <p className="text-gray-600 mb-4">Meeting summary will be generated when the meeting is completed</p>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>AI is analyzing meeting content...</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Summary Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Meeting Summary</h3>
            <div className="flex space-x-3">
              <button 
                onClick={() => exportMeetingData('pdf')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>PDF</span>
              </button>
              <button 
                onClick={() => exportMeetingData('docx')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Word</span>
              </button>
              <button 
                onClick={() => exportMeetingData('json')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>JSON</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentSummary.customerSatisfactionScore}%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentSummary.actionItems.length}</div>
              <div className="text-sm text-gray-600">Action Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{currentSummary.technicalSolutions.length}</div>
              <div className="text-sm text-gray-600">Solutions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{currentSummary.knowledgebaseUpdates.length}</div>
              <div className="text-sm text-gray-600">KB Updates</div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Executive Summary</h4>
            <p className="text-gray-700 leading-relaxed">{currentSummary.summary}</p>
          </div>
        </div>

        {/* Key Points */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Key Points Discussed</h4>
          <div className="space-y-3">
            {currentSummary.keyPoints.map((point, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Solutions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Technical Solutions Provided</h4>
          {currentSummary.technicalSolutions.map((solution) => (
            <div key={solution.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold text-gray-900">{solution.problem}</h5>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                    {solution.effectiveness}% Effective
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{solution.solution}</p>
              <div className="mb-3">
                <h6 className="font-medium text-gray-900 mb-2">Implementation Steps:</h6>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  {solution.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="flex flex-wrap gap-2">
                {solution.applicableModules.map((module) => (
                  <span key={module} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                    {module}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Action Items</h4>
          <div className="space-y-3">
            {currentSummary.actionItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{item.description}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span>Assigned to: {item.assignee}</span>
                    {item.dueDate && (
                      <span>Due: {item.dueDate.toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.priority === 'high' ? 'bg-red-100 text-red-800' :
                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.status === 'completed' ? 'bg-green-100 text-green-800' :
                    item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Next Steps</h4>
          <div className="space-y-2">
            {currentSummary.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDocumentationView = () => (
    <div className="flex-1 p-6 space-y-6">
      {/* Knowledge Base Updates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Knowledge Base Training Data</h3>
          </div>
          <div className="flex space-x-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Deploy to Training</span>
            </button>
          </div>
        </div>

        {currentSummary?.knowledgebaseUpdates.map((update) => (
          <div key={update.id} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">{update.category}</h4>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                  {Math.round(update.confidenceLevel * 100)}% Confidence
                </span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  update.usage === 'immediate' ? 'bg-green-100 text-green-800' :
                  update.usage === 'review' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {update.usage.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{update.solution}</p>
            <div>
              <span className="text-sm font-medium text-gray-900">Keywords: </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {update.keywords.map((keyword) => (
                  <span key={keyword} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Training Impact */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="h-6 w-6 text-green-600" />
          <h4 className="text-lg font-bold text-gray-900">Training Impact Analysis</h4>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">+12%</div>
            <div className="text-sm text-gray-600">Expected Resolution Improvement</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
            <div className="text-sm text-gray-600">New Solution Patterns Identified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">95%</div>
            <div className="text-sm text-gray-600">Knowledge Confidence Level</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white rounded-lg">
          <h5 className="font-semibold text-gray-900 mb-2">Chatbot Training Benefits:</h5>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>HANA performance optimization patterns added to AI knowledge</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>SQL troubleshooting decision tree enhanced</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Expert escalation criteria refined based on successful resolution</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Customer communication patterns improved for technical explanations</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Future Meeting Suggestions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-4">AI Recommendations for Future Cases</h4>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-semibold text-blue-900 mb-2">Similar Case Pattern Detected</h5>
            <p className="text-blue-800 text-sm">
              For future HANA performance cases, AI can now provide immediate SQL optimization guidance 
              before expert escalation, potentially reducing resolution time by 40%.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h5 className="font-semibold text-green-900 mb-2">Proactive Monitoring Suggestion</h5>
            <p className="text-green-800 text-sm">
              Recommend implementing automated alerts for memory usage above 75% to prevent similar issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate('support')}
              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">AI Meeting Assistant</h1>
                <p className="text-sm text-gray-600">Real-time Analysis & Documentation</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('meeting')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                currentView === 'meeting' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Video className="h-4 w-4 inline mr-2" />
              Meeting
            </button>
            <button
              onClick={() => setCurrentView('transcription')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                currentView === 'transcription' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Transcript
            </button>
            <button
              onClick={() => setCurrentView('summary')}
              disabled={!currentSummary}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                currentView === 'summary' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Summary
            </button>
            <button
              onClick={() => setCurrentView('documentation')}
              disabled={!currentSummary}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                currentView === 'documentation' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              Training
            </button>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">AI Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {currentView === 'meeting' && renderMeetingView()}
      {currentView === 'transcription' && renderTranscriptionView()}
      {currentView === 'summary' && renderSummaryView()}
      {currentView === 'documentation' && renderDocumentationView()}
    </div>
  );
};

export default AIMeetingAssistant;

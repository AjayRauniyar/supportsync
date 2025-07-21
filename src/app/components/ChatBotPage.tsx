import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, ArrowLeft, Send, User, Users, Calendar, Clock, Video, Phone,
  CheckCircle, AlertTriangle, Zap, Shield, Settings, Star, Mail,
  ChevronLeft, ChevronRight, Plus, X, MapPin, Globe, Target,
  MessageSquare, FileText, Award, Briefcase, TrendingUp
} from 'lucide-react';

// Types and Interfaces
interface Message {
  id: string;
  type: 'user' | 'bot' | 'system' | 'expert' | 'meeting';
  content: string;
  timestamp: Date;
  expertId?: string;
  meetingInfo?: MeetingInfo;
}

interface Expert {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  availability: 'available' | 'busy' | 'away' | 'offline';
  timezone: string;
  location: string;
  rating: number;
  responseTime: string;
  avatar: string;
  workload: number;
  calendar: CalendarSlot[];
}

interface CalendarSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  type?: 'meeting' | 'busy' | 'free';
  title?: string;
  participantCount?: number;
}

interface MeetingInfo {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  participants: Participant[];
  meetingLink: string;
  status: 'scheduled' | 'active' | 'completed';
  aiAssistant: boolean;
}

interface Participant {
  name: string;
  email: string;
  role: 'expert' | 'customer' | 'ai_assistant';
  status: 'accepted' | 'pending' | 'declined';
}

interface TransferredData {
  ticketId: string;
  customerInfo: {
    name: string;
    email: string;
    company: string;
  };
  issueDetails: {
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    components: string[];
    module: string;
  };
  conversationHistory: any[];
  redirectReason: string;
  timestamp: Date;
}

// Mock Expert Data with Calendar Availability
const EXPERTS_DATABASE: Expert[] = [
  {
    id: 'exp-001',
    name: 'Dr. Sarah Chen',
    title: 'Senior SAP HANA Architect',
    expertise: ['SAP HANA', 'Performance Optimization', 'Database Administration', 'System Architecture'],
    availability: 'available',
    timezone: 'UTC+8 (Singapore)',
    location: 'Singapore',
    rating: 4.9,
    responseTime: '< 10 min',
    avatar: 'SC',
    workload: 65,
    calendar: [
      { id: '1', date: '2025-07-21', startTime: '09:00', endTime: '10:00', isAvailable: true },
      { id: '2', date: '2025-07-21', startTime: '14:00', endTime: '15:00', isAvailable: true },
      { id: '3', date: '2025-07-21', startTime: '16:00', endTime: '17:00', isAvailable: false, type: 'meeting', title: 'Client Architecture Review', participantCount: 3 },
      { id: '4', date: '2025-07-22', startTime: '10:00', endTime: '11:00', isAvailable: true },
      { id: '5', date: '2025-07-22', startTime: '15:00', endTime: '16:00', isAvailable: true },
      { id: '6', date: '2025-07-23', startTime: '09:00', endTime: '10:00', isAvailable: true },
      { id: '7', date: '2025-07-23', startTime: '11:00', endTime: '12:00', isAvailable: false, type: 'busy', title: 'Team Standup' }
    ]
  },
  {
    id: 'exp-002',
    name: 'Michael Rodriguez',
    title: 'S/4HANA Migration Specialist',
    expertise: ['S/4HANA Migration', 'FICO Module', 'System Integration', 'Business Process'],
    availability: 'available',
    timezone: 'UTC-5 (New York)',
    location: 'New York, USA',
    rating: 4.8,
    responseTime: '< 15 min',
    avatar: 'MR',
    workload: 45,
    calendar: [
      { id: '8', date: '2025-07-21', startTime: '10:00', endTime: '11:00', isAvailable: true },
      { id: '9', date: '2025-07-21', startTime: '13:00', endTime: '14:00', isAvailable: false, type: 'meeting', title: 'S/4HANA Workshop', participantCount: 8 },
      { id: '10', date: '2025-07-21', startTime: '15:00', endTime: '16:00', isAvailable: true },
      { id: '11', date: '2025-07-22', startTime: '09:00', endTime: '10:00', isAvailable: true },
      { id: '12', date: '2025-07-22', startTime: '14:00', endTime: '15:00', isAvailable: true },
      { id: '13', date: '2025-07-23', startTime: '16:00', endTime: '17:00', isAvailable: false, type: 'busy', title: 'Planning Session' }
    ]
  },
  {
    id: 'exp-003',
    name: 'Priya Sharma',
    title: 'BTP Integration Expert',
    expertise: ['SAP BTP', 'Cloud Integration', 'API Management', 'Microservices'],
    availability: 'busy',
    timezone: 'UTC+5:30 (India)',
    location: 'Bangalore, India',
    rating: 4.7,
    responseTime: '< 20 min',
    avatar: 'PS',
    workload: 80,
    calendar: [
      { id: '14', date: '2025-07-21', startTime: '11:00', endTime: '12:00', isAvailable: false, type: 'meeting', title: 'BTP Demo', participantCount: 5 },
      { id: '15', date: '2025-07-21', startTime: '17:00', endTime: '18:00', isAvailable: true },
      { id: '16', date: '2025-07-22', startTime: '16:00', endTime: '17:00', isAvailable: true },
      { id: '17', date: '2025-07-23', startTime: '10:00', endTime: '11:00', isAvailable: true }
    ]
  }
];

// Main Component
const SAPSupportChatbot: React.FC<{
  onNavigate: (page: string) => void;
  transferredData?: TransferredData;
}> = ({ onNavigate, transferredData }) => {
  
  // State Management
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'experts' | 'calendar' | 'meeting-summary'>('chat');
  const [selectedExperts, setSelectedExperts] = useState<Expert[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [caseAnalysis, setCaseAnalysis] = useState<TransferredData | null>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<CalendarSlot | null>(null);
  const [meetingDuration, setMeetingDuration] = useState<30 | 60 | 90>(60);
  const [scheduledMeeting, setScheduledMeeting] = useState<MeetingInfo | null>(null);
  const [conversationStage, setConversationStage] = useState<
    'initial' | 'analyzing' | 'expert_matching' | 'calendar_view' | 'meeting_scheduled' | 'completed'
  >('initial');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with transferred data
  useEffect(() => {
    if (transferredData && messages.length === 0) {
      initializeWithTransferredData(transferredData);
    } else if (messages.length === 0) {
      addMessage('bot', 
        '👋 **Welcome to SAP Support Center**\n\n' +
        'I help connect customers with SAP experts and schedule consultations.\n\n' +
        '**My capabilities:**\n' +
        '• 🎯 Expert matching based on case analysis\n' +
        '• 📅 Microsoft-style calendar integration\n' +
        '• 🤖 AI meeting assistant\n' +
        '• 📄 Automatic documentation\n\n' +
        'How can I assist you today?'
      );
    }
  }, [transferredData]);

useEffect(() => {
  // Smooth scroll to bottom with proper timing
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  // Delay scroll slightly to ensure content is rendered
  const timeoutId = setTimeout(scrollToBottom, 100);
  
  return () => clearTimeout(timeoutId);
}, [messages]);


  // Helper Functions
  const addMessage = (type: 'user' | 'bot' | 'system' | 'expert' | 'meeting', content: string, data?: any) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: new Date(),
      ...data
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const initializeWithTransferredData = (data: TransferredData) => {
    setCaseAnalysis(data);
    setConversationStage('analyzing');
    
    addMessage('system', 
      `📋 **Case Received from Customer Support**\n\n` +
      `**Ticket ID:** ${data.ticketId}\n` +
      `**Customer:** ${data.customerInfo.name} (${data.customerInfo.company})\n` +
      `**Priority:** ${data.issueDetails.priority.toUpperCase()}\n` +
      `**Module:** ${data.issueDetails.module}\n` +
      `**Components:** ${data.issueDetails.components.join(', ')}\n` +
      `**Issue:** ${data.issueDetails.description.substring(0, 100)}...\n\n` +
      `🔍 **Reason:** ${data.redirectReason}\n` +
      `📅 **Received:** ${data.timestamp.toLocaleString()}`
    );

    // Start AI analysis
    setTimeout(() => {
      performCaseAnalysis(data);
    }, 2000);
  };

  const performCaseAnalysis = (data: TransferredData) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const matchedExperts = findMatchingExperts(data.issueDetails.components, data.issueDetails.category, data.issueDetails.priority);
      setSelectedExperts(matchedExperts);
      
      addMessage('bot',
        `🎯 **AI Analysis Complete**\n\n` +
        `**Case Assessment:**\n` +
        `• **Complexity Level:** ${getComplexityLevel(data.issueDetails.priority)}\n` +
        `• **Estimated Resolution:** ${getEstimatedResolution(data.issueDetails.priority)}\n` +
        `• **Required Expertise:** ${data.issueDetails.components.join(', ')}\n` +
        `• **Business Impact:** ${getBusinessImpact(data.issueDetails.priority)}\n\n` +
        `**🏆 Top ${matchedExperts.length} Expert Matches:**\n\n` +
        matchedExperts.map((expert, index) => 
          `**${index + 1}. ${expert.name}** ⭐${expert.rating}\n` +
          `   • ${expert.title}\n` +
          `   • Expertise: ${expert.expertise.slice(0, 2).join(', ')}\n` +
          `   • Location: ${expert.location}\n` +
          `   • Response Time: ${expert.responseTime}\n` +
          `   • Workload: ${expert.workload}% | Status: ${expert.availability.toUpperCase()}\n`
        ).join('\n') +
        `\n**Next Steps:**\n` +
        `• 📅 **Schedule Expert Consultation**\n` +
        `• 💬 **Start Immediate Chat Session**\n` +
        `• 🚨 **Request Priority Callback**`
      );
      
      setConversationStage('expert_matching');
      setCurrentView('experts');
      setIsTyping(false);
    }, 3000);
  };

  const findMatchingExperts = (components: string[], category: string, priority: string): Expert[] => {
    // Advanced matching algorithm
    const scoredExperts = EXPERTS_DATABASE.map(expert => ({
      expert,
      score: calculateExpertScore(expert, components, category, priority)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

    return scoredExperts.map(item => item.expert);
  };

  const calculateExpertScore = (expert: Expert, components: string[], category: string, priority: string): number => {
    let score = 0;
    
    // Expertise matching (40%)
    const expertiseMatches = expert.expertise.filter(skill => 
      components.some(comp => skill.toLowerCase().includes(comp.toLowerCase())) ||
      skill.toLowerCase().includes(category.toLowerCase())
    ).length;
    score += (expertiseMatches / expert.expertise.length) * 40;
    
    // Availability (25%)
    const availabilityScore = expert.availability === 'available' ? 25 : 
                             expert.availability === 'busy' ? 15 : 5;
    score += availabilityScore;
    
    // Performance metrics (20%)
    score += (expert.rating / 5) * 20;
    
    // Workload balance (10%)
    score += Math.max(10 - (expert.workload / 10), 0);
    
    // Response time (5%)
    const responseScore = expert.responseTime.includes('<10') ? 5 :
                         expert.responseTime.includes('<15') ? 4 :
                         expert.responseTime.includes('<20') ? 3 : 2;
    score += responseScore;

    return score;
  };

  const getComplexityLevel = (priority: string): string => {
    switch (priority) {
      case 'critical': return 'High - Multi-system impact';
      case 'high': return 'Medium-High - Specialized knowledge required';
      case 'medium': return 'Medium - Standard troubleshooting';
      default: return 'Low - Routine support';
    }
  };

  const getEstimatedResolution = (priority: string): string => {
    switch (priority) {
      case 'critical': return '1-2 hours with expert team';
      case 'high': return '2-4 hours with specialist';
      case 'medium': return '4-8 hours standard resolution';
      default: return '1-2 business days';
    }
  };

  const getBusinessImpact = (priority: string): string => {
    switch (priority) {
      case 'critical': return 'High - Production systems affected';
      case 'high': return 'Medium - Business processes impacted';
      case 'medium': return 'Low-Medium - Operational efficiency';
      default: return 'Low - Minor inconvenience';
    }
  };

  // Calendar Functions
  const generateCalendarDays = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getAvailableSlots = (expert: Expert, date: string): CalendarSlot[] => {
    return expert.calendar.filter(slot => 
      slot.date === date && slot.isAvailable
    );
  };

  const handleScheduleMeeting = async () => {
    if (!selectedExpert || !selectedTimeSlot || !caseAnalysis) {
      addMessage('bot', '❌ Please select an expert, date, and time slot first.');
      return;
    }

    const meetingId = `meeting-${Date.now()}`;
    const participants: Participant[] = [
      {
        name: selectedExpert.name,
        email: `${selectedExpert.name.toLowerCase().replace(' ', '.')}@sapexperts.com`,
        role: 'expert',
        status: 'accepted'
      },
      {
        name: caseAnalysis.customerInfo.name,
        email: caseAnalysis.customerInfo.email,
        role: 'customer', 
        status: 'pending'
      },
      {
        name: 'SAP AI Assistant',
        email: 'ai-assistant@sapexperts.com',
        role: 'ai_assistant',
        status: 'accepted'
      }
    ];

    const meeting: MeetingInfo = {
      id: meetingId,
      title: `SAP Expert Consultation - ${caseAnalysis.ticketId}`,
      date: selectedDate,
      time: selectedTimeSlot.startTime,
      duration: meetingDuration,
      participants,
      meetingLink: `https://teams.microsoft.com/l/meetup-join/${meetingId}`,
      status: 'scheduled',
      aiAssistant: true
    };

    setScheduledMeeting(meeting);
    
    addMessage('system',
      `✅ **Meeting Successfully Scheduled**\n\n` +
      `**📅 Meeting Details:**\n` +
      `• **Title:** ${meeting.title}\n` +
      `• **Expert:** ${selectedExpert.name} (${selectedExpert.title})\n` +
      `• **Date:** ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n` +
      `• **Time:** ${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime} (${selectedExpert.timezone})\n` +
      `• **Duration:** ${meetingDuration} minutes\n` +
      `• **Meeting ID:** ${meetingId}\n\n` +
      `**👥 Participants:**\n` +
      participants.map(p => `• ${p.name} (${p.role})`).join('\n') +
      `\n\n**🔗 Join Link:** [Microsoft Teams Meeting](${meeting.meetingLink})\n\n` +
      `**📧 Calendar Invitations Sent To:**\n` +
      `• ${caseAnalysis.customerInfo.email} (Customer Support Engineer)\n` +
      `• ${selectedExpert.name.toLowerCase().replace(' ', '.')}@sapexperts.com (Expert)\n\n` +
      `**🤖 AI Meeting Assistant Features:**\n` +
      `• Real-time meeting transcription\n` +
      `• Automatic action items extraction\n` +
      `• Technical documentation generation\n` +
      `• Post-meeting summary report\n` +
      `• Knowledge base training data collection`
    );

    addMessage('meeting',
      `🎉 **Meeting Setup Complete!**\n\n` +
      `The customer will receive:\n` +
      `• 📧 Outlook calendar invitation\n` +
      `• 🔔 15-minute reminder notification\n` +
      `• 📱 SMS reminder (if mobile provided)\n` +
      `• 📋 Pre-meeting preparation email\n\n` +
      `Our AI assistant will:\n` +
      `• Join 5 minutes early for setup\n` +
      `• Monitor audio quality and connection\n` +
      `• Take comprehensive meeting notes\n` +
      `• Generate action items and next steps\n` +
      `• Create technical documentation\n` +
      `• Update the knowledge base for future cases\n\n` +
      `**Meeting is now confirmed and all systems are ready!** 🚀`,
      { meetingInfo: meeting }
    );

    setConversationStage('meeting_scheduled');
    setTimeout(() => {
      simulateAIMeetingProcess();
    }, 5000);
  };

  const simulateAIMeetingProcess = () => {
    addMessage('bot',
      `🤖 **AI Meeting Assistant Activated**\n\n` +
      `**Pre-Meeting Setup:**\n` +
      `• Meeting room prepared with case context ✅\n` +
      `• Technical documentation templates ready ✅\n` +
      `• Screen sharing and recording enabled ✅\n` +
      `• Real-time transcription activated ✅\n\n` +
      `**During Meeting:**\n` +
      `• AI will join silently and monitor\n` +
      `• Automatic note-taking and action item detection\n` +
      `• Real-time technical term recognition\n` +
      `• Solution tracking and validation\n\n` +
      `**Post-Meeting:**\n` +
      `• Comprehensive meeting summary\n` +
      `• Action items with deadlines\n` +
      `• Technical solution documentation\n` +
      `• Knowledge base updates\n` +
      `• Customer follow-up scheduling\n\n` +
      `The meeting is all set! Is there anything else you need help with?`
    );
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    addMessage('user', inputText);
    const userInput = inputText;
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      if (userInput.toLowerCase().includes('schedule') || userInput.toLowerCase().includes('calendar')) {
        if (selectedExperts.length > 0) {
          addMessage('bot', 'Great! Let me help you schedule a meeting. Please select an expert from the recommended list first, then we can view their calendar availability.');
          setCurrentView('experts');
        } else {
          addMessage('bot', 'To schedule a meeting, I first need to analyze a case and match you with suitable experts. Please provide case details or transfer a case from customer support.');
        }
      } else if (userInput.toLowerCase().includes('expert') || userInput.toLowerCase().includes('match')) {
        if (caseAnalysis) {
          addMessage('bot', `Based on case ${caseAnalysis.ticketId}, I've already identified the best expert matches. Would you like to schedule a consultation with one of them?`);
          setCurrentView('experts');
        } else {
          addMessage('bot', 'I need case details to match you with the right experts. Please transfer a case from customer support or provide case information.');
        }
      } else {
        addMessage('bot', `I understand you're asking about: "${userInput}"\n\nI can help you with:\n• Expert matching and scheduling\n• Calendar management\n• Meeting coordination\n• Case analysis\n\nWhat would you like to focus on?`);
      }
      setIsTyping(false);
    }, 1200);
  };

 const renderChatView = () => (
  <div className="flex-1 flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
    {/* Chat Messages Container - Fixed Height and Scroll */}
    <div 
      className="flex-1 overflow-y-auto bg-transparent"
      style={{
        minHeight: 0, // Critical for flex scrolling
        maxHeight: 'calc(100vh - 200px)', // Prevent full screen takeover
        scrollBehavior: 'smooth'
      }}
    >
      <div className="p-6 space-y-4 min-h-full">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-4 py-3 shadow-sm ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : message.type === 'system'
                  ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-800 border border-purple-200'
                  : message.type === 'meeting'
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200'
                    : 'bg-white text-gray-800 border border-gray-200'
            }`}>
              <div className="flex items-start space-x-3">
                {message.type !== 'user' && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    message.type === 'system' ? 'bg-purple-500' :
                    message.type === 'meeting' ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    {message.type === 'system' ? <Shield className="h-4 w-4 text-white" /> :
                     message.type === 'meeting' ? <Video className="h-4 w-4 text-white" /> :
                     <Bot className="h-4 w-4 text-white" />}
                  </div>
                )}
                <div className="flex-1">
                  <div 
                    className="text-sm leading-relaxed whitespace-pre-line break-words"
                    style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                    dangerouslySetInnerHTML={{ 
                      __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }}
                  />
                  <p className="text-xs opacity-70 mt-3">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-purple-500 animate-spin" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Scroll anchor - always at bottom */}
        <div ref={messagesEndRef} className="h-1" />
      </div>
    </div>

    {/* Input Area - Fixed at Bottom */}
    <div className="border-t bg-white/80 backdrop-blur-sm p-4 flex-shrink-0">
      <div className="flex space-x-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask about expert matching, scheduling, or case analysis..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);

       


  const renderExpertSelection = () => (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Selection</h3>
        <p className="text-gray-600">Choose from AI-matched experts based on case analysis</p>
      </div>

      <div className="space-y-4">
        {selectedExperts.map((expert, index) => (
          <div 
            key={expert.id}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedExpert?.id === expert.id 
                ? 'border-purple-500 bg-purple-50 shadow-lg' 
                : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
            }`}
            onClick={() => setSelectedExpert(expert)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {expert.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{expert.name}</h4>
                  <p className="text-purple-600 font-medium">{expert.title}</p>
                  <p className="text-sm text-gray-600">{expert.location}</p>
                  <p className="text-xs text-gray-500">{expert.timezone}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-bold text-gray-900">{expert.rating}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{expert.responseTime}</p>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  expert.availability === 'available' ? 'bg-green-100 text-green-800' :
                  expert.availability === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {expert.availability.toUpperCase()}
                </div>
                <div className="mt-2">
                  <div className="text-xs text-gray-600 mb-1">Workload: {expert.workload}%</div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        expert.workload > 75 ? 'bg-red-500' : 
                        expert.workload > 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${expert.workload}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-700 mb-3">
                <strong>Expertise:</strong> {expert.expertise.join(' • ')}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Match Score: {Math.round(calculateExpertScore(expert, caseAnalysis?.issueDetails.components || [], caseAnalysis?.issueDetails.category || '', caseAnalysis?.issueDetails.priority || 'medium'))}%</span>
                <span>Available Slots: {expert.calendar.filter(slot => slot.isAvailable).length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => setCurrentView('calendar')}
          disabled={!selectedExpert}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          <Calendar className="h-5 w-5" />
          <span>View Calendar & Schedule</span>
        </button>
        <button
          onClick={() => setCurrentView('chat')}
          className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-700 transition-all flex items-center justify-center space-x-2"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Back to Chat</span>
        </button>
      </div>
    </div>
  );

  const renderCalendarView = () => {
    if (!selectedExpert) {
      return (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Expert Selected</h3>
            <p className="text-gray-600 mb-4">Please select an expert first to view their calendar availability</p>
            <button
              onClick={() => setCurrentView('experts')}
              className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-all"
            >
              Select Expert
            </button>
          </div>
        </div>
      );
    }

    const calendarDays = generateCalendarDays(calendarDate);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Schedule with {selectedExpert.name}
            </h3>
            <p className="text-purple-600 font-medium">{selectedExpert.title}</p>
            <p className="text-sm text-gray-600">{selectedExpert.location} • {selectedExpert.timezone}</p>
          </div>
          <button
            onClick={() => setCurrentView('experts')}
            className="text-purple-600 hover:text-purple-800 flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Change Expert</span>
          </button>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <button
            onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h4 className="text-2xl font-bold text-gray-900">
            {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
          </h4>
          <button
            onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
            {weekDays.map((day) => (
              <div key={day} className="p-4 text-center text-sm font-semibold text-gray-700 bg-gray-50">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0">
            {calendarDays.map((day, index) => {
              const dateString = formatDate(day);
              const isCurrentMonth = day.getMonth() === calendarDate.getMonth();
              const isToday = formatDate(day) === formatDate(new Date());
              const isSelected = selectedDate === dateString;
              const availableSlots = getAvailableSlots(selectedExpert, dateString);
              const hasAvailability = availableSlots.length > 0;
              const isPastDate = day < new Date();

              return (
                <div
                  key={index}
                  className={`relative p-4 h-16 border-b border-r border-gray-200 cursor-pointer transition-all ${
                    !isCurrentMonth || isPastDate ? 'text-gray-300 bg-gray-50' :
                    isSelected ? 'bg-purple-600 text-white' :
                    isToday ? 'bg-blue-100 text-blue-800 font-semibold' :
                    hasAvailability ? 'hover:bg-purple-50 text-gray-900' :
                    'text-gray-400'
                  }`}
                  onClick={() => {
                    if (isCurrentMonth && hasAvailability && !isPastDate) {
                      setSelectedDate(dateString);
                    }
                  }}
                >
                  <span className="text-lg font-medium">{day.getDate()}</span>
                  {hasAvailability && isCurrentMonth && !isPastDate && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {availableSlots.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      ))}
                      {availableSlots.length > 3 && <span className="text-xs">+</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h5 className="text-lg font-bold text-gray-900">
                Available Times - {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h5>
              <div className="text-sm text-gray-600">
                {selectedExpert.timezone}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {getAvailableSlots(selectedExpert, selectedDate).map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`p-4 text-sm border-2 rounded-xl font-medium transition-all ${
                    selectedTimeSlot?.id === slot.id
                      ? 'bg-purple-600 text-white border-purple-600 shadow-lg'
                      : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50 text-gray-700'
                  }`}
                >
                  <div className="font-semibold">{slot.startTime}</div>
                  <div className="text-xs opacity-70">to {slot.endTime}</div>
                </button>
              ))}
            </div>

            {/* Meeting Duration Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Meeting Duration
              </label>
              <div className="flex space-x-3">
                {[30, 60, 90].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setMeetingDuration(duration as 30 | 60 | 90)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      meetingDuration === duration
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {duration} min
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule Button */}
            {selectedTimeSlot && (
              <div className="border-t pt-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-4">
                  <h6 className="font-semibold text-gray-900 mb-2">Meeting Summary</h6>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>Expert: {selectedExpert.name}</div>
                    <div>Date: {new Date(selectedDate).toLocaleDateString()}</div>
                    <div>Time: {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime} ({selectedExpert.timezone})</div>
                    <div>Duration: {meetingDuration} minutes</div>
                    <div>Case: {caseAnalysis?.ticketId}</div>
                  </div>
                </div>
                
                <button
                  onClick={handleScheduleMeeting}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Schedule Meeting with AI Assistant</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate('home')}
              className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-50 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">SAP Support Center</h1>
                <p className="text-sm text-gray-600">Expert Matching & Meeting Scheduler</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('chat')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                currentView === 'chat' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Chat
            </button>
            <button
              onClick={() => setCurrentView('experts')}
              disabled={selectedExperts.length === 0}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                currentView === 'experts' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Experts
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              disabled={!selectedExpert}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                currentView === 'calendar' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Calendar
            </button>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-4">
            {caseAnalysis && (
              <div className="bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                <span className="text-sm font-medium text-purple-700">
                  Case: {caseAnalysis.ticketId}
                </span>
              </div>
            )}
            {scheduledMeeting && (
              <div className="bg-green-100 px-3 py-1 rounded-full border border-green-200">
                <span className="text-sm font-medium text-green-700">
                  Meeting Scheduled
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">AI Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {currentView === 'chat' && renderChatView()}
      {currentView === 'experts' && renderExpertSelection()}
      {currentView === 'calendar' && renderCalendarView()}
    </div>
  );
};

export default SAPSupportChatbot;

import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Bot, ArrowLeft, Send, User, Users, Search, AlertCircle, Zap,
  Clock, ChevronRight, Sparkles, BookOpen, MessageSquare, Layers,
  Ticket, Wrench, LifeBuoy, FileText, Cpu, Database, Shield, AlertTriangle
} from 'lucide-react';

type MessageType = 'user' | 'bot' | 'system' | 'support';
type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: string;
  context?: any;
}

interface CaseDetails {
  description: string;
  priority: PriorityLevel;
  module: string;
  components: string[];
  errorCodes: string[];
  environment: string;
  businessImpact: string;
  solutionAttempted?: string;
}

interface Expert {
  id: string;
  name: string;
  expertise: string[];
  availability: 'online' | 'offline' | 'busy';
  rating: number;
  responseTime: string;
  resolutionRate: number;
  pastCases: string[];
}

interface Solution {
  id: string;
  description: string;
  steps: string[];
  successRate: number;
  requiresApproval: boolean;
  components: string[];
}

const SAP_MODULES = ['S/4HANA', 'FICO', 'MM', 'SD', 'BASIS', 'HANA', 'BTP', 'SuccessFactors', 'Ariba', 'EWM', 'PP', 'QM'];
const SAP_COMPONENTS = ['Authorization', 'Performance', 'Integration', 'Data Migration', 'Upgrade', 'Custom Code', 'Configuration', 'Reporting'];
const ENVIRONMENTS = ['Production', 'Development', 'Quality', 'Sandbox'];
const PRIORITIES: PriorityLevel[] = ['low', 'medium', 'high', 'critical'];

const KNOWLEDGE_BASE: Solution[] = [
  {
    id: 'sol-001',
    description: "ST22 Dump Resolution - Authorization Issues",
    steps: [
      "1. Check error details in transaction ST22 for exact authorization object",
      "2. Review user authorizations in SU01 for affected user",
      "3. Compare with working user using SUIM comparison",
      "4. Check authorization defaults in SU24 for the transaction",
      "5. If custom program, verify AUTHORITY-CHECK statements"
    ],
    successRate: 85,
    requiresApproval: false,
    components: ['Authorization']
  },
  {
    id: 'sol-002',
    description: "HANA Backup Failure - Database Issues",
    steps: [
      "1. Verify backup configuration in DB13 for correct parameters",
      "2. Check HANA studio for storage alerts and available space",
      "3. Review backup logs for specific error codes",
      "4. Validate backup user authorizations in HANA cockpit",
      "5. Check for locks or running processes during backup window"
    ],
    successRate: 78,
    requiresApproval: true,
    components: ['Database']
  },
  {
    id: 'sol-003',
    description: "Performance Issues - System Slowdown",
    steps: [
      "1. Run ST05 for SQL trace during peak times",
      "2. Check ST12 for workload analysis and expensive queries",
      "3. Review ST04 for database performance metrics",
      "4. Analyze statistics with ST03N for transaction response times",
      "5. Check for system locks in SM12 and update statistics in DB13"
    ],
    successRate: 72,
    requiresApproval: false,
    components: ['Performance']
  }
];

const EXPERTS: Expert[] = [
  { 
    id: 'exp-001', 
    name: "Dr. Sarah Chen", 
    expertise: ["SAP HANA", "BASIS", "Performance"], 
    availability: "online", 
    rating: 4.9, 
    responseTime: "<15 min",
    resolutionRate: 92,
    pastCases: ["PERF-2023-0456", "DB-2023-0789"]
  },
  { 
    id: 'exp-002', 
    name: "Michael Rodriguez", 
    expertise: ["S/4HANA", "FICO", "Authorization"], 
    availability: "online", 
    rating: 4.8, 
    responseTime: "<30 min",
    resolutionRate: 89,
    pastCases: ["AUTH-2023-0123", "FI-2023-0345"]
  },
  { 
    id: 'exp-003', 
    name: "Priya Sharma", 
    expertise: ["BTP", "Integration", "Data Migration"], 
    availability: "busy", 
    rating: 4.7, 
    responseTime: "1-2 hrs",
    resolutionRate: 85,
    pastCases: ["INT-2023-0567", "BTP-2023-0678"]
  },
  { 
    id: 'exp-004', 
    name: "David Kim", 
    expertise: ["MM", "SD", "Configuration"], 
    availability: "online", 
    rating: 4.6, 
    responseTime: "<45 min",
    resolutionRate: 87,
    pastCases: ["MM-2023-0890", "SD-2023-0912"]
  }
];

const SAPSupportChatbot = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [caseDetails, setCaseDetails] = useState<Partial<CaseDetails>>({});
  const [conversationStage, setConversationStage] = useState<
    'welcome' | 'problem_description' | 'analysis' | 
    'solution' | 'solution_feedback' | 'escalation' | 
    'support_review' | 'support_engineer_selection' | 'expert_selection' | 'resolution'
  >('welcome');
  const [identifiedComponents, setIdentifiedComponents] = useState<string[]>([]);
  const [selectedExperts, setSelectedExperts] = useState<Expert[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0 && conversationStage === 'welcome') {
      addMessage('bot', `🚀 Welcome to SAP Support Assistant! I'm here to help you resolve SAP issues efficiently.\n\nPlease describe your problem in detail including:\n- Transaction codes involved\n- Error messages\n- Business impact\n- Steps to reproduce\n\nFor example: "We're getting authorization errors in transaction VA01 when creating sales orders, with error message BS813."`);
      setConversationStage('problem_description');
    }
  }, [conversationStage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const addMessage = (type: MessageType, content: string, context?: any) => {
    setMessages(prev => [...prev, {
      id: uuidv4(),
      type,
      content,
      timestamp: formatTime(),
      context
    }]);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = inputText;
    addMessage('user', userMessage);
    setInputText('');

    switch (conversationStage) {
      case 'problem_description':
        handleProblemDescription(userMessage);
        break;
      case 'solution_feedback':
        handleSolutionFeedback(userMessage);
        break;
      case 'support_engineer_selection':
        handleSupportEngineerChoice(userMessage);
        break;
      case 'expert_selection':
        addMessage('bot', "The experts are now working on your case. We'll notify you when we have updates.");
        break;
      case 'support_review':
        addMessage('bot', "Please wait while the support engineer reviews your case.");
        break;
      default:
        if (conversationStage === 'welcome' || conversationStage === 'analysis') {
          addMessage('bot', "Please follow the current process to describe your issue.");
        } else {
          addMessage('bot', "I've noted your response. Let me check how to proceed...");
        }
    }
  };

  const handleProblemDescription = (description: string) => {
    const components = detectComponents(description);
    setIdentifiedComponents(components);
    
    setCaseDetails({
      description,
      priority: detectPriority(description),
      module: detectModule(description),
      components,
      errorCodes: detectErrorCodes(description)
    });

    setIsTyping(true);
    setTimeout(() => {
      analyzeProblem(description, components);
    }, 1000);
  };

  const analyzeProblem = (description: string, components: string[]) => {
    addMessage('bot', `🔍 Analyzing your issue...\n\nDetected components: ${components.join(', ')}\nModule: ${caseDetails.module}\nPriority: ${caseDetails.priority}`);
    setConversationStage('analysis');

    setTimeout(() => {
      const solution = findSolution(description, components);
      
      if (solution && solution.successRate > 70 && !solution.requiresApproval) {
        presentSolution(solution);
      } else {
        addMessage('bot', `Based on my analysis, this issue requires support engineer review due to:\n- Complex components involved (${components.join(', ')})\n- Potential authorization requirements\n\nEscalating to support team...`);
        escalateToSupport();
      }
      setIsTyping(false);
    }, 3000);
  };

  const presentSolution = (solution: Solution) => {
    addMessage('bot', `💡 I found a potential solution (${solution.successRate}% success rate for similar cases):\n\n${solution.description}\n\nSteps to resolve:\n${solution.steps.join('\n')}\n\nDid this resolve your issue? (Yes/No)`);
    setConversationStage('solution_feedback');
    setCaseDetails(prev => ({ ...prev, solutionAttempted: solution.description }));
  };

  const handleSolutionFeedback = (response: string) => {
    if (/yes|y|resolved|fixed/i.test(response)) {
      addMessage('bot', "✅ Great! I'm glad the solution worked. If you need anything else, feel free to ask.");
      setConversationStage('resolution');
    } else {
      addMessage('bot', "⚠️ I'm sorry the solution didn't work. Let me escalate this to a support engineer for deeper analysis.");
      escalateToSupport();
    }
  };

  const escalateToSupport = () => {
    setIsTyping(true);
    setTimeout(() => {
      addMessage('system', `📢 Support Engineer Notification: New case requires review\n\n` +
        `- Description: ${caseDetails.description}\n` +
        `- Components: ${identifiedComponents.join(', ')}\n` +
        `- Module: ${caseDetails.module}\n` +
        `- Priority: ${caseDetails.priority}\n` +
        `- Error Codes: ${caseDetails.errorCodes?.join(', ') || 'None'}\n` +
        `${caseDetails.solutionAttempted ? `- Attempted Solution: ${caseDetails.solutionAttempted}\n` : ''}`);
      
      addMessage('bot', "🛎️ I've notified the support team. A support engineer will review your case shortly.");
      
      setConversationStage('support_review');
      setIsTyping(false);
      
      setTimeout(() => {
        supportEngineerResponse();
      }, 5000);
    }, 2000);
  };

  const supportEngineerResponse = () => {
    addMessage('support', `👨‍💻 Hello, I'm SANJAY MALHOTRA from the SAP Labs Support Team. I'm looking into your case involving ${identifiedComponents.join(', ')} components.\n\n` +
      `Based on my initial analysis, I can:\n1. Provide a direct solution for this issue\n2. Create a swarm session with relevant SAP experts for deeper assistance\n3. Escalate to specialized team if needed`);
    
    setConversationStage('support_engineer_selection');
  };

  const handleSupportEngineerChoice = (choice: string) => {
    if (/1|solution|direct/i.test(choice)) {
      addMessage('support', "I'll provide a solution for this case. Please give me a moment to prepare the recommended approach...");
      provideSupportEngineerSolution();
    } else if (/2|swarm|session|experts/i.test(choice)) {
      addMessage('support', "I'll coordinate a swarm session with our SAP experts to assist you. Let me identify the right specialists...");
      // createSwarmSession();
    } else if (/3|escalate|specialized/i.test(choice)) {
      addMessage('support', "I'll escalate this to the appropriate specialized team. Gathering all necessary details for the handoff...");
      escalateToSpecializedTeam();
    } else {
      addMessage('bot', "Please select a valid option:\n1. Direct solution\n2. Swarm session\n3. Escalate to specialized team");
    }
  };

  const provideSupportEngineerSolution = () => {
  setIsTyping(true);
  
  setTimeout(() => {
    // Get module-specific troubleshooting advice
    const moduleAdvice = getModuleSpecificAdvice(caseDetails.module);
    const transportNum = getRandomTransportNumber();
    const sapNote = getRandomSapNote();

    addMessage('support', `🛠️ **Support Engineer Solution Analysis**\n\n` +
      `**Issue Diagnosis**:\n` +
      `Based on the error patterns and system logs, this appears to be a ${caseDetails.components?.[0] || 'configuration'} ` +
      `issue in the ${caseDetails.module} module.\n\n` +
      
      `**Recommended Resolution Steps**:\n` +
      `1. System Verification:\n   - Run SM51 to check system status\n   - Verify locks in SM12\n   - Check background jobs in SM37\n\n` +
      `2. Configuration Review:\n   - Navigate to SPRO → ${getSPROPath(caseDetails.module)}\n   - Compare with reference system settings\n\n` +
      `3. Change Analysis:\n   - Review transport ${transportNum} in SE10\n   - Check affected objects in SE03\n\n` +
      `4. SAP Note Implementation:\n   - Apply SAP Note ${sapNote}\n   - Test in ${ENVIRONMENTS[1]} before production\n\n` +
      
      `**Troubleshooting Tips**:\n` +
      `${moduleAdvice}\n\n` +
      `**Expected Outcome**:\n` +
      `- Immediate fix for ${caseDetails.errorCodes?.[0] || 'the reported error'}\n` +
      `- Improved ${caseDetails.components?.[0] || 'system'} performance\n\n` +
      
      
      ``);

    setConversationStage('solution_feedback');
    setIsTyping(false);
  }, 2500); // Slightly longer delay for more complex response
};

// Helper functions
const getModuleSpecificAdvice = (module?: string) => {
  const adviceMap: Record<string, string> = {
    'FICO': '- Verify GL account mappings in FS00\n- Check document splitting configuration\n- Review fiscal year variants',
    'MM': '- Validate material master data\n- Check purchasing info records\n- Verify inventory management settings',
    'SD': '- Review pricing procedures\n- Check output determination\n- Validate shipping point determination',
    'HANA': '- Run HANA studio performance analysis\n- Check calculation views\n- Review table partitioning',
    'BASIS': '- Verify system parameters in RZ10\n- Check transport routes\n- Review authorization profiles'
  };
  return adviceMap[module || ''] || '- Check transaction logs in SM21\n- Review system traces in ST01\n- Verify background job configurations';
};

const getSPROPath = (module?: string) => {
  const paths: Record<string, string> = {
    'FICO': 'Financial Accounting → General Ledger → Master Data',
    'MM': 'Materials Management → Purchasing → Purchase Order',
    'SD': 'Sales and Distribution → Basic Functions → Pricing',
    'HANA': 'SAP HANA → Configuration',
    'BASIS': 'System Administration → Configuration'
  };
  return paths[module || ''] || 'Relevant configuration path';
};

  const escalateToSpecializedTeam = () => {
    setIsTyping(true);
    setTimeout(() => {
      let specializedTeam = 'General Support';
      if (identifiedComponents.includes('Authorization')) {
        specializedTeam = 'Security & Authorization Team';
      } else if (identifiedComponents.includes('Performance')) {
        specializedTeam = 'Performance Optimization Team';
      } else if (identifiedComponents.includes('Database')) {
        specializedTeam = 'HANA Database Team';
      } else if (identifiedComponents.includes('Integration')) {
        specializedTeam = 'Integration Services Team';
      }

      addMessage('system', `📤 Escalation to ${specializedTeam}\n\n` +
        `Case Details:\n` +
        `- Description: ${caseDetails.description}\n` +
        `- Components: ${identifiedComponents.join(', ')}\n` +
        `- Priority: ${caseDetails.priority}\n` +
        `- Error Codes: ${caseDetails.errorCodes?.join(', ') || 'None'}\n\n` +
        `A dedicated ticket has been created (Ticket #${Math.floor(10000 + Math.random() * 90000)})`);

      addMessage('bot', `I've escalated your case to the ${specializedTeam}. ` +
        `They will contact you within 30 minutes with further updates.`);

      setConversationStage('resolution');
      setIsTyping(false);
    }, 2000);
  };

  

  const detectPriority = (text: string): PriorityLevel => {
    if (/critical|outage|down|emergency|production stop/i.test(text)) return 'critical';
    if (/high|urgent|important|severe|business impact/i.test(text)) return 'high';
    if (/medium|moderate|standard/i.test(text)) return 'medium';
    return 'low';
  };

  const detectModule = (text: string): string => {
    const module = SAP_MODULES.find(mod => new RegExp(mod, 'i').test(text));
    return module || 'Unknown';
  };

  const detectComponents = (text: string): string[] => {
    return SAP_COMPONENTS.filter(comp => new RegExp(comp, 'i').test(text));
  };

  const detectErrorCodes = (text: string): string[] => {
    const codes = [];
    const regex = /(ST22|SM21|SU01|DB13|SE38|SE80|SE11|SE16|SE30|SE37|SE24)[: ]*(\w+)/gi;
    let match;
    while ((match = regex.exec(text)) !== null) {
      codes.push(`${match[1]}: ${match[2]}`);
    }
    return codes;
  };

  const findSolution = (description: string, components: string[]): Solution | undefined => {
    return KNOWLEDGE_BASE.find(sol => 
      components.some(comp => sol.components.includes(comp))
    ) || KNOWLEDGE_BASE[0];
  };

  const matchExpertsByComponents = (): Expert[] => {
    return EXPERTS
      .filter(expert => 
        identifiedComponents.some(comp => 
          expert.expertise.includes(comp))
      )
      .sort((a, b) => {
        if (b.resolutionRate !== a.resolutionRate) return b.resolutionRate - a.resolutionRate;
        if (b.rating !== a.rating) return b.rating - a.rating;
        return a.availability === 'online' ? -1 : 1;
      });
  };

  const getRandomTransportNumber = () => {
    return `K9${Math.floor(100000 + Math.random() * 900000)}`;
  };

  const getRandomSapNote = () => {
    return `${Math.floor(2000000 + Math.random() * 3000000)}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onNavigate('home')}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">SAP Support Assistant</h1>
              <p className="text-sm text-gray-600">AI-Powered Case Resolution</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700">AI Online</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl rounded-lg px-4 py-3 ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : message.type === 'system'
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : message.type === 'support'
                    ? 'bg-yellow-50 text-gray-800 border border-yellow-200'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
            } shadow-sm`}>
              <div className="flex items-start space-x-2">
                {message.type === 'bot' && <Bot className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />}
                {message.type === 'user' && <User className="h-5 w-5 text-white mt-1 flex-shrink-0" />}
                {message.type === 'system' && <Shield className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />}
                {message.type === 'support' && <Wrench className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />}
                <div>
                  <p className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: message.content }}></p>
                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs bg-white border border-gray-200 rounded-lg px-4 py-3 rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              conversationStage === 'problem_description' 
                ? "Describe your SAP issue in detail (transactions, errors, steps to reproduce)..." 
                : "Type your response..."
            }
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        {conversationStage === 'problem_description' && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button 
              onClick={() => setInputText("We're experiencing severe performance degradation in S/4HANA Fiori launchpad (transaction SICF). Users report 30+ second response times when accessing apps. ST05 trace shows expensive SELECT queries.")}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-left"
            >
              Performance issue
            </button>
            <button 
              onClick={() => setInputText("Getting ST22 short dumps in production when executing VL01N (error MESSAGE_TYPE_X). Error occurs for all warehouse users. Dump analysis shows missing authorization object M_VL_WMA.")}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-left"
            >
              Authorization error
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SAPSupportChatbot;
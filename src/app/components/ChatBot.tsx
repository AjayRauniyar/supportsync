import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, X, Send, ArrowRight, Calendar, Users, Video, Phone,
  MessageSquare, Zap, CheckCircle, AlertTriangle, Clock,
  FileText, Shield, Settings, Star, ThumbsUp, ThumbsDown
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'normal' | 'solution' | 'escalation' | 'redirect' | 'success';
  hasButtons?: boolean;
  buttons?: ActionButton[];
}

interface ActionButton {
  id: string;
  text: string;
  action: 'redirect' | 'schedule' | 'callback' | 'feedback';
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  icon?: React.ReactNode;
}

interface TransferData {
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
    errorCodes: string[];
    module: string;
  };
  conversationHistory: Message[];
  redirectReason: string;
  timestamp: Date;
}

interface CustomerChatBotProps {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  onRedirectToSAPSupport?: (data: TransferData) => void;
}

const CustomerChatBot: React.FC<CustomerChatBotProps> = ({ 
  chatOpen, 
  setChatOpen, 
  onRedirectToSAPSupport 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 I\'m your **SAP AI Assistant**\n\nI can help you with:\n• 🔧 **Technical Issues**\n• 👥 **Expert Connections**\n• 📅 **Meeting Scheduling**\n• 🚀 **Quick Solutions**\n\nWhat SAP challenge are you facing today?',
      isBot: true,
      timestamp: new Date(),
      type: 'normal'
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStage, setConversationStage] = useState<
    'greeting' | 'analyzing' | 'solution_provided' | 'escalation_ready' | 'redirecting' | 'resolved'
  >('greeting');
  const [attemptCount, setAttemptCount] = useState(0);
  const [customerInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@techcorp.com',
    company: 'TechCorp Inc'
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateTicketId = () => `SAP-${Date.now().toString().slice(-6)}`;

  const detectSAPComponents = (text: string): string[] => {
    const components = [
      'HANA', 'S/4HANA', 'FICO', 'MM', 'SD', 'BASIS', 'BTP', 
      'Authorization', 'Performance', 'Integration', 'Upgrade'
    ];
    return components.filter(comp => 
      new RegExp(comp, 'i').test(text)
    );
  };

  const detectPriority = (text: string): 'low' | 'medium' | 'high' | 'critical' => {
    const criticalWords = ['critical', 'production down', 'system failure', 'urgent', 'emergency'];
    const highWords = ['error', 'not working', 'failed', 'blocked', 'important'];
    const mediumWords = ['slow', 'issue', 'problem', 'help needed'];
    
    const lowerText = text.toLowerCase();
    
    if (criticalWords.some(word => lowerText.includes(word))) return 'critical';
    if (highWords.some(word => lowerText.includes(word))) return 'high';
    if (mediumWords.some(word => lowerText.includes(word))) return 'medium';
    return 'low';
  };

  const getAIResponse = (userInput: string): {
    response: string;
    needsEscalation: boolean;
    confidence: number;
    category: string;
  } => {
    const input = userInput.toLowerCase();
    const components = detectSAPComponents(userInput);
    const priority = detectPriority(userInput);
    
    let response = '';
    let needsEscalation = false;
    let confidence = 0.7;
    let category = 'general';

    // HANA Issues
    if (input.includes('hana') || input.includes('database')) {
      category = 'hana';
      if (priority === 'critical' || input.includes('not working') || attemptCount > 0) {
        needsEscalation = true;
        response = '🔴 **HANA Database Issue Detected**\n\nThis requires immediate expert attention.\n\n**What I found:**\n• Database performance/connectivity issue\n• Potential system impact\n• Expert consultation recommended';
        confidence = 0.95;
      } else {
        response = '🗄️ **HANA Database Support**\n\n**Quick Solution:**\n• Check HANA Studio connection\n• Verify memory usage\n• Run system status checks\n\n**Try this first, then let me know if it helps!**';
        confidence = 0.8;
      }
    }
    // S/4HANA Issues  
    else if (input.includes('s/4hana') || input.includes('s4hana')) {
      category = 's4hana';
      if (priority === 'critical' || attemptCount > 0) {
        needsEscalation = true;
        response = '⚡ **S/4HANA Critical Issue**\n\nComplex S/4HANA problems need specialist support.\n\n**Issue Analysis:**\n• Migration/upgrade complexity\n• Business process impact\n• Expert team required';
        confidence = 0.92;
      } else {
        response = '⚡ **S/4HANA Assistant**\n\n**Quick Fix:**\n• Clear Fiori cache\n• Check user authorizations\n• Verify system connectivity\n\n**Does this resolve the issue?**';
        confidence = 0.75;
      }
    }
    // Authorization Issues
    else if (input.includes('authorization') || input.includes('access denied')) {
      category = 'authorization';
      response = '🔐 **Authorization Problem**\n\n**Solution Steps:**\n• Check ST22 for error details\n• Verify user roles in SU01\n• Compare with working user\n\n**Status: Ready to test**';
      confidence = 0.85;
      if (attemptCount > 0) needsEscalation = true;
    }
    // Performance Issues
    else if (input.includes('performance') || input.includes('slow')) {
      category = 'performance';
      response = '📈 **Performance Optimization**\n\n**Quick Actions:**\n• Run ST03N workload analysis\n• Check SM50 processes\n• Clear system buffers\n\n**Performance boost incoming!**';
      confidence = 0.78;
      if (priority === 'critical') needsEscalation = true;
    }
    // General/Complex Issues
    else if (priority === 'critical' || input.includes('expert') || input.includes('meeting')) {
      needsEscalation = true;
      response = '🆘 **Complex Issue Detected**\n\nThis needs specialized SAP expertise.\n\n**Next Steps:**\n• Connect with SAP specialists\n• Schedule expert consultation\n• Get immediate professional help';
      confidence = 0.9;
      category = 'complex';
    }
    else {
      response = '🤖 **SAP Analysis Complete**\n\nI need more details to provide the best solution.\n\n**Please specify:**\n• What SAP module/system?\n• What error messages?\n• When did this start?\n\n**More details = Better solution!**';
      confidence = 0.6;
    }

    return { response, needsEscalation, confidence, category };
  };

  const createRedirectButtons = (category: string, priority: string): ActionButton[] => {
    const buttons: ActionButton[] = [
      {
        id: 'redirect-experts',
        text: '👥 Connect with SAP Experts',
        action: 'redirect',
        variant: 'primary',
        icon: <Users className="h-4 w-4" />
      },
      {
        id: 'schedule-meeting',
        text: '📅 Schedule Expert Meeting',
        action: 'schedule',
        variant: 'secondary',
        icon: <Calendar className="h-4 w-4" />
      }
    ];

    if (priority === 'critical') {
      buttons.unshift({
        id: 'urgent-callback',
        text: '🚨 Urgent Expert Callback',
        action: 'callback',
        variant: 'danger',
        icon: <Phone className="h-4 w-4" />
      });
    }

    return buttons;
  };

  const handleButtonAction = async (action: string, buttonId: string) => {
    const ticketId = generateTicketId();
    const userMessages = messages.filter(m => !m.isBot).map(m => m.text).join(' ');
    
    const transferData: TransferData = {
      ticketId,
      customerInfo,
      issueDetails: {
        description: userMessages,
        priority: detectPriority(userMessages),
        category: detectSAPComponents(userMessages)[0] || 'general',
        components: detectSAPComponents(userMessages),
        errorCodes: [],
        module: detectSAPComponents(userMessages)[0] || 'General SAP'
      },
      conversationHistory: messages,
      redirectReason: action === 'callback' ? 'Urgent callback requested' : 'Expert consultation needed',
      timestamp: new Date()
    };

    if (action === 'redirect') {
      addMessage('bot', 
        `🔄 **Redirecting to SAP Support Specialists**\n\n` +
        `**Ticket Created:** ${ticketId}\n` +
        `**Status:** Connecting with expert team\n` +
        `**Data Transfer:** Complete ✅\n\n` +
        `You'll be connected to our SAP Support system where experts will review your case and schedule consultations.`,
        'redirect'
      );
      
      setConversationStage('redirecting');
      
      setTimeout(() => {
        if (onRedirectToSAPSupport) {
          onRedirectToSAPSupport(transferData);
        }
      }, 3000);
    }
    else if (action === 'schedule') {
      addMessage('bot',
        `📅 **Meeting Scheduler Activated**\n\n` +
        `**Ticket:** ${ticketId}\n` +
        `**Action:** Opening expert calendar\n` +
        `**Available:** Multiple SAP specialists\n\n` +
        `Redirecting to meeting scheduler...`,
        'redirect'
      );
      
      setTimeout(() => {
        if (onRedirectToSAPSupport) {
          onRedirectToSAPSupport({ ...transferData, redirectReason: 'Meeting scheduling requested' });
        }
      }, 2000);
    }
    else if (action === 'callback') {
      addMessage('bot',
        `🚨 **Urgent Callback Initiated**\n\n` +
        `**Priority:** URGENT\n` +
        `**Ticket:** ${ticketId}\n` +
        `**Response Time:** Within 15 minutes\n\n` +
        `Senior SAP expert will call you immediately!`,
        'escalation'
      );
      
      setTimeout(() => {
        if (onRedirectToSAPSupport) {
          onRedirectToSAPSupport({ 
            ...transferData, 
            issueDetails: { ...transferData.issueDetails, priority: 'critical' },
            redirectReason: 'Urgent callback - immediate attention required' 
          });
        }
      }, 1500);
    }
  };

  const addMessage = (type: 'user' | 'bot', content: string, messageType: Message['type'] = 'normal', buttons?: ActionButton[]) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text: content,
      isBot: type === 'bot',
      timestamp: new Date(),
      type: messageType,
      hasButtons: !!buttons,
      buttons
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    addMessage('user', inputText);
    const userInput = inputText;
    setInputText('');
    setIsTyping(true);
    setConversationStage('analyzing');

    // AI thinking simulation
    await new Promise(resolve => setTimeout(resolve, 1200));

    const analysis = getAIResponse(userInput);
    setAttemptCount(prev => prev + 1);

    if (analysis.needsEscalation) {
      const buttons = createRedirectButtons(analysis.category, detectPriority(userInput));
      
      addMessage('bot', 
        `${analysis.response}\n\n` +
        `**🎯 AI Confidence:** ${Math.round(analysis.confidence * 100)}%\n` +
        `**📊 Analysis:** Expert consultation recommended\n\n` +
        `**Choose your next step:**`,
        'escalation',
        buttons
      );
      
      setConversationStage('escalation_ready');
    } else {
      addMessage('bot', 
        `${analysis.response}\n\n` +
        `**🤖 AI Confidence:** ${Math.round(analysis.confidence * 100)}%`,
        
      );
      
      setConversationStage('solution_provided');
    }

    setIsTyping(false);
  };

  const handleFeedback = (isHelpful: boolean) => {
    if (isHelpful) {
      addMessage('bot', 
        '🎉 **Great!** Problem resolved successfully!\n\nGlad I could help. Feel free to ask anytime! 😊',
        'success'
      );
      setConversationStage('resolved');
    } else {
      const buttons = createRedirectButtons('general', 'high');
      addMessage('bot',
        '😔 **No problem!** Let me connect you with our SAP experts.\n\n' +
        'They\'ll provide specialized assistance for your issue.\n\n' +
        '**Choose how you\'d like to proceed:**',
        'escalation',
        buttons
      );
      setConversationStage('escalation_ready');
    }
  };

  const renderActionButtons = (buttons: ActionButton[]) => (
    <div className="mt-4 space-y-2">
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={() => handleButtonAction(button.action, button.id)}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
            button.variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' :
            button.variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl animate-pulse' :
            'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400'
          }`}
        >
          {button.icon}
          <span>{button.text}</span>
          <ArrowRight className="h-4 w-4 ml-auto" />
        </button>
      ))}
    </div>
  );

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out ${
      chatOpen ? 'w-[400px] h-[600px]' : 'w-16 h-16'
    }`}>
      {chatOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className={`flex items-center justify-between p-4 transition-all duration-500 ${
            conversationStage === 'escalation_ready' || conversationStage === 'redirecting' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600' :
            conversationStage === 'resolved' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
            'bg-gradient-to-r from-blue-600 to-purple-600'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <span className="font-semibold text-white">SAP AI Assistant</span>
                <div className="text-xs text-white/90">
                  {isTyping ? 'Analyzing your issue...' :
                   conversationStage === 'redirecting' ? 'Connecting to experts...' :
                   conversationStage === 'escalation_ready' ? 'Expert team ready' :
                   conversationStage === 'resolved' ? 'Issue resolved!' :
                   'AI Support Online'}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setChatOpen(false)}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] rounded-xl px-4 py-3 transition-all duration-300 ${
                  message.isBot 
                    ? message.type === 'escalation' 
                      ? 'bg-gradient-to-r from-orange-50 to-red-50 text-red-900 border border-orange-200 shadow-lg'
                      : message.type === 'success'
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-900 border border-green-200 shadow-lg'
                        : message.type === 'redirect'
                          ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-900 border border-purple-200 shadow-lg'
                          : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm'
                }`}>
                  <div className="flex items-start space-x-2">
                    {message.isBot && (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                        message.type === 'escalation' ? 'bg-orange-500' :
                        message.type === 'success' ? 'bg-green-500' :
                        message.type === 'redirect' ? 'bg-purple-500' :
                        'bg-blue-500'
                      }`}>
                        {message.type === 'escalation' ? <AlertTriangle className="h-3 w-3 text-white" /> :
                         message.type === 'success' ? <CheckCircle className="h-3 w-3 text-white" /> :
                         message.type === 'redirect' ? <ArrowRight className="h-3 w-3 text-white" /> :
                         <Zap className="h-3 w-3 text-white" />}
                      </div>
                    )}
                    <div className="flex-1">
                      <div 
                        className="text-sm leading-relaxed whitespace-pre-line"
                        dangerouslySetInnerHTML={{ 
                          __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                        }}
                      />
                      {message.hasButtons && message.buttons && renderActionButtons(message.buttons)}
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs opacity-60">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.isBot && conversationStage === 'solution_provided' && (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleFeedback(true)}
                              className="p-1 hover:bg-green-100 rounded transition-colors"
                              title="This helped!"
                            >
                              <ThumbsUp className="h-3 w-3 text-green-600" />
                            </button>
                            <button 
                              onClick={() => handleFeedback(false)}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                              title="Need more help"
                            >
                              <ThumbsDown className="h-3 w-3 text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-500 animate-spin" />
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  conversationStage === 'greeting' ? "Describe your SAP issue..." :
                  conversationStage === 'solution_provided' ? "Did this help? Or need more assistance?" :
                  "Type your response..."
                }
                className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                disabled={isTyping || conversationStage === 'redirecting'}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping || conversationStage === 'redirecting'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl disabled:opacity-50 transition-all hover:shadow-lg"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            
            {/* Status Bar */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  conversationStage === 'redirecting' ? 'bg-purple-500 animate-pulse' :
                  conversationStage === 'resolved' ? 'bg-green-500' :
                  'bg-blue-500 animate-pulse'
                }`} />
                <span>
                  {conversationStage === 'redirecting' ? 'Connecting to SAP Support...' :
                   conversationStage === 'escalation_ready' ? 'Expert team ready to help' :
                   conversationStage === 'resolved' ? 'Issue resolved successfully' :
                   isTyping ? 'AI is analyzing...' : 'Ready to assist'}
                </span>
              </div>
              {attemptCount > 0 && conversationStage !== 'resolved' && (
                <span className="text-blue-600 font-medium">
                  Attempt {attemptCount}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setChatOpen(true)}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        >
          <Bot className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
          </span>
        </button>
      )}
    </div>
  );
};

export default CustomerChatBot;

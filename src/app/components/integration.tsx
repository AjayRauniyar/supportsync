import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Users, Calendar, Video, ArrowRight, ArrowLeft, RefreshCw,
  MessageSquare, FileText, CheckCircle, AlertTriangle, Clock,
  Shield, Zap, Bell, Settings, Home, BarChart3, Activity,
  Database, Cloud, Target, TrendingUp, Award, Star
} from 'lucide-react';

// Import all our components
import CustomerChatBot from './ChatBot';
import SAPSupportChatbot from './ChatBotPage';
import AIMeetingAssistant from './AIAssistant';

// Types and Interfaces
interface SystemState {
  activeComponent: 'home' | 'customer-chat' | 'sap-support' | 'ai-meeting' | 'analytics';
  customerChatOpen: boolean;
  dataFlow: DataFlowState[];
  notifications: SystemNotification[];
  activeTransfers: DataTransfer[];
  systemMetrics: SystemMetrics;
}

interface DataFlowState {
  id: string;
  fromComponent: string;
  toComponent: string;
  data: any;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type: 'case_transfer' | 'meeting_schedule' | 'summary_complete' | 'kb_update';
}

interface SystemNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
}

interface DataTransfer {
  id: string;
  ticketId: string;
  currentStage: 'customer_support' | 'expert_matching' | 'meeting_scheduled' | 'meeting_active' | 'completed';
  customerInfo: CustomerInfo;
  progress: number;
  estimatedCompletion?: Date;
}

interface CustomerInfo {
  name: string;
  email: string;
  company: string;
  issueType: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface SystemMetrics {
  totalCases: number;
  activeMeetings: number;
  completedToday: number;
  customerSatisfaction: number;
  averageResolutionTime: number;
  expertUtilization: number;
  aiAccuracy: number;
  knowledgebaseUpdates: number;
}
interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
};
// Main Integration Manager Component
const IntegrationManager:  React.FC<HomePageProps> = ({ onNavigate }) => {
  
  // Core State Management
  const [systemState, setSystemState] = useState<SystemState>({
    activeComponent: 'home',
    customerChatOpen: false,
    dataFlow: [],
    notifications: [],
    activeTransfers: [],
    systemMetrics: {
      totalCases: 127,
      activeMeetings: 3,
      completedToday: 8,
      customerSatisfaction: 94,
      averageResolutionTime: 2.4,
      expertUtilization: 78,
      aiAccuracy: 89,
      knowledgebaseUpdates: 12
    }
  });

  const [transferredCaseData, setTransferredCaseData] = useState<any>(null);
  const [scheduledMeetingData, setScheduledMeetingData] = useState<any>(null);
  const [aiProcessingData, setAiProcessingData] = useState<any>(null);

  // Auto-refresh system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      updateSystemMetrics();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle navigation between components
  const handleNavigation = (page: string, data?: any) => {
    setSystemState(prev => ({
      ...prev,
      activeComponent: page as SystemState['activeComponent']
    }));

    if (data) {
      if (page === 'sap-support') {
        setTransferredCaseData(data);
      } else if (page === 'ai-meeting') {
        setScheduledMeetingData(data);
      }
    }
  };

  // Handle data transfer from Customer ChatBot to SAP Support
  const handleCustomerToSAPTransfer = (transferData: any) => {
    const dataFlow: DataFlowState = {
      id: `flow-${Date.now()}`,
      fromComponent: 'Customer ChatBot',
      toComponent: 'SAP Support ChatBot',
      data: transferData,
      timestamp: new Date(),
      status: 'processing',
      type: 'case_transfer'
    };

    setSystemState(prev => ({
      ...prev,
      dataFlow: [...prev.dataFlow, dataFlow],
      activeTransfers: [...prev.activeTransfers, {
        id: transferData.ticketId,
        ticketId: transferData.ticketId,
        currentStage: 'expert_matching',
        customerInfo: transferData.customerInfo,
        progress: 25,
        estimatedCompletion: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
      }]
    }));

    // Add system notification
    addNotification('info', 'Case Transfer', `Case ${transferData.ticketId} transferred to SAP Support for expert matching.`);

    // Set transferred data and navigate
    setTransferredCaseData(transferData);
    
    setTimeout(() => {
      handleNavigation('sap-support');
      updateDataFlowStatus(dataFlow.id, 'completed');
    }, 2000);
  };

  // Handle meeting scheduling from SAP Support
  const handleMeetingScheduled = (meetingData: any) => {
    const dataFlow: DataFlowState = {
      id: `flow-${Date.now()}`,
      fromComponent: 'SAP Support ChatBot',
      toComponent: 'AI Meeting Assistant',
      data: meetingData,
      timestamp: new Date(),
      status: 'processing',
      type: 'meeting_schedule'
    };

    setSystemState(prev => ({
      ...prev,
      dataFlow: [...prev.dataFlow, dataFlow],
      activeTransfers: prev.activeTransfers.map(transfer => 
        transfer.ticketId === meetingData.caseId 
          ? { ...transfer, currentStage: 'meeting_scheduled', progress: 60 }
          : transfer
      )
    }));

    addNotification('success', 'Meeting Scheduled', `Expert consultation scheduled for ${meetingData.date} at ${meetingData.time}`);

    setScheduledMeetingData(meetingData);
    updateDataFlowStatus(dataFlow.id, 'completed');
  };

  // Handle AI meeting completion and summary
  const handleMeetingCompleted = (summaryData: any) => {
    const dataFlow: DataFlowState = {
      id: `flow-${Date.now()}`,
      fromComponent: 'AI Meeting Assistant',
      toComponent: 'Knowledge Base',
      data: summaryData,
      timestamp: new Date(),
      status: 'processing',
      type: 'summary_complete'
    };

    setSystemState(prev => ({
      ...prev,
      dataFlow: [...prev.dataFlow, dataFlow],
      activeTransfers: prev.activeTransfers.map(transfer => 
        transfer.ticketId === summaryData.caseId 
          ? { ...transfer, currentStage: 'completed', progress: 100 }
          : transfer
      )
    }));

    addNotification('success', 'Meeting Completed', `Case ${summaryData.caseId} resolved. Summary generated and knowledge base updated.`);

    // Update customer via notification
    setTimeout(() => {
      notifyCustomerOfResolution(summaryData);
    }, 1000);

    updateDataFlowStatus(dataFlow.id, 'completed');
  };

  // Notify customer of case resolution
  const notifyCustomerOfResolution = (summaryData: any) => {
    addNotification('success', 'Customer Updated', 
      `Customer notified of case resolution with summary document and satisfaction survey.`);
    
    // Update system metrics
    setSystemState(prev => ({
      ...prev,
      systemMetrics: {
        ...prev.systemMetrics,
        completedToday: prev.systemMetrics.completedToday + 1,
        knowledgebaseUpdates: prev.systemMetrics.knowledgebaseUpdates + summaryData.knowledgebaseUpdates?.length || 0
      }
    }));
  };

  // Add system notification
  const addNotification = (type: SystemNotification['type'], title: string, message: string, actionRequired = false) => {
    const notification: SystemNotification = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      actionRequired
    };

    setSystemState(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications.slice(0, 9)] // Keep last 10
    }));
  };

  // Update data flow status
  const updateDataFlowStatus = (flowId: string, status: DataFlowState['status']) => {
    setSystemState(prev => ({
      ...prev,
      dataFlow: prev.dataFlow.map(flow =>
        flow.id === flowId ? { ...flow, status } : flow
      )
    }));
  };

  // Update system metrics (simulated)
  const updateSystemMetrics = () => {
    setSystemState(prev => {
      const randomVariation = () => (Math.random() - 0.5) * 2; // -1 to +1
      
      return {
        ...prev,
        systemMetrics: {
          ...prev.systemMetrics,
          totalCases: prev.systemMetrics.totalCases + Math.floor(Math.random() * 2),
          customerSatisfaction: Math.max(85, Math.min(98, prev.systemMetrics.customerSatisfaction + randomVariation())),
          expertUtilization: Math.max(60, Math.min(90, prev.systemMetrics.expertUtilization + randomVariation())),
          aiAccuracy: Math.max(80, Math.min(95, prev.systemMetrics.aiAccuracy + randomVariation() * 0.5))
        }
      };
    });
  };

  // Mark notification as read
  const markNotificationRead = (notificationId: string) => {
    setSystemState(prev => ({
      ...prev,
      notifications: prev.notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    }));
  };

  // Render Functions
  const renderDashboard = () => (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">SAP Support  Center</h1>
              <p className="text-gray-600">Complete orchestration of customer support, expert matching, and AI assistance</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 px-4 py-2 rounded-full border border-green-200">
                <span className="text-green-800 font-medium">All Systems Operational</span>
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* System Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Cases</p>
                <p className="text-2xl font-bold text-gray-900">{systemState.systemMetrics.totalCases}</p>
                <p className="text-green-600 text-sm">+{systemState.systemMetrics.completedToday} today</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Meetings</p>
                <p className="text-2xl font-bold text-gray-900">{systemState.systemMetrics.activeMeetings}</p>
                <p className="text-blue-600 text-sm">AI assisted</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Video className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Customer Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">{systemState.systemMetrics.customerSatisfaction}%</p>
                <p className="text-green-600 text-sm">↗ +2% this week</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">AI Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(systemState.systemMetrics.aiAccuracy)}%</p>
                <p className="text-purple-600 text-sm">Continuously learning</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* System Components */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Support ChatBot */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Support ChatBot</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              First point of contact for Support Engineers. Provides initial support and intelligently escalates complex issues.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Sessions</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Resolution Rate</span>
                <span className="font-medium">76%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Response</span>
                <span className="font-medium">2.1s</span>
              </div>
            </div>
            <button
              onClick={() => setSystemState(prev => ({ ...prev, customerChatOpen: true }))}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Support Chat
            </button>
          </div>

          {/* SAP Support ChatBot */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">SAP Support Center</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Expert matching system with Microsoft-style calendar integration for scheduling consultations.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available Experts</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Meetings Scheduled</span>
                <span className="font-medium">15</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Match Accuracy</span>
                <span className="font-medium">94%</span>
              </div>
            </div>
            <button
              onClick={() => handleNavigation('sap-support')}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Open Support Center
            </button>
          </div>

          {/* AI Meeting Assistant */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Video className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">AI Meeting Assistant</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Joins meetings automatically, provides real-time transcription, and generates documentation.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Meetings</span>
                <span className="font-medium">{systemState.systemMetrics.activeMeetings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transcription Accuracy</span>
                <span className="font-medium">96%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">KB Updates Today</span>
                <span className="font-medium">{systemState.systemMetrics.knowledgebaseUpdates}</span>
              </div>
            </div>
            <button
              onClick={() => handleNavigation('ai-meeting')}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Open Meeting Assistant
            </button>
          </div>
        </div>

        {/* Active Data Transfers */}
        {systemState.activeTransfers.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Active Case Transfers</h3>
            <div className="space-y-4">
              {systemState.activeTransfers.map((transfer) => (
                <div key={transfer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {transfer.customerInfo.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Case {transfer.ticketId}</p>
                      <p className="text-sm text-gray-600">{transfer.customerInfo.name} - {transfer.customerInfo.issueType}</p>
                      <p className="text-xs text-gray-500">Stage: {transfer.currentStage.replace('_', ' ').toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{transfer.progress}%</p>
                      <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${transfer.progress}%` }}
                        />
                      </div>
                    </div>
                    {transfer.estimatedCompletion && (
                      <div className="text-xs text-gray-500">
                        ETA: {transfer.estimatedCompletion.toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Flow Visualization */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Data Flow</h3>
          <div className="space-y-3">
            {systemState.dataFlow.slice(-5).map((flow) => (
              <div key={flow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    flow.status === 'completed' ? 'bg-green-500' :
                    flow.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                    flow.status === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-900">
                    {flow.fromComponent} → {flow.toComponent}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    flow.type === 'case_transfer' ? 'bg-blue-100 text-blue-800' :
                    flow.type === 'meeting_schedule' ? 'bg-purple-100 text-purple-800' :
                    flow.type === 'summary_complete' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {flow.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {flow.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Notifications */}
        {systemState.notifications.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">System Notifications</h3>
              <span className="text-sm text-gray-500">
                {systemState.notifications.filter(n => !n.read).length} unread
              </span>
            </div>
            <div className="space-y-3">
              {systemState.notifications.slice(0, 5).map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    !notification.read 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header with higher z-index */}
           <header className="relative z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-0 shadow-sm">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center h-20">
                 <div className="flex items-center space-x-4">
                   <div 
                     className="relative transform-gpu"
                     style={{
                      
                       transformStyle: 'preserve-3d',
                       transition: 'transform 0.2s ease-out'
                     }}
                   >
                     <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-60 animate-pulse-glow" />
                     <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg border border-white/30">
                       <Zap className="h-8 w-8 text-white filter drop-shadow-lg" />
                     </div>
                   </div>
                   <div>
                     <h1 className="text-2xl font-bold text-gray-800">
                       SAP SupportSync
                     </h1>
                     <p className="text-sm text-gray-600">Connecting Right Minds, Right Now</p>
                   </div>
                 </div>
                 
                 <nav className="hidden md:flex items-center space-x-8">
                   {[
                     { icon: Home, label: 'Dashboard', page: 'home' },
                     { icon: Bot, label: 'AI Assistant', page: 'chat' },
                     { icon: Users, label: 'Expert Matching', page: 'experts' },
                     { icon: MessageSquare, label: 'Swarm Rooms', page: 'swarm' }
                   ].map((item, index) => (
                     <button
                       key={index}
                       onClick={() => onNavigate(item.page)}
                       className="group relative flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-300"
                     >
                       <div className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-300">
                         <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                       </div>
                       <span className="font-medium">{item.label}</span>
                     </button>
                   ))}
                 </nav>
     
                 <div className="flex items-center space-x-4">
                   <button className="relative p-3 text-gray-600 hover:text-blue-600 transition-colors group">
                     <Bell className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                     <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 ring-2 ring-white animate-ping" />
                   </button>
                 </div>
               </div>
             </div>
           </header>
      

      {/* Main Content */}
      {systemState.activeComponent === 'home' && renderDashboard()}
      {systemState.activeComponent === 'sap-support' && (
        <SAPSupportChatbot 
          onNavigate={handleNavigation}
          transferredData={transferredCaseData}
        />
      )}
      {systemState.activeComponent === 'ai-meeting' && (
        <AIMeetingAssistant 
          meetingData={scheduledMeetingData}
          onNavigate={handleNavigation}
        />
      )}

      {/* Customer ChatBot - Always Available */}
      <CustomerChatBot
        chatOpen={systemState.customerChatOpen}
        setChatOpen={(open) => setSystemState(prev => ({ ...prev, customerChatOpen: open }))}
        onRedirectToSAPSupport={handleCustomerToSAPTransfer}
      />
       
             {/* Footer
             <footer className="relative z-10 bg-white border-t border-gray-200 mt-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 <div className="grid md:grid-cols-4 gap-8">
                   <div>
                     <div className="flex items-center space-x-3 mb-4">
                       <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg shadow-md">
                         <Zap className="h-6 w-6 text-white" />
                       </div>
                       <div>
                         <h4 className="text-xl font-bold text-gray-800">SAP SupportSync</h4>
                         <p className="text-gray-600 text-sm">AI-Powered Support</p>
                       </div>
                     </div>
                     <p className="text-gray-600">
                       Connecting the right minds at the right time for faster SAP support resolution.
                     </p>
                   </div>
                   <div>
                     <h5 className="font-semibold mb-4 text-gray-800">Platform</h5>
                     <ul className="space-y-2 text-gray-600">
                       <li className="hover:text-gray-800 transition-colors cursor-pointer">AI Assistant</li>
                       <li className="hover:text-gray-800 transition-colors cursor-pointer">Expert Matching</li>
                       <li className="hover:text-gray-800 transition-colors cursor-pointer">Swarm Rooms</li>
                       <li className="hover:text-gray-800 transition-colors cursor-pointer">Analytics</li>
                     </ul>
                   </div>
                   <div>
                     <h5 className="font-semibold mb-4 text-gray-800">SAP Solutions</h5>
                     <ul className="space-y-2 text-gray-600">
                       <li className="hover:text-gray-800 transition-colors cursor-pointer">S/4HANA</li>
                       <li className="hover:text-gray-800 transition-colors cursor-pointer">SAP BTP</li>
                       <li className="hover:text-gray-800 transition-colors cursor-pointer">SuccessFactors</li>
                       <li className="hover:text-gray-800 transition-colors cursor-pointer">Ariba</li>
                     </ul>
                   </div>
                   <div>
                     <h5 className="font-semibold mb-4 text-gray-800">Company</h5>
                     <ul className="space-y-2 text-gray-600">
                       <li className="hover:text-gray-800 transition-colors cursor-pointer">About</li>
                       <li className="hover:text-gray-800 transition-colors cursor-pointer">Careers</li>
                       <li className="hover:text-gray-800 transition-colors cursor-pointer">Contact</li>
                       <li className="hover:text-gray-800 transition-colors cursor-pointer">Privacy</li>
                     </ul>
                   </div>
                 </div>
                 <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
                   <p>&copy; 2025 SAP SupportSync. All rights reserved.</p>
                 </div>
               </div>
             </footer> */}
      {/* Global Success Overlay */}
      {systemState.activeTransfers.some(t => t.progress === 100) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Case Resolved Successfully!</h3>
              <p className="text-gray-600 mb-4">
                Customer has been notified with the resolution summary and satisfaction survey.
              </p>
              <button
                onClick={() => setSystemState(prev => ({
                  ...prev,
                  activeTransfers: prev.activeTransfers.filter(t => t.progress !== 100)
                }))}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationManager;

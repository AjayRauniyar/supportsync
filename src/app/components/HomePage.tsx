import React, { useState } from 'react';
import { 
  Bot, Users, MessageSquare, Home, Zap, Shield, Network, 
  Play, CheckCircle, AlertCircle, Sparkles, Menu, X, ArrowRight,
  TrendingUp, Clock, Star, ChevronRight, Settings, Bell,
  Database, Cloud, Cpu, Globe, BarChart3, Headphones
} from 'lucide-react';
type HomePageProps = {
  onNavigate: (page: string) => void;
};

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const features = [
    {
      icon: Zap,
      title: 'Instant AI-Powered Resolution',
      description: 'Advanced AI analyzes case patterns and suggests solutions in real-time, reducing resolution time by 50%.',
      color: 'from-blue-500 to-purple-500',
      stats: '2.3x faster'
    },
    {
      icon: Shield,
      title: 'Smart Context Intelligence',
      description: 'RAG-based knowledge synthesis provides comprehensive case summaries with relevant historical data.',
      color: 'from-green-500 to-teal-500',
      stats: '95% accuracy'
    },
    {
      icon: Network,
      title: 'Seamless Team Collaboration',
      description: 'Native Microsoft Teams integration with real-time expert matching and instant room creation.',
      color: 'from-purple-500 to-pink-500',
      stats: '40% less escalation'
    },
    {
      icon: Database,
      title: 'SAP System Integration',
      description: 'Deep integration with SAP ERP, S/4HANA, BTP, and SuccessFactors for comprehensive support.',
      color: 'from-orange-500 to-red-500',
      stats: '99.9% uptime'
    },
    {
      icon: Cloud,
      title: 'Cloud-Native Architecture',
      description: 'Scalable microservices architecture ensuring high availability and enterprise-grade security.',
      color: 'from-cyan-500 to-blue-500',
      stats: '24/7 available'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time dashboards and predictive analytics for proactive issue identification.',
      color: 'from-indigo-500 to-purple-500',
      stats: '70% prediction'
    }
  ];

  const stats = [
    { value: '50%', label: 'Faster Resolution', color: 'text-blue-600', icon: TrendingUp },
    { value: '85%', label: 'Expert Match Accuracy', color: 'text-green-600', icon: Star },
    { value: '40%', label: 'Reduced Escalations', color: 'text-purple-600', icon: ArrowRight },
    { value: '99.9%', label: 'System Uptime', color: 'text-orange-600', icon: Shield }
  ];

  const recentActivity = [
    {
      icon: CheckCircle,
      title: 'SAP HANA Performance Issue Resolved',
      description: 'Critical database performance optimized in 23 minutes',
      time: '2 min ago',
      color: 'bg-green-50 text-green-600',
      case: '#SAP-12345',
      severity: 'High'
    },
    {
      icon: Users,
      title: 'Expert Team Assembled',
      description: '3 senior SAP consultants matched for S/4HANA migration',
      time: '5 min ago',
      color: 'bg-blue-50 text-blue-600',
      case: '#SAP-12346',
      severity: 'Medium'
    },
    {
      icon: AlertCircle,
      title: 'New Critical Case Opened',
      description: 'SAP BTP connectivity issue affecting production',
      time: '8 min ago',
      color: 'bg-orange-50 text-orange-600',
      case: '#SAP-12347',
      severity: 'Critical'
    },
    {
      icon: Bot,
      title: 'AI Assistant Suggestion',
      description: 'Recommended knowledge base article for Case #SAP-12348',
      time: '12 min ago',
      color: 'bg-purple-50 text-purple-600',
      case: '#SAP-12348',
      severity: 'Low'
    }
  ];

  const expertSpotlight = [
    {
      name: 'Dr. Sarah Chen',
      role: 'SAP HANA Expert',
      cases: 47,
      rating: 4.9,
      specialization: 'Performance Optimization'
    },
    {
      name: 'Michael Rodriguez',
      role: 'S/4HANA Architect',
      cases: 52,
      rating: 4.8,
      specialization: 'Migration & Integration'
    },
    {
      name: 'Priya Sharma',
      role: 'BTP Specialist',
      cases: 38,
      rating: 4.9,
      specialization: 'Cloud Integration'
    }
  ];

  const ChatBot = () => (
    <div className={`fixed bottom-4 right-4 z-50 ${chatOpen ? 'w-96 h-96' : 'w-16 h-16'} transition-all duration-300`}>
      {chatOpen ? (
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 h-full flex flex-col">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">SAP AI Assistant</span>
            </div>
            <button 
              onClick={() => setChatOpen(false)}
              className="p-1 hover:bg-white/20 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  👋 Hello! I'm your SAP AI Assistant. I can help you with:
                </p>
                <ul className="text-xs text-blue-700 mt-2 space-y-1">
                  <li>• Case analysis and troubleshooting</li>
                  <li>• Expert recommendations</li>
                  <li>• Knowledge base search</li>
                  <li>• System status updates</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-800">What can I help you with today?</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setChatOpen(true)}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          <Bot className="h-8 w-8 group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SAP SupportSync</h1>
                <p className="text-sm text-gray-600">Connecting Right Minds, Right Now</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
  onClick={() => onNavigate('home')}
  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
>
  <Home className="h-4 w-4" />
  <span>Dashboard</span>
</button>

<button
  onClick={() => onNavigate('chat')}
  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
>
  <Bot className="h-4 w-4" />
  <span>AI Assistant</span>
</button>

<button
  onClick={() => onNavigate('experts')}
  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
>
  <Users className="h-4 w-4" />
  <span>Expert Matching</span>
</button>

<button
  onClick={() => onNavigate('swarm')}
  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
>
  <MessageSquare className="h-4 w-4" />
  <span>Swarm Rooms</span>
</button>

            </nav>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-blue-100 p-4">
          <nav className="space-y-2">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors">
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors">
              <Bot className="h-5 w-5" />
              <span>AI Assistant</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors">
              <Users className="h-5 w-5" />
              <span>Expert Matching</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors">
              <MessageSquare className="h-5 w-5" />
              <span>Swarm Rooms</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full text-sm font-medium text-blue-700 mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Next-Generation SAP Support Platform</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Revolutionizing SAP Support with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                AI-Powered Intelligence
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Experience the future of SAP support with our AI-driven platform that connects the right experts instantly, 
              provides intelligent case analysis, and creates seamless collaboration environments for faster resolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={() => setChatOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 justify-center transform hover:scale-105"
              >
                <Bot className="h-5 w-5" />
                <span>Start AI Assistant</span>
              </button>
              <button className="bg-white/80 backdrop-blur-md text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-white transition-all duration-300 border border-gray-200 flex items-center space-x-2 justify-center transform hover:scale-105">
                <Users className="h-5 w-5" />
                <span>Find SAP Experts</span>
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-center mb-3">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Intelligent Features</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover how our AI-powered platform transforms SAP support with cutting-edge technology
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-blue-100 hover:shadow-xl transition-all duration-300 group">
                  <div className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-semibold text-gray-900">{feature.title}</h4>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {feature.stats}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <button className="mt-4 text-blue-600 hover:text-blue-700 flex items-center space-x-1 font-medium">
                    <span>Learn more</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Live Activity Feed</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live</span>
                </div>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentActivity.map((activity, index) => (
                  <div key={index} className={`flex items-start space-x-4 p-4 ${activity.color.split(' ')[0]} rounded-lg hover:shadow-md transition-shadow`}>
                    <activity.icon className={`h-5 w-5 ${activity.color.split(' ')[1]} flex-shrink-0 mt-1`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-gray-900 truncate">{activity.title}</div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          activity.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                          activity.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                          activity.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {activity.severity}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{activity.description}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">{activity.case}</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expert Spotlight */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Expert Spotlight</h3>
                <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm font-medium">
                  <span>View all</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                {expertSpotlight.map((expert, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {expert.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{expert.name}</div>
                      <div className="text-sm text-gray-600">{expert.role}</div>
                      <div className="text-xs text-gray-500">{expert.specialization}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{expert.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500">{expert.cases} cases</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your SAP Support?</h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of SAP professionals who trust SupportSync for faster, smarter support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setChatOpen(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 justify-center"
              >
                <Bot className="h-5 w-5" />
                <span>Try AI Assistant</span>
              </button>
              <button className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center space-x-2 justify-center">
                <Headphones className="h-5 w-5" />
                <span>Schedule Demo</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Chat Bot */}
      <ChatBot />

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold">SAP SupportSync</h4>
                  <p className="text-gray-400 text-sm">AI-Powered Support</p>
                </div>
              </div>
              <p className="text-gray-400">
                Connecting the right minds at the right time for faster SAP support resolution.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Platform</h5>
              <ul className="space-y-2 text-gray-400">
                <li>AI Assistant</li>
                <li>Expert Matching</li>
                <li>Swarm Rooms</li>
                <li>Analytics</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">SAP Solutions</h5>
              <ul className="space-y-2 text-gray-400">
                <li>S/4HANA</li>
                <li>SAP BTP</li>
                <li>SuccessFactors</li>
                <li>Ariba</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SAP SupportSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
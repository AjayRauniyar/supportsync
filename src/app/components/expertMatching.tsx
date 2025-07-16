import React, { useState } from 'react';
import { 
  Users, 
  Home, 
  Bot, 
  MessageSquare, 
  Bell, 
  Menu, 
  X,
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Star, 
  ChevronDown,
  UserCheck,
  Zap,
  UserPlus,
  Trophy,
  TrendingUp,
  Shield,
  Database,
  Cloud,
  Code,
  Settings,
  BookOpen,
  Award,
  Activity,
  Target,
  GitBranch,
  Layers,
  Globe,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  BarChart3,
  Users2,
  Crown,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Eye,
  TrendingDown
} from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  title: string;
  level: 'junior' | 'mid' | 'senior' | 'principal' | 'architect';
  department: string;
  expertise: string[];
  availability: 'available' | 'busy' | 'away' | 'offline';
  timezone: string;
  location: string;
  rating: number;
  resolvedCases: number;
  responseTime: string;
  workload: number;
  skillMatch: number;
  avatar: string;
  recentActivity: string;
  sapComponents: string[];
  certifications: string[];
  experienceYears: number;
  successRate: number;
  currentProjects: number;
  specializations: string[];
  languages: string[];
  mentorshipScore: number;
  collaborationScore: number;
  innovationScore: number;
  customerSatisfaction: number;
}

interface ExpertMatchingPageProps {
  onNavigate: (page: string) => void;
}

const ExpertMatchingPage: React.FC<ExpertMatchingPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isCreatingSwarm, setIsCreatingSwarm] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'hierarchy'>('grid');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    availability: 'all',
    expertise: 'all',
    timezone: 'all',
    workload: 'all',
    level: 'all',
    certification: 'all'
  });

  const [experts] = useState<Expert[]>([
    // Architect Level
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      title: 'Chief SAP Solution Architect',
      level: 'architect',
      department: 'Enterprise Architecture',
      expertise: ['SAP HANA', 'S/4HANA', 'Cloud Architecture', 'Database Optimization', 'Performance Tuning'],
      availability: 'available',
      timezone: 'UTC+8',
      location: 'Singapore',
      rating: 4.95,
      resolvedCases: 847,
      responseTime: '< 3 min',
      workload: 45,
      skillMatch: 98,
      avatar: 'SC',
      recentActivity: 'Led S/4HANA transformation for Fortune 500 client',
      sapComponents: ['HANA', 'BW/4HANA', 'S/4HANA', 'SAP Analytics Cloud', 'SAP BTP'],
      certifications: ['SAP Certified Technology Associate - SAP HANA', 'SAP Certified Application Associate - S/4HANA'],
      experienceYears: 15,
      successRate: 98,
      currentProjects: 3,
      specializations: ['Enterprise Architecture', 'Digital Transformation', 'Cloud Migration'],
      languages: ['English', 'Mandarin', 'Japanese'],
      mentorshipScore: 96,
      collaborationScore: 94,
      innovationScore: 98,
      customerSatisfaction: 97
    },
    // Principal Level
    {
      id: '2',
      name: 'Michael Rodriguez',
      title: 'Principal Integration Specialist',
      level: 'principal',
      department: 'Integration Services',
      expertise: ['SAP PI/PO', 'Cloud Integration', 'API Management', 'EDI', 'Middleware'],
      availability: 'busy',
      timezone: 'UTC-5',
      location: 'New York, USA',
      rating: 4.82,
      resolvedCases: 623,
      responseTime: '< 5 min',
      workload: 75,
      skillMatch: 92,
      avatar: 'MR',
      recentActivity: 'Implementing hybrid integration landscape',
      sapComponents: ['PI/PO', 'CPI', 'API Management', 'SAP BTP', 'Integration Suite'],
      certifications: ['SAP Certified Development Associate - SAP Integration Suite'],
      experienceYears: 12,
      successRate: 95,
      currentProjects: 5,
      specializations: ['System Integration', 'API Design', 'Cloud Connectivity'],
      languages: ['English', 'Spanish', 'Portuguese'],
      mentorshipScore: 89,
      collaborationScore: 92,
      innovationScore: 88,
      customerSatisfaction: 93
    },
    // Senior Level
    {
      id: '3',
      name: 'Priya Patel',
      title: 'Senior Security Consultant',
      level: 'senior',
      department: 'Security & Compliance',
      expertise: ['SAP GRC', 'Identity Management', 'Authorization', 'Audit', 'Compliance'],
      availability: 'available',
      timezone: 'UTC+5:30',
      location: 'Mumbai, India',
      rating: 4.76,
      resolvedCases: 456,
      responseTime: '< 8 min',
      workload: 52,
      skillMatch: 94,
      avatar: 'PP',
      recentActivity: 'Completed SOX compliance audit for multinational client',
      sapComponents: ['GRC', 'Identity Management', 'SU01', 'PFCG', 'CUA'],
      certifications: ['SAP Certified Application Associate - SAP GRC'],
      experienceYears: 9,
      successRate: 94,
      currentProjects: 4,
      specializations: ['Risk Management', 'Compliance Automation', 'Identity Governance'],
      languages: ['English', 'Hindi', 'Gujarati'],
      mentorshipScore: 91,
      collaborationScore: 88,
      innovationScore: 85,
      customerSatisfaction: 92
    },
    // Senior Level
    {
      id: '4',
      name: 'Hans Mueller',
      title: 'Senior Basis Administrator',
      level: 'senior',
      department: 'System Administration',
      expertise: ['SAP Basis', 'System Administration', 'Backup & Recovery', 'Performance Monitoring'],
      availability: 'available',
      timezone: 'UTC+1',
      location: 'Munich, Germany',
      rating: 4.71,
      resolvedCases: 712,
      responseTime: '< 6 min',
      workload: 48,
      skillMatch: 89,
      avatar: 'HM',
      recentActivity: 'Optimized system performance for high-volume processing',
      sapComponents: ['Basis', 'NetWeaver', 'System Copy', 'Transport Management'],
      certifications: ['SAP Certified Technology Associate - System Administration'],
      experienceYears: 11,
      successRate: 92,
      currentProjects: 3,
      specializations: ['System Optimization', 'High Availability', 'Disaster Recovery'],
      languages: ['German', 'English', 'French'],
      mentorshipScore: 87,
      collaborationScore: 90,
      innovationScore: 82,
      customerSatisfaction: 90
    },
    // Mid Level
    {
      id: '5',
      name: 'Akiko Tanaka',
      title: 'Mid-Level ABAP Developer',
      level: 'mid',
      department: 'Development',
      expertise: ['ABAP', 'SAP Fiori', 'OData', 'REST APIs', 'UI5'],
      availability: 'available',
      timezone: 'UTC+9',
      location: 'Tokyo, Japan',
      rating: 4.64,
      resolvedCases: 289,
      responseTime: '< 12 min',
      workload: 68,
      skillMatch: 86,
      avatar: 'AT',
      recentActivity: 'Developed custom Fiori apps for procurement module',
      sapComponents: ['ABAP', 'Fiori', 'UI5', 'Gateway', 'OData'],
      certifications: ['SAP Certified Development Associate - ABAP'],
      experienceYears: 6,
      successRate: 89,
      currentProjects: 6,
      specializations: ['Custom Development', 'User Experience', 'Mobile Apps'],
      languages: ['Japanese', 'English', 'Korean'],
      mentorshipScore: 78,
      collaborationScore: 85,
      innovationScore: 91,
      customerSatisfaction: 87
    },
    // Mid Level
    {
      id: '6',
      name: 'Carlos Santos',
      title: 'Mid-Level Functional Consultant',
      level: 'mid',
      department: 'Functional Consulting',
      expertise: ['SAP MM', 'SAP PP', 'Supply Chain', 'Procurement', 'Inventory Management'],
      availability: 'busy',
      timezone: 'UTC-3',
      location: 'São Paulo, Brazil',
      rating: 4.58,
      resolvedCases: 234,
      responseTime: '< 15 min',
      workload: 82,
      skillMatch: 83,
      avatar: 'CS',
      recentActivity: 'Configured production planning for automotive client',
      sapComponents: ['MM', 'PP', 'WM', 'QM', 'PM'],
      certifications: ['SAP Certified Application Associate - MM', 'SAP Certified Application Associate - PP'],
      experienceYears: 5,
      successRate: 86,
      currentProjects: 4,
      specializations: ['Manufacturing', 'Supply Chain Optimization', 'Process Automation'],
      languages: ['Portuguese', 'Spanish', 'English'],
      mentorshipScore: 76,
      collaborationScore: 80,
      innovationScore: 79,
      customerSatisfaction: 84
    },
    // Junior Level
    {
      id: '7',
      name: 'Emma Johnson',
      title: 'Junior SAP Analyst',
      level: 'junior',
      department: 'Support Services',
      expertise: ['SAP FI', 'SAP CO', 'Financial Reporting', 'Data Analysis'],
      availability: 'available',
      timezone: 'UTC+0',
      location: 'London, UK',
      rating: 4.42,
      resolvedCases: 127,
      responseTime: '< 20 min',
      workload: 35,
      skillMatch: 78,
      avatar: 'EJ',
      recentActivity: 'Assisted with month-end closing procedures',
      sapComponents: ['FI', 'CO', 'FI-CO', 'Reporting'],
      certifications: ['SAP Certified Application Associate - FI'],
      experienceYears: 2,
      successRate: 82,
      currentProjects: 2,
      specializations: ['Financial Analysis', 'Report Generation', 'Data Validation'],
      languages: ['English', 'French'],
      mentorshipScore: 65,
      collaborationScore: 72,
      innovationScore: 68,
      customerSatisfaction: 79
    },
    // Junior Level
    {
      id: '8',
      name: 'Raj Kumar',
      title: 'Junior Technical Support',
      level: 'junior',
      department: 'Technical Support',
      expertise: ['SAP Basis', 'System Monitoring', 'User Management', 'Transport Management'],
      availability: 'available',
      timezone: 'UTC+5:30',
      location: 'Bangalore, India',
      rating: 4.38,
      resolvedCases: 156,
      responseTime: '< 25 min',
      workload: 42,
      skillMatch: 75,
      avatar: 'RK',
      recentActivity: 'Resolved user access issues for finance team',
      sapComponents: ['Basis', 'User Management', 'Transport Management'],
      certifications: ['SAP Certified Technology Associate - Basis Administration'],
      experienceYears: 1.5,
      successRate: 80,
      currentProjects: 3,
      specializations: ['User Support', 'System Monitoring', 'Incident Management'],
      languages: ['English', 'Hindi', 'Tamil'],
      mentorshipScore: 62,
      collaborationScore: 70,
      innovationScore: 64,
      customerSatisfaction: 76
    }
  ]);

  const levelHierarchy = [
    { level: 'architect', label: 'Architect', icon: Crown, color: 'from-purple-600 to-pink-600' },
    { level: 'principal', label: 'Principal', icon: Trophy, color: 'from-blue-600 to-purple-600' },
    { level: 'senior', label: 'Senior', icon: Award, color: 'from-green-600 to-blue-600' },
    { level: 'mid', label: 'Mid-Level', icon: Users2, color: 'from-yellow-600 to-green-600' },
    { level: 'junior', label: 'Junior', icon: GraduationCap, color: 'from-orange-600 to-yellow-600' }
  ];

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         expert.sapComponents.some(comp => comp.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAvailability = filters.availability === 'all' || expert.availability === filters.availability;
    const matchesExpertise = filters.expertise === 'all' || expert.expertise.includes(filters.expertise);
    const matchesLevel = selectedLevel === 'all' || expert.level === selectedLevel;
    
    return matchesSearch && matchesAvailability && matchesExpertise && matchesLevel;
  });

  const handleExpertSelection = (expertId: string) => {
    setSelectedExperts(prev => 
      prev.includes(expertId) 
        ? prev.filter(id => id !== expertId)
        : [...prev, expertId]
    );
  };

  const handleCreateSwarmRoom = () => {
    setIsCreatingSwarm(true);
    setTimeout(() => {
      setIsCreatingSwarm(false);
      onNavigate('swarm');
      setSelectedExperts([]);
    }, 2000);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'away': return 'bg-orange-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'available': return CheckCircle;
      case 'busy': return AlertCircle;
      case 'away': return Clock;
      case 'offline': return XCircle;
      default: return AlertCircle;
    }
  };

  const getLevelIcon = (level: string) => {
    const levelData = levelHierarchy.find(l => l.level === level);
    return levelData ? levelData.icon : Users2;
  };

  const getLevelColor = (level: string) => {
    const levelData = levelHierarchy.find(l => l.level === level);
    return levelData ? levelData.color : 'from-gray-600 to-gray-700';
  };

  const renderExpertCard = (expert: Expert) => {
    const LevelIcon = getLevelIcon(expert.level);
    const AvailabilityIcon = getAvailabilityIcon(expert.availability);
    
    return (
      <div 
        key={expert.id}
        className={`group bg-white/90 backdrop-blur-md rounded-2xl border border-blue-100 p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer transform hover:-translate-y-1 ${
          selectedExperts.includes(expert.id) ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg shadow-blue-500/20' : ''
        }`}
        onClick={() => handleExpertSelection(expert.id)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`relative w-16 h-16 bg-gradient-to-br ${getLevelColor(expert.level)} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
              {expert.avatar}
              <div className="absolute -top-1 -right-1">
                <LevelIcon className="h-6 w-6 text-white bg-black/20 rounded-full p-1" />
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{expert.name}</h4>
              <p className="text-sm text-gray-600 font-medium">{expert.title}</p>
              <p className="text-xs text-gray-500">{expert.department}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getAvailabilityColor(expert.availability)} shadow-sm`}></div>
              <AvailabilityIcon className="h-4 w-4 text-gray-500" />
            </div>
            {selectedExperts.includes(expert.id) && (
              <UserCheck className="h-6 w-6 text-blue-600 bg-blue-50 rounded-full p-1" />
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Skill Match</span>
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${expert.skillMatch}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-900">{expert.skillMatch}%</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Success Rate</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: `${expert.successRate}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-900">{expert.successRate}%</span>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-bold text-gray-900">{expert.rating}</span>
            </div>
            <span className="text-xs text-gray-500">Rating</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-bold text-gray-900">{expert.responseTime}</span>
            </div>
            <span className="text-xs text-gray-500">Response</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-bold text-gray-900">{expert.resolvedCases}</span>
            </div>
            <span className="text-xs text-gray-500">Resolved</span>
          </div>
        </div>

        {/* Location & Availability */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{expert.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{expert.timezone}</span>
          </div>
        </div>

        {/* Workload Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Current Workload</span>
            <span className="text-sm font-bold text-gray-900">{expert.workload}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                expert.workload > 80 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 
                expert.workload > 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                'bg-gradient-to-r from-green-500 to-blue-500'
              }`}
              style={{ width: `${expert.workload}%` }}
            ></div>
          </div>
        </div>

        {/* SAP Components */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Database className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">SAP Components</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {expert.sapComponents.slice(0, 4).map((component, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200 hover:shadow-md transition-shadow"
              >
                {component}
              </span>
            ))}
            {expert.sapComponents.length > 4 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                +{expert.sapComponents.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Certifications</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {expert.certifications.slice(0, 2).map((cert, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 text-xs font-medium rounded-full border border-green-200"
              >
                {cert.replace('SAP Certified', 'SAP Cert.')}
              </span>
            ))}
          </div>
        </div>

        {/* Experience & Languages */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{expert.experienceYears} years exp.</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{expert.languages.length} languages</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Recent Activity</span>
          </div>
          <p className="text-xs text-gray-600">{expert.recentActivity}</p>
        </div>

        {/* Hover Actions */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
              <Eye className="h-4 w-4" />
              <span>View Profile</span>
            </button>
            <button className="flex items-center space-x-1 text-green-600 hover:text-green-800 text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              <span>Quick Chat</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

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
                className="flex items-center space-x-2 text-blue-600 font-medium"
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
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-blue-100">
          <div className="px-4 py-3 space-y-3">
            <button 
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors w-full"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => { onNavigate('chat'); setMobileMenuOpen(false); }}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors w-full"
            >
              <Bot className="h-4 w-4" />
              <span>AI Assistant</span>
            </button>
            <button 
              onClick={() => { onNavigate('experts'); setMobileMenuOpen(false); }}
              className="flex items-center space-x-2 text-blue-600 font-medium w-full"
            >
              <Users className="h-4 w-4" />
              <span>Expert Matching</span>
            </button>
            <button 
              onClick={() => { onNavigate('swarm'); setMobileMenuOpen(false); }}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors w-full"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Swarm Rooms</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Title and Stats */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-blue-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Expert Matching System</h2>
                <p className="text-gray-600">AI-powered expert allocation for SAP support cases</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{experts.length}</div>
                  <div className="text-sm text-gray-600">Total Experts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {experts.filter(e => e.availability === 'available').length}
                  </div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(experts.reduce((sum, e) => sum + e.rating, 0) / experts.length * 100) / 100}
                  </div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {experts.reduce((sum, e) => sum + e.resolvedCases, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Cases Resolved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-blue-100 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search experts by name, skills, SAP components, or certifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <BarChart3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('hierarchy')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'hierarchy' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Layers className="h-5 w-5" />
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl hover:from-blue-200 hover:to-purple-200 transition-all duration-300 text-blue-800 font-medium"
                  >
                    <Filter className="h-5 w-5" />
                    <span>Advanced Filters</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {filterOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 z-30">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Availability Status</label>
                          <select
                            value={filters.availability}
                            onChange={(e) => setFilters({...filters, availability: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">All Statuses</option>
                            <option value="available">Available</option>
                            <option value="busy">Busy</option>
                            <option value="away">Away</option>
                            <option value="offline">Offline</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Expertise Area</label>
                          <select
                            value={filters.expertise}
                            onChange={(e) => setFilters({...filters, expertise: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">All Expertise Areas</option>
                            <option value="SAP HANA">SAP HANA</option>
                            <option value="SAP PI/PO">SAP PI/PO</option>
                            <option value="SAP GRC">SAP GRC</option>
                            <option value="SAP Basis">SAP Basis</option>
                            <option value="ABAP">ABAP Development</option>
                            <option value="SAP MM">SAP MM</option>
                            <option value="SAP FI">SAP FI</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Experience Level</label>
                          <select
                            value={filters.level}
                            onChange={(e) => setFilters({...filters, level: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">All Levels</option>
                            <option value="architect">Architect</option>
                            <option value="principal">Principal</option>
                            <option value="senior">Senior</option>
                            <option value="mid">Mid-Level</option>
                            <option value="junior">Junior</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Workload Capacity</label>
                          <select
                            value={filters.workload}
                            onChange={(e) => setFilters({...filters, workload: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">All Workloads</option>
                            <option value="light">Light ({'<'} 50%)</option>
                            <option value="moderate">Moderate (50-70%)</option>
                            <option value="heavy">Heavy ({'>'} 70%)</option>
                          </select>
                        </div>
                        <button
                          onClick={() => setFilters({
                            availability: 'all',
                            expertise: 'all',
                            timezone: 'all',
                            workload: 'all',
                            level: 'all',
                            certification: 'all'
                          })}
                          className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-blue-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">AI-Powered Recommendations</h3>
            </div>
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-xl border border-blue-200">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">For Current Case Context</h4>
                  <p className="text-sm text-gray-700">
                    Based on <strong>SAP HANA performance optimization</strong> requirements, 
                    I recommend a multi-tiered approach with complementary expertise.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Optimal Team Composition</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">1x Architect (Strategy)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">1x Senior (Implementation)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">1x Mid-Level (Support)</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Success Probability</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">94%</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Based on historical data, skill matching, and timezone optimization
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Level Hierarchy Navigation */}
          {viewMode === 'hierarchy' && (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-blue-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Layers className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Expert Hierarchy</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedLevel('all')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    selectedLevel === 'all' 
                      ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>All Levels</span>
                  <span className="bg-white/20 text-xs px-2 py-1 rounded-full">{experts.length}</span>
                </button>
                {levelHierarchy.map((level) => {
                  const Icon = level.icon;
                  const count = experts.filter(e => e.level === level.level).length;
                  return (
                    <button
                      key={level.level}
                      onClick={() => setSelectedLevel(level.level)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                        selectedLevel === level.level 
                          ? `bg-gradient-to-r ${level.color} text-white` 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{level.label}</span>
                      <span className="bg-white/20 text-xs px-2 py-1 rounded-full">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Expert Cards */}
          <div className="space-y-6">
            {viewMode === 'hierarchy' ? (
              // Hierarchy View
              levelHierarchy.map((level) => {
                const levelExperts = filteredExperts.filter(e => e.level === level.level);
                if (levelExperts.length === 0) return null;
                
                const Icon = level.icon;
                return (
                  <div key={level.level} className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 bg-gradient-to-r ${level.color} rounded-xl`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{level.label} Level</h3>
                        <p className="text-sm text-gray-600">{levelExperts.length} experts available</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {levelExperts.map(renderExpertCard)}
                    </div>
                  </div>
                );
              })
            ) : (
              // Grid View
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExperts.map(renderExpertCard)}
              </div>
            )}
          </div>

          {/* Empty State */}
          {filteredExperts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No experts found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters to find the right experts.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    availability: 'all',
                    expertise: 'all',
                    timezone: 'all',
                    workload: 'all',
                    level: 'all',
                    certification: 'all'
                  });
                  setSelectedLevel('all');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Create Swarm Room Button */}
          {selectedExperts.length > 0 && (
            <div className="fixed bottom-8 right-8 z-50">
              <button
                onClick={handleCreateSwarmRoom}
                disabled={isCreatingSwarm}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-3 disabled:opacity-50 transform hover:scale-105"
              >
                {isCreatingSwarm ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span className="font-semibold">Creating Swarm Room...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-6 w-6" />
                    <span className="font-semibold">Create Swarm Room</span>
                    <span className="bg-white/20 text-sm px-3 py-1 rounded-full">
                      {selectedExperts.length} expert{selectedExperts.length > 1 ? 's' : ''}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertMatchingPage;
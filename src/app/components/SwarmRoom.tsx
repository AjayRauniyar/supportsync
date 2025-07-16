import React, { useState } from 'react';
import { 
  Users, 
  ArrowLeft, 
  MessageSquare,
  Settings,
  Play,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Plus,
  Search,
  Filter,
  MoreVertical,
  AlertCircle,
  User,
  MapPin,
  Star,
  Activity,
  Zap,
  Shield,
  Database,
  Globe
} from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  title: string;
  department: string;
  expertise: string[];
  availability: 'available' | 'busy' | 'away';
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
}

interface SwarmRoom {
  id: string;
  name: string;
  caseId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'resolved' | 'escalated';
  experts: Expert[];
  createdAt: string;
  description: string;
  sapComponent: string;
  estimatedResolution: string;
}

interface SwarmRoomsPageProps {
  onNavigate: (page: string) => void;
}

const SwarmRoomsPage: React.FC<SwarmRoomsPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const [experts] = useState<Expert[]>([
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      title: 'Senior SAP HANA Architect',
      department: 'Cloud Infrastructure',
      expertise: ['SAP HANA', 'Database Optimization', 'Performance Tuning'],
      availability: 'available',
      timezone: 'UTC+8',
      location: 'Singapore',
      rating: 4.9,
      resolvedCases: 247,
      responseTime: '< 5 min',
      workload: 65,
      skillMatch: 95,
      avatar: 'SC',
      recentActivity: 'Resolved HANA memory issue',
      sapComponents: ['HANA', 'BW/4HANA', 'S/4HANA']
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      title: 'SAP Integration Specialist',
      department: 'Integration Services',
      expertise: ['SAP PI/PO', 'Cloud Integration', 'API Management'],
      availability: 'busy',
      timezone: 'UTC-5',
      location: 'New York, USA',
      rating: 4.7,
      resolvedCases: 189,
      responseTime: '< 10 min',
      workload: 85,
      skillMatch: 88,
      avatar: 'MR',
      recentActivity: 'Working on API gateway setup',
      sapComponents: ['PI/PO', 'CPI', 'API Management']
    },
    {
      id: '3',
      name: 'Priya Patel',
      title: 'SAP Security Consultant',
      department: 'Security & Compliance',
      expertise: ['SAP GRC', 'Identity Management', 'Authorization'],
      availability: 'available',
      timezone: 'UTC+5:30',
      location: 'Mumbai, India',
      rating: 4.8,
      resolvedCases: 156,
      responseTime: '< 7 min',
      workload: 45,
      skillMatch: 92,
      avatar: 'PP',
      recentActivity: 'Completed GRC implementation',
      sapComponents: ['GRC', 'Identity Management', 'SU01']
    },
    {
      id: '4',
      name: 'Hans Mueller',
      title: 'SAP Basis Administrator',
      department: 'System Administration',
      expertise: ['SAP Basis', 'System Administration', 'Backup & Recovery'],
      availability: 'available',
      timezone: 'UTC+1',
      location: 'Munich, Germany',
      rating: 4.6,
      resolvedCases: 312,
      responseTime: '< 8 min',
      workload: 55,
      skillMatch: 87,
      avatar: 'HM',
      recentActivity: 'System upgrade completed',
      sapComponents: ['Basis', 'NetWeaver', 'System Copy']
    },
    {
      id: '5',
      name: 'Elena Volkov',
      title: 'SAP Fiori Developer',
      department: 'Frontend Development',
      expertise: ['SAP Fiori', 'UI5', 'UX Design'],
      availability: 'available',
      timezone: 'UTC+3',
      location: 'Berlin, Germany',
      rating: 4.7,
      resolvedCases: 134,
      responseTime: '< 6 min',
      workload: 40,
      skillMatch: 89,
      avatar: 'EV',
      recentActivity: 'Deployed new Fiori app',
      sapComponents: ['Fiori', 'UI5', 'Gateway']
    }
  ]);

  const [swarmRooms] = useState<SwarmRoom[]>([
    {
      id: 'swarm-001',
      name: 'Critical HANA Performance Issue',
      caseId: 'CASE-2024-001',
      severity: 'critical',
      status: 'active',
      experts: [experts[0], experts[3]],
      createdAt: '2024-01-15T10:30:00Z',
      description: 'HANA database experiencing severe performance degradation affecting production systems',
      sapComponent: 'SAP HANA',
      estimatedResolution: '2 hours'
    },
    {
      id: 'swarm-002',
      name: 'Integration Connectivity Problem',
      caseId: 'CASE-2024-002',
      severity: 'high',
      status: 'active',
      experts: [experts[1]],
      createdAt: '2024-01-15T09:15:00Z',
      description: 'API connections failing between SAP and external systems',
      sapComponent: 'Cloud Integration',
      estimatedResolution: '4 hours'
    },
    {
      id: 'swarm-003',
      name: 'Authorization Matrix Update',
      caseId: 'CASE-2024-003',
      severity: 'medium',
      status: 'resolved',
      experts: [experts[2]],
      createdAt: '2024-01-14T14:20:00Z',
      description: 'User role assignments need to be updated for new security requirements',
      sapComponent: 'GRC',
      estimatedResolution: 'Resolved'
    },
    {
      id: 'swarm-004',
      name: 'Fiori App Performance Optimization',
      caseId: 'CASE-2024-004',
      severity: 'medium',
      status: 'active',
      experts: [experts[4]],
      createdAt: '2024-01-15T08:45:00Z',
      description: 'Slow loading times in custom Fiori application affecting user experience',
      sapComponent: 'Fiori',
      estimatedResolution: '6 hours'
    },
    {
      id: 'swarm-005',
      name: 'System Migration Planning',
      caseId: 'CASE-2024-005',
      severity: 'low',
      status: 'active',
      experts: [experts[3], experts[0]],
      createdAt: '2024-01-15T07:00:00Z',
      description: 'Planning phase for SAP S/4HANA migration from legacy system',
      sapComponent: 'S/4HANA',
      estimatedResolution: '1 week'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'resolved': return 'text-blue-600 bg-blue-100';
      case 'escalated': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'away': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSapComponentIcon = (component: string) => {
    switch (component.toLowerCase()) {
      case 'sap hana':
      case 'hana':
        return <Database className="h-4 w-4" />;
      case 'cloud integration':
      case 'integration':
        return <Globe className="h-4 w-4" />;
      case 'grc':
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'fiori':
        return <Zap className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const filteredRooms = swarmRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.sapComponent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    }
    return `${minutes}m ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => onNavigate('home')}
                className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Swarm Rooms</h1>
                <p className="text-sm text-gray-600">Collaborative problem-solving spaces</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Plus className="h-4 w-4 inline mr-2" />
                Create Room
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms, cases, or components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/80 backdrop-blur-md border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white/80 backdrop-blur-md border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
              </select>
            </div>
          </div>

          {/* Swarm Room Statistics */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-md rounded-xl border border-blue-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-green-400 to-green-600 rounded-lg">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Rooms</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                  <p className="text-xs text-green-600">+2 from yesterday</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-xl border border-blue-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Resolved Today</p>
                  <p className="text-2xl font-bold text-gray-900">7</p>
                  <p className="text-xs text-blue-600">94% success rate</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-xl border border-blue-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Resolution</p>
                  <p className="text-2xl font-bold text-gray-900">3.2h</p>
                  <p className="text-xs text-yellow-600">-15% from last week</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-xl border border-blue-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experts Online</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-purple-600">Across 8 timezones</p>
                </div>
              </div>
            </div>
          </div>

          {/* Swarm Room Cards */}
          <div className="space-y-4">
            {filteredRooms.map((room) => (
              <div 
                key={room.id}
                className={`bg-white/80 backdrop-blur-md rounded-xl border border-blue-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  selectedRoom === room.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        {getSapComponentIcon(room.sapComponent)}
                        <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(room.severity)} text-white`}>
                        {room.severity.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                        {room.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{room.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{room.caseId}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Created {formatTimeAgo(room.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>ETA: {room.estimatedResolution}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle join room
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm"
                    >
                      <MessageSquare className="h-4 w-4 inline mr-1" />
                      Join Room
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle menu
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expert List */}
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-sm font-medium text-gray-700">Experts:</span>
                  <div className="flex items-center space-x-2">
                    {room.experts.map((expert) => (
                      <div key={expert.id} className="relative group">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {expert.avatar}
                        </div>
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getAvailabilityColor(expert.availability)}`}></div>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          <div>{expert.name}</div>
                          <div className="text-gray-300">{expert.title}</div>
                          <div className="text-gray-300">{expert.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedRoom === room.id && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Room Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">SAP Component:</span>
                            <span className="font-medium">{room.sapComponent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Priority:</span>
                            <span className={`font-medium ${room.severity === 'critical' ? 'text-red-600' : room.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'}`}>
                              {room.severity.charAt(0).toUpperCase() + room.severity.slice(1)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="font-medium">{room.status.charAt(0).toUpperCase() + room.status.slice(1)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Expert Information</h4>
                        <div className="space-y-3">
                          {room.experts.map((expert) => (
                            <div key={expert.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                  {expert.avatar}
                                </div>
                                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getAvailabilityColor(expert.availability)}`}></div>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{expert.name}</div>
                                <div className="text-sm text-gray-600">{expert.title}</div>
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{expert.location}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-3 w-3 text-yellow-500" />
                                    <span>{expert.rating}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white/80 backdrop-blur-md rounded-xl border border-blue-100 p-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No swarm rooms found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Create your first swarm room to start collaborating'
                  }
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                  <Plus className="h-4 w-4 inline mr-2" />
                  Create New Room
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwarmRoomsPage;
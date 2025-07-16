import React, { useState } from 'react';
import { 
  Users, 
  ArrowLeft, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Star, 
  ChevronDown,
  UserCheck,
  Zap,
  UserPlus
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

interface ExpertMatchingPageProps {
  onNavigate: (page: string) => void;
}

const ExpertMatchingPage: React.FC<ExpertMatchingPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isCreatingSwarm, setIsCreatingSwarm] = useState(false);
  const [filters, setFilters] = useState({
    availability: 'all',
    expertise: 'all',
    timezone: 'all',
    workload: 'all'
  });

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
    }
  ]);

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAvailability = filters.availability === 'all' || expert.availability === filters.availability;
    const matchesExpertise = filters.expertise === 'all' || expert.expertise.includes(filters.expertise);
    
    return matchesSearch && matchesAvailability && matchesExpertise;
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
      case 'away': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
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
                <h1 className="text-xl font-bold text-gray-900">Expert Matching</h1>
                <p className="text-sm text-gray-600">AI-powered expert allocation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('swarm')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Swarm Rooms
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Search and Filter Bar */}
          <div className="bg-white/80 backdrop-blur-md rounded-xl border border-blue-100 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search experts by name, skills, or SAP components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center space-x-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                        <select
                          value={filters.availability}
                          onChange={(e) => setFilters({...filters, availability: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="all">All</option>
                          <option value="available">Available</option>
                          <option value="busy">Busy</option>
                          <option value="away">Away</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
                        <select
                          value={filters.expertise}
                          onChange={(e) => setFilters({...filters, expertise: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="all">All Expertise</option>
                          <option value="SAP HANA">SAP HANA</option>
                          <option value="SAP PI/PO">SAP PI/PO</option>
                          <option value="SAP GRC">SAP GRC</option>
                          <option value="SAP Basis">SAP Basis</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white/80 backdrop-blur-md rounded-xl border border-blue-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                Based on the current case context (SAP HANA performance issue), I recommend selecting 
                <strong> Dr. Sarah Chen</strong> for database expertise and <strong>Hans Mueller</strong> for 
                system administration support. Their combined skill match is 91% with optimal timezone coverage.
              </p>
            </div>
          </div>

          {/* Expert Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert) => (
              <div 
                key={expert.id}
                className={`bg-white/80 backdrop-blur-md rounded-xl border border-blue-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  selectedExperts.includes(expert.id) ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
                onClick={() => handleExpertSelection(expert.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {expert.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{expert.name}</h4>
                      <p className="text-sm text-gray-600">{expert.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getAvailabilityColor(expert.availability)}`}></div>
                    {selectedExperts.includes(expert.id) && (
                      <UserCheck className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Skill Match</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{ width: `${expert.skillMatch}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{expert.skillMatch}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Workload</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            expert.workload > 80 ? 'bg-red-500' : 
                            expert.workload > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${expert.workload}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{expert.workload}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{expert.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{expert.responseTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{expert.location}</span>
                    <span className="text-sm text-gray-500">({expert.timezone})</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {expert.sapComponents.slice(0, 3).map((component, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {component}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">{expert.recentActivity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create Swarm Room Button */}
          {selectedExperts.length > 0 && (
            <div className="fixed bottom-6 right-6">
              <button
                onClick={handleCreateSwarmRoom}
                disabled={isCreatingSwarm}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
              >
                {isCreatingSwarm ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Swarm Room...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Create Swarm Room ({selectedExperts.length})</span>
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
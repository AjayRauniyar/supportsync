import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Users, MessageSquare, Home, Zap, Shield, Network, 
  Play, CheckCircle, AlertCircle, Sparkles, Menu, X, ArrowRight,
  TrendingUp, Clock, Star, ChevronRight, Settings, Bell,
  Database, Cloud, Cpu, Globe, BarChart3, Headphones,
  Hexagon, Triangle, Square, Circle
} from 'lucide-react';
import CustomerChatBot from './ChatBot';

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
};


const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  
  const handleGetStarted = () => {
    // Navigate to integration page when user clicks "Get Started"
    onNavigate('integration');
  };

  const handleFeatureDemo = (featureType: string) => {
    // Navigate to specific feature demonstration
    onNavigate('integration', { demoFeature: featureType });
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isHovering, setIsHovering] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for 3D parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({ 
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height
        });
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Enhanced canvas animation with diverse colors
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      opacity: number;
    }> = [];

    // Diverse color palette
    const colors = ['#0f62fe', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

    // Create particles with diverse colors
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.4 + 0.2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Draw subtle connections
        particles.slice(index + 1).forEach(otherParticle => {
          const distance = Math.hypot(particle.x - otherParticle.x, particle.y - otherParticle.y);
          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - distance / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'Instant AI-Powered Resolution',
      description: 'Advanced AI analyzes case patterns and suggests solutions in real-time, reducing resolution time by 50%.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      stats: '2.3x faster',
      accentColor: 'text-blue-600'
    },
    {
      icon: Shield,
      title: 'Smart Context Intelligence',
      description: 'RAG-based knowledge synthesis provides comprehensive case summaries with relevant historical data.',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      stats: '95% accuracy',
      accentColor: 'text-emerald-600'
    },
    {
      icon: Network,
      title: 'Seamless Team Collaboration',
      description: 'Native Microsoft Teams integration with real-time expert matching and instant room creation.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      stats: '40% less escalation',
      accentColor: 'text-purple-600'
    },
    {
      icon: Database,
      title: 'SAP System Integration',
      description: 'Deep integration with SAP ERP, S/4HANA, BTP, and SuccessFactors for comprehensive support.',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      stats: '99.9% uptime',
      accentColor: 'text-orange-600'
    },
    {
      icon: Cloud,
      title: 'Cloud-Native Architecture',
      description: 'Scalable microservices architecture ensuring high availability and enterprise-grade security.',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
      stats: '24/7 available',
      accentColor: 'text-cyan-600'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time dashboards and predictive analytics for proactive issue identification.',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      stats: '70% prediction',
      accentColor: 'text-indigo-600'
    }
  ];

  const stats = [
    { 
      value: '50%', 
      label: 'Faster Resolution', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50',
      icon: TrendingUp 
    },
    { 
      value: '85%', 
      label: 'Expert Match Accuracy', 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50',
      icon: Star 
    },
    { 
      value: '40%', 
      label: 'Reduced Escalations', 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50',
      icon: ArrowRight 
    },
    { 
      value: '99.9%', 
      label: 'System Uptime', 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50',
      icon: Shield 
    }
  ];

  const recentActivity = [
    {
      icon: CheckCircle,
      title: 'SAP HANA Performance Issue Resolved',
      description: 'Critical database performance optimized in 23 minutes',
      time: '2 min ago',
      case: '#SAP-12345',
      severity: 'High',
      severityColor: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    {
      icon: Users,
      title: 'Expert Team Assembled',
      description: '3 senior SAP consultants matched for S/4HANA migration',
      time: '5 min ago',
      case: '#SAP-12346',
      severity: 'Medium',
      severityColor: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      icon: AlertCircle,
      title: 'New Critical Case Opened',
      description: 'SAP BTP connectivity issue affecting production',
      time: '8 min ago',
      case: '#SAP-12347',
      severity: 'Critical',
      severityColor: 'bg-red-100 text-red-700 border-red-200'
    },
    {
      icon: Bot,
      title: 'AI Assistant Suggestion',
      description: 'Recommended knowledge base article for Case #SAP-12348',
      time: '12 min ago',
      case: '#SAP-12348',
      severity: 'Low',
      severityColor: 'bg-gray-100 text-gray-700 border-gray-200'
    }
  ];

  const expertSpotlight = [
    {
      name: 'Dr. Sarah Chen',
      role: 'SAP HANA Expert',
      cases: 47,
      rating: 4.9,
      specialization: 'Performance Optimization',
      avatarColor: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Michael Rodriguez',
      role: 'S/4HANA Architect',
      cases: 52,
      rating: 4.8,
      specialization: 'Migration & Integration',
      avatarColor: 'from-emerald-500 to-emerald-600'
    },
    {
      name: 'Priya Sharma',
      role: 'BTP Specialist',
      cases: 38,
      rating: 4.9,
      specialization: 'Cloud Integration',
      avatarColor: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, 
            #f8fafc 0%, 
            #e2e8f0 25%, 
            #cbd5e1 50%, 
            #94a3b8 75%, 
            #64748b 100%
          )
        `
      }}
    >
      {/* Enhanced animated canvas background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none opacity-30"
      />

      {/* Subtle 3D Environment Background */}
      <div 
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)
          `,
          transform: `translate3d(${mousePosition.x * 15}px, ${mousePosition.y * 15}px, 0)`,
          transition: 'transform 0.1s ease-out'
        }}
      />

      {/* Colorful morphing geometric shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-morph-float opacity-8"
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${5 + (i * 12)}%`,
              transform: `
                translate3d(${mousePosition.x * (8 + i * 4)}px, ${mousePosition.y * (8 + i * 4)}px, 0)
                rotateX(${mousePosition.y * (4 + i)}deg)
                rotateY(${mousePosition.x * (4 + i)}deg)
                rotateZ(${scrollY * 0.1 + i * 30}deg)
              `,
              animationDelay: `${i * 0.5}s`,
              transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
          >
            <div 
              className={`w-${12 + i * 3} h-${12 + i * 3} ${
                i === 0 ? 'bg-gradient-to-r from-blue-400/20 to-blue-500/20' :
                i === 1 ? 'bg-gradient-to-r from-emerald-400/20 to-emerald-500/20' :
                i === 2 ? 'bg-gradient-to-r from-purple-400/20 to-purple-500/20' :
                i === 3 ? 'bg-gradient-to-r from-orange-400/20 to-orange-500/20' :
                i === 4 ? 'bg-gradient-to-r from-pink-400/20 to-pink-500/20' :
                'bg-gradient-to-r from-cyan-400/20 to-cyan-500/20'
              } backdrop-blur-xl ${
                i % 4 === 0 ? 'rounded-none' :
                i % 4 === 1 ? 'rounded-full' :
                i % 4 === 2 ? 'rounded-xl rotate-45' :
                'rounded-lg'
              } border border-white/20`}
            />
          </div>
        ))}
      </div>

      {/* Clean Header with white background */}
      <header className="relative z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div 
                className="relative transform-gpu"
                style={{
                  transform: `rotateX(${mousePosition.y * 8}deg) rotateY(${mousePosition.x * 8}deg)`,
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
            
            {/* Clean Navigation */}
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

      {/* Hero Section with clean design */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Floating badge */}
          <div 
            className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full border border-gray-200 mb-8 transform-gpu shadow-lg"
            style={{
              transform: `translateY(${Math.sin(Date.now() * 0.001) * 4}px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <Sparkles className="h-5 w-5 text-blue-500 animate-spin-slow" />
            <span className="text-gray-700 font-medium">Next-Generation SAP Support Platform</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>

          {/* Main title */}
          <h2 
            className="text-4xl md:text-7xl font-bold mb-6 leading-tight transform-gpu"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <span className="block text-gray-800 mb-2 drop-shadow-lg">
              Revolutionizing SAP Support with
            </span>
            <span 
              className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-shift"
              style={{ 
                filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))'
              }}
            >
              AI-Powered Intelligence
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Experience the future of SAP support with our AI-driven platform that connects the right experts instantly, 
            provides intelligent case analysis, and creates seamless collaboration environments for faster resolution.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => setChatOpen(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="relative flex items-center space-x-2 z-10">
                <Bot className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Start AI Assistant</span>
              </div>
            </button>
            <button className="group relative overflow-hidden bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="relative flex items-center space-x-2 z-10">
                <Users className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Find SAP Experts</span>
              </div>
            </button>
          </div>
          
          {/* Clean Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg transform-gpu ${stat.bgColor}`}
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * (1 + index * 0.2)}deg) rotateY(${mousePosition.x * (1 + index * 0.2)}deg) translateZ(${isHovering === index ? '15px' : '0px'})`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                onMouseEnter={() => setIsHovering(index)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                      <stat.icon className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with colorful clean cards */}
      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Intelligent Features
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how our AI-powered platform transforms SAP support with cutting-edge technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-500 hover:shadow-xl transform-gpu`}
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * (0.8 + index * 0.2)}deg) rotateY(${mousePosition.x * (0.8 + index * 0.2)}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.3s ease-out, box-shadow 0.5s ease'
                }}
              >
                <div className={`absolute inset-0 ${feature.bgColor} rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div 
                    className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <feature.icon className="h-7 w-7 text-white drop-shadow-sm" />
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`text-xl font-semibold ${feature.textColor} group-hover:text-gray-800 transition-colors duration-300`}>
                      {feature.title}
                    </h4>
                    <span className={`text-sm font-medium ${feature.accentColor} bg-gray-100 px-2 py-1 rounded-full`}>
                      {feature.stats}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 mb-4">
                    {feature.description}
                  </p>
                  <button className={`${feature.accentColor} hover:text-gray-700 flex items-center space-x-1 font-medium group/btn transition-colors duration-300`}>
                    <span>Learn more</span>
                    <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout with clean white cards */}
      <div className="relative z-10 grid lg:grid-cols-2 gap-8 mb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Recent Activity */}
        <div 
          className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-500 transform-gpu"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 0.8}deg) rotateY(${mousePosition.x * 0.8}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Live Activity Feed</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 border border-gray-100"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <activity.icon className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-gray-800 truncate">{activity.title}</div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${activity.severityColor}`}>
                      {activity.severity}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{activity.description}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-600">{activity.case}</span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Spotlight */}
        <div 
          className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-500 transform-gpu"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * -0.8}deg) rotateY(${mousePosition.x * -0.8}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Expert Spotlight</h3>
            <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm font-medium group">
              <span>View all</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
          <div className="space-y-4">
            {expertSpotlight.map((expert, index) => (
              <div 
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${expert.avatarColor} rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}>
                  {expert.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{expert.name}</div>
                  <div className="text-sm text-gray-600">{expert.role}</div>
                  <div className="text-xs text-gray-500">{expert.specialization}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{expert.rating}</span>
                  </div>
                  <div className="text-xs text-gray-500">{expert.cases} cases</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div 
        className="relative z-10 mx-4 sm:mx-6 lg:mx-8 mb-16 max-w-7xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white shadow-2xl transform-gpu"
        style={{
          transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg) rotateY(${mousePosition.x * 1}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="relative z-10 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your SAP Support?</h3>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of SAP professionals who trust SupportSync for faster, smarter support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setChatOpen(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 justify-center shadow-lg"
            >
              <Bot className="h-5 w-5" />
              <span>Try AI Assistant</span>
            </button>
            <button className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 justify-center shadow-lg">
              <Headphones className="h-5 w-5" />
              <span>Schedule Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Bot */}
      <CustomerChatBot chatOpen={chatOpen} setChatOpen={setChatOpen} />

      {/* Footer */}
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
      </footer>

      {/* Enhanced Global Styles */}
      <style jsx global>{`
        @keyframes morph-float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg) scale(1);
            border-radius: 50% 20% 50% 20%;
          }
          25% {
            transform: translateY(-12px) rotate(90deg) scale(1.05);
            border-radius: 20% 50% 20% 50%;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg) scale(0.95);
            border-radius: 50% 50% 20% 20%;
          }
          75% {
            transform: translateY(-12px) rotate(270deg) scale(1.02);
            border-radius: 20% 20% 50% 50%;
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-morph-float {
          animation: morph-float 12s ease-in-out infinite;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 3px;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Enhanced backdrop filter support */
        .backdrop-blur-xl {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
};

export default HomePage;

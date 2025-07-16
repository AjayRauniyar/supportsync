import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Users,
  MessageSquare,
  Settings,
  Share2,
  ArrowLeft,
  MoreVertical,
  Camera,
  Monitor,
  Volume2,
  VolumeX,
  Circle,
  Bot,
  FileText,
  Download,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Send,
  Paperclip,
  Smile
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
  isScreenSharing: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'ai';
}

interface MeetingNote {
  id: string;
  timestamp: Date;
  content: string;
  type: 'transcription' | 'summary' | 'action' | 'suggestion';
  speaker?: string;
}

interface VideoChatRoomProps {
  roomId: string;
  roomName: string;
  onLeave: () => void;
  aiEnabled: boolean;
  recordingEnabled: boolean;
  participants: Participant[];
}

const SwarmRoomsPage: React.FC<VideoChatRoomProps> = ({ 
  roomId, 
  roomName, 
  onLeave, 
  aiEnabled, 
  recordingEnabled, 
  participants 
}) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiNotes, setAiNotes] = useState<MeetingNote[]>([]);
  const [selectedAiTab, setSelectedAiTab] = useState('transcription');

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const startTime = useRef(new Date());

  // Initialize video stream
  useEffect(() => {
    initializeVideoStream();
    
    // Start meeting timer
    const timer = setInterval(() => {
      setMeetingDuration(Math.floor((new Date().getTime() - startTime.current.getTime()) / 1000));
    }, 1000);

    // Simulate connection status
    setTimeout(() => setConnectionStatus('connected'), 2000);

    return () => clearInterval(timer);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate AI transcription and notes
  useEffect(() => {
    if (aiEnabled && connectionStatus === 'connected') {
      const interval = setInterval(() => {
        simulateAiTranscription();
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [aiEnabled, connectionStatus]);

  const initializeVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setConnectionStatus('disconnected');
    }
  };

  const simulateAiTranscription = () => {
    const transcriptions = [
      "Let's start by analyzing the HANA performance metrics",
      "I see the issue is related to memory allocation",
      "We should check the database connection pool settings",
      "The solution involves optimizing the SQL queries",
      "Let me share my screen to show the configuration"
    ];

    const summaries = [
      "Main issue identified: HANA performance degradation due to memory allocation",
      "Action required: Optimize SQL queries and connection pool settings",
      "Next steps: Review database configuration and implement changes"
    ];

    const actions = [
      "TODO: Update connection pool settings to max 50 connections",
      "TODO: Optimize the customer report SQL query",
      "TODO: Schedule performance testing for tomorrow 2 PM"
    ];

    const suggestions = [
      "Consider implementing query result caching",
      "Monitor memory usage patterns for next 24 hours",
      "Review indexing strategy for frequently accessed tables"
    ];

    const noteTypes = ['transcription', 'summary', 'action', 'suggestion'];
    const noteType = noteTypes[Math.floor(Math.random() * noteTypes.length)];
    
    let content = '';
    let speaker = '';
    
    switch (noteType) {
      case 'transcription':
        content = transcriptions[Math.floor(Math.random() * transcriptions.length)];
        speaker = participants[Math.floor(Math.random() * participants.length)]?.name || 'Unknown';
        break;
      case 'summary':
        content = summaries[Math.floor(Math.random() * summaries.length)];
        break;
      case 'action':
        content = actions[Math.floor(Math.random() * actions.length)];
        break;
      case 'suggestion':
        content = suggestions[Math.floor(Math.random() * suggestions.length)];
        break;
    }

    const newNote: MeetingNote = {
      id: Date.now().toString(),
      timestamp: new Date(),
      content,
      type: noteType as any,
      speaker: noteType === 'transcription' ? speaker : undefined
    };

    setAiNotes(prev => [...prev, newNote]);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // Implement actual video toggle logic here
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // Implement actual audio toggle logic here
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // Implement actual screen share logic here
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement actual recording logic here
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        userId: 'current-user',
        userName: 'You',
        message: newMessage,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getNoteIcon = (type: string) => {
    switch (type) {
      case 'transcription':
        return <Mic className="h-4 w-4" />;
      case 'summary':
        return <FileText className="h-4 w-4" />;
      case 'action':
        return <CheckCircle className="h-4 w-4" />;
      case 'suggestion':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const exportMeetingNotes = () => {
    const notesText = aiNotes.map(note => 
      `[${note.timestamp.toLocaleTimeString()}] ${note.type.toUpperCase()}: ${note.content}`
    ).join('\n');
    
    const blob = new Blob([notesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-notes-${roomId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onLeave}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">{roomName}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span>Room ID: {roomId}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(meetingDuration)}</span>
              </div>
              <span>•</span>
              <span>{participants.length} participants</span>
              {isRecording && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1 text-red-400">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span>Recording</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            connectionStatus === 'connected' ? 'bg-green-600' : 
            connectionStatus === 'connecting' ? 'bg-yellow-600' : 'bg-red-600'
          }`}>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="capitalize">{connectionStatus}</span>
          </div>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gray-900">
            {/* Main video area */}
            <div className="h-full flex items-center justify-center relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="max-w-full max-h-full object-cover rounded-lg"
              />
              
              {/* Participant grid overlay */}
              <div className="absolute bottom-4 right-4 grid grid-cols-2 gap-2 max-w-md">
                {participants.slice(0, 4).map((participant) => (
                  <div
                    key={participant.id}
                    className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video w-32"
                  >
                    <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {participant.name}
                    </div>
                    <div className="absolute top-1 right-1 flex space-x-1">
                      {!participant.videoEnabled && (
                        <VideoOff className="h-3 w-3 text-red-400" />
                      )}
                      {!participant.audioEnabled && (
                        <MicOff className="h-3 w-3 text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-gray-800 text-white flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Chat</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium">{message.userName}</span>
                    <span className="text-gray-400 text-xs">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">{message.message}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Panel */}
        {showAiPanel && aiEnabled && (
          <div className="w-80 bg-gray-800 text-white flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span>AI Assistant</span>
                </h3>
                <button
                  onClick={() => setShowAiPanel(false)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  ×
                </button>
              </div>
              
              <div className="flex space-x-1 mt-3">
                {['transcription', 'summary', 'action', 'suggestion'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedAiTab(tab)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      selectedAiTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {aiNotes
                .filter(note => note.type === selectedAiTab)
                .map((note) => (
                  <div key={note.id} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      {getNoteIcon(note.type)}
                      <span className="text-xs text-gray-400">
                        {note.timestamp.toLocaleTimeString()}
                      </span>
                      {note.speaker && (
                        <span className="text-xs text-blue-400">
                          {note.speaker}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-200">{note.content}</p>
                  </div>
                ))}
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={exportMeetingNotes}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export Notes</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoEnabled
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>
          
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${
              isAudioEnabled
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
          
          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-full transition-colors ${
              isScreenSharing
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            <Monitor className="h-5 w-5" />
          </button>
          
          {recordingEnabled && (
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-full transition-colors ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <Circle className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-full transition-colors ${
              showChat
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setShowAiPanel(!showAiPanel)}
            className={`p-3 rounded-full transition-colors ${
              showAiPanel
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            <Bot className="h-5 w-5" />
          </button>
          
          <button className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors">
            <Users className="h-5 w-5" />
          </button>
          
          <button className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
        
        <button
          onClick={onLeave}
          className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
        >
          <PhoneOff className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Demo component to show how to use the VideoChatRoom
const VideoConferenceDemo = () => {
  const [inMeeting, setInMeeting] = useState(false);
  
  const sampleParticipants: Participant[] = [
    {
      id: '1',
      name: 'John Doe',
      avatar: '/api/placeholder/40/40',
      isHost: true,
      videoEnabled: true,
      audioEnabled: true,
      isScreenSharing: false,
      connectionStatus: 'connected'
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: '/api/placeholder/40/40',
      isHost: false,
      videoEnabled: false,
      audioEnabled: true,
      isScreenSharing: false,
      connectionStatus: 'connected'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      avatar: '/api/placeholder/40/40',
      isHost: false,
      videoEnabled: true,
      audioEnabled: false,
      isScreenSharing: false,
      connectionStatus: 'connecting'
    }
  ];

  if (inMeeting) {
    return (
      <SwarmRoomsPage
        roomId="room-123"
        roomName="Team Standup Meeting"
        onLeave={() => setInMeeting(false)}
        aiEnabled={true}
        recordingEnabled={true}
        participants={sampleParticipants}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Video Conference Demo</h2>
        <button
          onClick={() => setInMeeting(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
};

export default VideoConferenceDemo;
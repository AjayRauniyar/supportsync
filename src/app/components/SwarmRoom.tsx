// import React, { useState } from 'react';
// import { 
//   ArrowLeft, 
//   Users, 
//   Settings, 
//   Plus, 
//   X, 
//   Clock, 
//   Lock, 
//   Globe, 
//   Video, 
//   Bot, 
//   FileText, 
//   Shield,
//   Calendar,
//   Search,
//   Check,
//   User,
//   Mail,
//   Briefcase
// } from 'lucide-react';

// interface Expert {
//   id: string;
//   name: string;
//   avatar: string;
//   expertise: string[];
//   rating: number;
//   isOnline: boolean;
//   specialization: string;
//   email: string;
// }

// interface SwarmRoomsPageProps {
//   onNavigate: (page: string) => void;
// }

// const SwarmRoomsPage: React.FC<SwarmRoomsPageProps> = ({ onNavigate }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState<string>('all');
//   const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
//   const [showCreateRoom, setShowCreateRoom] = useState(false);
//   const [newRoom, setNewRoom] = useState({
//     name: '',
//     description: '',
//     category: '',
//     privacy: 'public',
//     duration: '60',
//     maxParticipants: '10',
//     aiEnabled: true,
//     recordingEnabled: false,
//     scheduledDate: '',
//     scheduledTime: '',
//     invitedExperts: [] as string[]
//   });
//   const [expertSearchTerm, setExpertSearchTerm] = useState('');

//   const [experts] = useState<Expert[]>([
//     {
//       id: '1',
//       name: 'Dr. Sarah Chen',
//       avatar: '/api/placeholder/40/40',
//       expertise: ['AI/ML', 'Data Science', 'Python'],
//       rating: 4.9,
//       isOnline: true,
//       specialization: 'Machine Learning Engineer',
//       email: 'sarah.chen@example.com'
//     },
//     {
//       id: '2',
//       name: 'Marcus Rodriguez',
//       avatar: '/api/placeholder/40/40',
//       expertise: ['Cloud Architecture', 'DevOps', 'AWS'],
//       rating: 4.8,
//       isOnline: true,
//       specialization: 'Cloud Solutions Architect',
//       email: 'marcus.rodriguez@example.com'
//     },
//     {
//       id: '3',
//       name: 'Dr. Emily Watson',
//       avatar: '/api/placeholder/40/40',
//       expertise: ['Cybersecurity', 'Risk Management', 'Compliance'],
//       rating: 4.9,
//       isOnline: false,
//       specialization: 'Security Consultant',
//       email: 'emily.watson@example.com'
//     },
//     {
//       id: '4',
//       name: 'Alex Kumar',
//       avatar: '/api/placeholder/40/40',
//       expertise: ['Full Stack', 'React', 'Node.js'],
//       rating: 4.7,
//       isOnline: true,
//       specialization: 'Senior Software Engineer',
//       email: 'alex.kumar@example.com'
//     },
//     {
//       id: '5',
//       name: 'Dr. Michael Thompson',
//       avatar: '/api/placeholder/40/40',
//       expertise: ['Database Design', 'Performance Optimization', 'SQL'],
//       rating: 4.8,
//       isOnline: true,
//       specialization: 'Database Architect',
//       email: 'michael.thompson@example.com'
//     }
//   ]);

//   const categories = [
//     'Technical Discussion',
//     'Problem Solving',
//     'Code Review',
//     'Architecture Planning',
//     'Brainstorming',
//     'Training Session',
//     'Project Planning',
//     'Security Review'
//   ];

//   const handleCreateRoom = () => {
//     // Handle room creation logic here
//     console.log('Creating room:', newRoom);
//     setShowCreateRoom(false);
//     // Reset form
//     setNewRoom({
//       name: '',
//       description: '',
//       category: '',
//       privacy: 'public',
//       duration: '60',
//       maxParticipants: '10',
//       aiEnabled: true,
//       recordingEnabled: false,
//       scheduledDate: '',
//       scheduledTime: '',
//       invitedExperts: []
//     });
//   };

//   const toggleExpertInvitation = (expertId: string) => {
//     setNewRoom(prev => ({
//       ...prev,
//       invitedExperts: prev.invitedExperts.includes(expertId)
//         ? prev.invitedExperts.filter(id => id !== expertId)
//         : [...prev.invitedExperts, expertId]
//     }));
//   };

//   const filteredExperts = experts.filter(expert =>
//     expert.name.toLowerCase().includes(expertSearchTerm.toLowerCase()) ||
//     expert.specialization.toLowerCase().includes(expertSearchTerm.toLowerCase()) ||
//     expert.expertise.some(skill => skill.toLowerCase().includes(expertSearchTerm.toLowerCase()))
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={() => onNavigate('home')}
//                 className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50"
//               >
//                 <ArrowLeft className="h-5 w-5" />
//               </button>
//               <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
//                 <Users className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">Swarm Rooms</h1>
//                 <p className="text-sm text-gray-600">Collaborative problem-solving spaces</p>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
//                 <Settings className="h-5 w-5" />
//               </button>
//               <button 
//                 onClick={() => setShowCreateRoom(true)}
//                 className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//               >
//                 <Plus className="h-4 w-4 inline mr-2" />
//                 Create Room
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Swarm Rooms</h2>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Create collaborative spaces where experts come together to solve complex problems, 
//             share knowledge, and drive innovation through collective intelligence.
//           </p>
//         </div>

//         {/* Placeholder for room list */}
//         <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//           <div className="max-w-md mx-auto">
//             <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
//               <Users className="h-12 w-12 text-gray-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms yet</h3>
//             <p className="text-gray-600 mb-6">Get started by creating your first collaborative room</p>
//             <button 
//               onClick={() => setShowCreateRoom(true)}
//               className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               <Plus className="h-5 w-5 inline mr-2" />
//               Create Your First Room
//             </button>
//           </div>
//         </div>
//       </main>

//       {/* Create Room Modal */}
//       {showCreateRoom && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <div className="flex items-center space-x-3">
//                 <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
//                   <Plus className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">Create New Room</h2>
//                   <p className="text-gray-600">Set up your collaborative workspace</p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowCreateRoom(false)}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X className="h-6 w-6 text-gray-600" />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 space-y-8">
//               {/* Basic Information */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Room Name *
//                     </label>
//                     <input
//                       type="text"
//                       value={newRoom.name}
//                       onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
//                       placeholder="Enter room name"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Description
//                     </label>
//                     <textarea
//                       value={newRoom.description}
//                       onChange={(e) => setNewRoom(prev => ({ ...prev, description: e.target.value }))}
//                       placeholder="Describe the purpose and goals of this room"
//                       rows={3}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Category
//                     </label>
//                     <select
//                       value={newRoom.category}
//                       onChange={(e) => setNewRoom(prev => ({ ...prev, category: e.target.value }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     >
//                       <option value="">Select category</option>
//                       {categories.map(category => (
//                         <option key={category} value={category}>{category}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Privacy
//                     </label>
//                     <div className="space-y-2">
//                       <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
//                         <input
//                           type="radio"
//                           name="privacy"
//                           value="public"
//                           checked={newRoom.privacy === 'public'}
//                           onChange={(e) => setNewRoom(prev => ({ ...prev, privacy: e.target.value }))}
//                           className="text-blue-600 focus:ring-blue-500"
//                         />
//                         <Globe className="h-5 w-5 text-gray-600" />
//                         <div>
//                           <span className="font-medium">Public</span>
//                           <p className="text-sm text-gray-600">Anyone can join</p>
//                         </div>
//                       </label>
//                       <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
//                         <input
//                           type="radio"
//                           name="privacy"
//                           value="private"
//                           checked={newRoom.privacy === 'private'}
//                           onChange={(e) => setNewRoom(prev => ({ ...prev, privacy: e.target.value }))}
//                           className="text-blue-600 focus:ring-blue-500"
//                         />
//                         <Lock className="h-5 w-5 text-gray-600" />
//                         <div>
//                           <span className="font-medium">Private</span>
//                           <p className="text-sm text-gray-600">Invitation only</p>
//                         </div>
//                       </label>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Duration (minutes)
//                       </label>
//                       <input
//                         type="number"
//                         value={newRoom.duration}
//                         onChange={(e) => setNewRoom(prev => ({ ...prev, duration: e.target.value }))}
//                         min="15"
//                         max="480"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Max Participants
//                       </label>
//                       <input
//                         type="number"
//                         value={newRoom.maxParticipants}
//                         onChange={(e) => setNewRoom(prev => ({ ...prev, maxParticipants: e.target.value }))}
//                         min="2"
//                         max="50"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Features */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
//                     <input
//                       type="checkbox"
//                       checked={newRoom.aiEnabled}
//                       onChange={(e) => setNewRoom(prev => ({ ...prev, aiEnabled: e.target.checked }))}
//                       className="text-blue-600 focus:ring-blue-500 rounded"
//                     />
//                     <Bot className="h-5 w-5 text-blue-600" />
//                     <div>
//                       <span className="font-medium">AI Assistant</span>
//                       <p className="text-sm text-gray-600">Real-time transcription and insights</p>
//                     </div>
//                   </label>
//                   <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
//                     <input
//                       type="checkbox"
//                       checked={newRoom.recordingEnabled}
//                       onChange={(e) => setNewRoom(prev => ({ ...prev, recordingEnabled: e.target.checked }))}
//                       className="text-blue-600 focus:ring-blue-500 rounded"
//                     />
//                     <Video className="h-5 w-5 text-red-600" />
//                     <div>
//                       <span className="font-medium">Recording</span>
//                       <p className="text-sm text-gray-600">Save session for later review</p>
//                     </div>
//                   </label>
//                 </div>
//               </div>

//               {/* Schedule */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule (Optional)</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Date
//                     </label>
//                     <input
//                       type="date"
//                       value={newRoom.scheduledDate}
//                       onChange={(e) => setNewRoom(prev => ({ ...prev, scheduledDate: e.target.value }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Time
//                     </label>
//                     <input
//                       type="time"
//                       value={newRoom.scheduledTime}
//                       onChange={(e) => setNewRoom(prev => ({ ...prev, scheduledTime: e.target.value }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Invite Experts */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Experts</h3>
//                 <div className="space-y-4">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <input
//                       type="text"
//                       value={expertSearchTerm}
//                       onChange={(e) => setExpertSearchTerm(e.target.value)}
//                       placeholder="Search experts by name or expertise..."
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     />
//                   </div>
                  
//                   <div className="max-h-64 overflow-y-auto space-y-2">
//                     {filteredExperts.map(expert => (
//                       <div
//                         key={expert.id}
//                         className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
//                           newRoom.invitedExperts.includes(expert.id)
//                             ? 'bg-blue-50 border-blue-200'
//                             : 'bg-white border-gray-200 hover:bg-gray-50'
//                         }`}
//                         onClick={() => toggleExpertInvitation(expert.id)}
//                       >
//                         <div className="flex items-center space-x-3">
//                           <div className="relative">
//                             <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
//                               <User className="h-6 w-6 text-gray-600" />
//                             </div>
//                             {expert.isOnline && (
//                               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                             )}
//                           </div>
//                           <div>
//                             <h4 className="font-medium text-gray-900">{expert.name}</h4>
//                             <p className="text-sm text-gray-600">{expert.specialization}</p>
//                             <div className="flex flex-wrap gap-1 mt-1">
//                               {expert.expertise.slice(0, 3).map(skill => (
//                                 <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
//                                   {skill}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                         {newRoom.invitedExperts.includes(expert.id) && (
//                           <div className="text-blue-600">
//                             <Check className="h-5 w-5" />
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
//               <div className="text-sm text-gray-600">
//                 {newRoom.invitedExperts.length} experts invited
//               </div>
//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={() => setShowCreateRoom(false)}
//                   className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleCreateRoom}
//                   disabled={!newRoom.name.trim()}
//                   className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Create Room
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SwarmRoomsPage;
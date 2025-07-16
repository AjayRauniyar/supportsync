// import React, { useState } from 'react';
// import { 
//   X, 
//   Users, 
//   Clock, 
//   AlertCircle, 
//   Plus, 
//   Calendar,
//   Video,
//   Mic,
//   Settings,
//   UserPlus,
//   Database,
//   Shield,
//   Globe,
//   Activity,
//   Zap
// } from 'lucide-react';

// interface CreateRoomModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onCreateRoom: (roomData: any) => void;
//   experts: any[];
// }

// const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ 
//   isOpen, 
//   onClose, 
//   onCreateRoom, 
//   experts 
// }) => {
//   const [roomData, setRoomData] = useState({
//     name: '',
//     description: '',
//     severity: 'medium',
//     sapComponent: '',
//     caseId: '',
//     estimatedResolution: '',
//     selectedExperts: [],
//     enableVideoChat: true,
//     enableAIBot: true,
//     recordMeeting: true
//   });

//   const [selectedTab, setSelectedTab] = useState('details');

//   const sapComponents = [
//     { id: 'hana', name: 'SAP HANA', icon: Database },
//     { id: 'integration', name: 'Cloud Integration', icon: Globe },
//     { id: 'grc', name: 'GRC & Security', icon: Shield },
//     { id: 'fiori', name: 'Fiori & UI5', icon: Zap },
//     { id: 'basis', name: 'Basis & Administration', icon: Activity },
//     { id: 's4hana', name: 'S/4HANA', icon: Database },
//     { id: 'other', name: 'Other', icon: Settings }
//   ];

//   const handleSubmit = () => {
//     if (!roomData.name || !roomData.description || !roomData.sapComponent) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     const newRoom = {
//       id: `swarm-${Date.now()}`,
//       name: roomData.name,
//       description: roomData.description,
//       severity: roomData.severity,
//       sapComponent: roomData.sapComponent,
//       caseId: roomData.caseId || `CASE-${Date.now()}`,
//       estimatedResolution: roomData.estimatedResolution,
//       status: 'active',
//       createdAt: new Date().toISOString(),
//       experts: roomData.selectedExperts,
//       videoEnabled: roomData.enableVideoChat,
//       aiEnabled: roomData.enableAIBot,
//       recordingEnabled: roomData.recordMeeting
//     };

//     onCreateRoom(newRoom);
    
//     // Reset form
//     setRoomData({
//       name: '',
//       description: '',
//       severity: 'medium',
//       sapComponent: '',
//       caseId: '',
//       estimatedResolution: '',
//       selectedExperts: [],
//       enableVideoChat: true,
//       enableAIBot: true,
//       recordMeeting: true
//     });
    
//     onClose();
//   };

//   const toggleExpertSelection = (expert: any) => {
//     setRoomData(prev => ({
//       ...prev,
//       selectedExperts: prev.selectedExperts.find((e: any) => e.id === expert.id)
//         ? prev.selectedExperts.filter((e: any) => e.id !== expert.id)
//         : [...prev.selectedExperts, expert]
//     }));
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
//               <Users className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">Create New Swarm Room</h2>
//               <p className="text-sm text-gray-600">Set up collaborative problem-solving space</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="h-5 w-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex border-b border-gray-200">
//           <button
//             onClick={() => setSelectedTab('details')}
//             className={`px-6 py-3 font-medium text-sm transition-colors ${
//               selectedTab === 'details'
//                 ? 'border-b-2 border-blue-600 text-blue-600'
//                 : 'text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             Room Details
//           </button>
//           <button
//             onClick={() => setSelectedTab('experts')}
//             className={`px-6 py-3 font-medium text-sm transition-colors ${
//               selectedTab === 'experts'
//                 ? 'border-b-2 border-blue-600 text-blue-600'
//                 : 'text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             Select Experts
//           </button>
//           <button
//             onClick={() => setSelectedTab('settings')}
//             className={`px-6 py-3 font-medium text-sm transition-colors ${
//               selectedTab === 'settings'
//                 ? 'border-b-2 border-blue-600 text-blue-600'
//                 : 'text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             Video & AI Settings
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
//           {selectedTab === 'details' && (
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Room Name *
//                 </label>
//                 <input
//                   type="text"
//                   value={roomData.name}
//                   onChange={(e) => setRoomData(prev => ({ ...prev, name: e.target.value }))}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter room name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Description *
//                 </label>
//                 <textarea
//                   value={roomData.description}
//                   onChange={(e) => setRoomData(prev => ({ ...prev, description: e.target.value }))}
//                   rows={3}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Describe the issue or topic"
//                 />
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Priority Level
//                   </label>
//                   <select
//                     value={roomData.severity}
//                     onChange={(e) => setRoomData(prev => ({ ...prev, severity: e.target.value }))}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                     <option value="critical">Critical</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Case ID
//                   </label>
//                   <input
//                     type="text"
//                     value={roomData.caseId}
//                     onChange={(e) => setRoomData(prev => ({ ...prev, caseId: e.target.value }))}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Auto-generated if empty"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   SAP Component *
//                 </label>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {sapComponents.map((component) => {
//                     const IconComponent = component.icon;
//                     return (
//                       <button
//                         key={component.id}
//                         onClick={() => setRoomData(prev => ({ ...prev, sapComponent: component.name }))}
//                         className={`p-3 rounded-lg border text-left transition-colors ${
//                           roomData.sapComponent === component.name
//                             ? 'border-blue-500 bg-blue-50 text-blue-700'
//                             : 'border-gray-200 hover:bg-gray-50'
//                         }`}
//                       >
//                         <IconComponent className="h-5 w-5 mb-2" />
//                         <div className="font-medium text-sm">{component.name}</div>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Estimated Resolution Time
//                 </label>
//                 <input
//                   type="text"
//                   value={roomData.estimatedResolution}
//                   onChange={(e) => setRoomData(prev => ({ ...prev, estimatedResolution: e.target.value }))}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="e.g., 2 hours, 1 day, 1 week"
//                 />
//               </div>
//             </div>
//           )}

//           {selectedTab === 'experts' && (
//             <div className="space-y-4">
//               <div className="flex items-center space-x-2 mb-4">
//                 <UserPlus className="h-5 w-5 text-gray-600" />
//                 <h3 className="font-medium text-gray-900">Select Experts to Invite</h3>
//                 <span className="text-sm text-gray-500">
//                   ({roomData.selectedExperts.length} selected)
//                 </span>
//               </div>

//               <div className="grid gap-3">
//                 {experts.map((expert) => (
//                   <div
//                     key={expert.id}
//                     className={`p-4 rounded-lg border cursor-pointer transition-colors ${
//                       roomData.selectedExperts.find((e: any) => e.id === expert.id)
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200 hover:bg-gray-50'
//                     }`}
//                     onClick={() => toggleExpertSelection(expert)}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div className="relative">
//                         <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
//                           {expert.avatar}
//                         </div>
//                         <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
//                           expert.availability === 'available' ? 'bg-green-500' : 
//                           expert.availability === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
//                         }`}></div>
//                       </div>
//                       <div className="flex-1">
//                         <div className="font-medium text-gray-900">{expert.name}</div>
//                         <div className="text-sm text-gray-600">{expert.title}</div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           {expert.expertise.slice(0, 2).join(', ')}
//                           {expert.expertise.length > 2 && ` +${expert.expertise.length - 2} more`}
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm text-gray-600">{expert.location}</div>
//                         <div className="text-xs text-gray-500">{expert.responseTime}</div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {selectedTab === 'settings' && (
//             <div className="space-y-6">
//               <div>
//                 <h3 className="font-medium text-gray-900 mb-4">Video Conference Settings</h3>
                
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                     <div className="flex items-center space-x-3">
//                       <Video className="h-5 w-5 text-blue-600" />
//                       <div>
//                         <div className="font-medium text-gray-900">Enable Video Chat</div>
//                         <div className="text-sm text-gray-600">Create video conference room for real-time collaboration</div>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => setRoomData(prev => ({ ...prev, enableVideoChat: !prev.enableVideoChat }))}
//                       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                         roomData.enableVideoChat ? 'bg-blue-600' : 'bg-gray-200'
//                       }`}
//                     >
//                       <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                         roomData.enableVideoChat ? 'translate-x-6' : 'translate-x-1'
//                       }`} />
//                     </button>
//                   </div>

//                   <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                     <div className="flex items-center space-x-3">
//                       <Mic className="h-5 w-5 text-green-600" />
//                       <div>
//                         <div className="font-medium text-gray-900">AI Meeting Bot</div>
//                         <div className="text-sm text-gray-600">Enable AI assistant to listen and provide real-time insights</div>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => setRoomData(prev => ({ ...prev, enableAIBot: !prev.enableAIBot }))}
//                       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                         roomData.enableAIBot ? 'bg-green-600' : 'bg-gray-200'
//                       }`}
//                     >
//                       <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                         roomData.enableAIBot ? 'translate-x-6' : 'translate-x-1'
//                       }`} />
//                     </button>
//                   </div>

//                   <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                     <div className="flex items-center space-x-3">
//                       <Settings className="h-5 w-5 text-purple-600" />
//                       <div>
//                         <div className="font-medium text-gray-900">Record Meeting</div>
//                         <div className="text-sm text-gray-600">Automatically record sessions for later review and summarization</div>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => setRoomData(prev => ({ ...prev, recordMeeting: !prev.recordMeeting }))}
//                       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                         roomData.recordMeeting ? 'bg-purple-600' : 'bg-gray-200'
//                       }`}
//                     >
//                       <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                         roomData.recordMeeting ? 'translate-x-6' : 'translate-x-1'
//                       }`} />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {roomData.enableAIBot && (
//                 <div className="bg-blue-50 rounded-lg p-4">
//                   <div className="flex items-start space-x-3">
//                     <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
//                     <div>
//                       <div className="font-medium text-blue-900">AI Assistant Features</div>
//                       <ul className="text-sm text-blue-800 mt-2 space-y-1">
//                         <li>• Real-time transcription and note-taking</li>
//                         <li>• Intelligent meeting summarization</li>
//                         <li>• Action item extraction</li>
//                         <li>• Technical solution suggestions</li>
//                         <li>• Automated follow-up reminders</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between p-6 border-t border-gray-200">
//           <div className="text-sm text-gray-500">
//             {selectedTab === 'details' && 'Fill in the basic room information'}
//             {selectedTab === 'experts' && `${roomData.selectedExperts.length} experts selected`}
//             {selectedTab === 'settings' && 'Configure video and AI features'}
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
//             >
//               Create Room & Start Video
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateRoomModal;
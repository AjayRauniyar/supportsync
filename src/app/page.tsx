'use client';

import React, { useState } from 'react';
import IntegrationManager from './components/integration';
import HomePage from '../app/components/HomePage';
import ChatBotPage from './components/ChatBotPage';
import ExpertMatchingPage from './components/expertMatching';
// import SwarmRoomPage from './components/SwarmRoom';
import SwarmRoomPage from './components/createroom'
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage}  />;
      case 'chat':
        return <ChatBotPage onNavigate={setCurrentPage} />;
      case 'experts':
        return <ExpertMatchingPage onNavigate={setCurrentPage} />;
      case 'swarm':
        return <SwarmRoomPage  />;
      default:
        return <HomePage onNavigate={setCurrentPage}  />;
    }
    // return <IntegrationManager/>
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
}
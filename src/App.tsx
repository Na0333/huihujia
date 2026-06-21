/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import React from 'react';
import { Home, Bot, Heart, LayoutGrid, User } from 'lucide-react';
import HomeView from './components/views/HomeView';
import AIChatView from './components/views/AIChatView';
import CareView from './components/views/CareView';
import SimpleModeView from './components/views/SimpleModeView';
import ProfileView from './components/views/ProfileView';
import LoginView from './components/views/LoginView';
import RegisterView from './components/views/RegisterView';
import MessageView from './components/views/MessageView';

type AuthUser = {
  id: number;
  username: string;
  createdAt: string;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [registeredUsername, setRegisteredUsername] = useState(() => {
    return sessionStorage.getItem('pendingLoginUsername') || '';
  });
  const [authNotice, setAuthNotice] = useState<string | null>(() => {
    return sessionStorage.getItem('pendingLoginNotice');
  });
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('authUser');

    if (!saved) return null;

    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem('authUser');
      return null;
    }
  });

  if (!currentUser) {
    if (authView === 'register') {
      return (
        <RegisterView
          onBack={() => {
            setAuthView('login');
            setAuthNotice(null);
            sessionStorage.removeItem('pendingLoginNotice');
          }}
          onRegistered={(username) => {
            const notice = '注册成功，请使用新账号登录';
            sessionStorage.setItem('pendingLoginUsername', username);
            sessionStorage.setItem('pendingLoginNotice', notice);
            setRegisteredUsername(username);
            setAuthNotice(notice);
            setAuthView('login');
          }}
        />
      );
    }

    return (
      <LoginView
        key={registeredUsername || 'default-login'}
        initialUsername={registeredUsername || 'admin'}
        notice={authNotice}
        onRegister={() => {
          setAuthNotice(null);
          sessionStorage.removeItem('pendingLoginNotice');
          setAuthView('register');
        }}
        onLogin={(user) => {
          localStorage.setItem('authUser', JSON.stringify(user));
          sessionStorage.removeItem('pendingLoginUsername');
          sessionStorage.removeItem('pendingLoginNotice');
          setActiveTab('home');
          setCurrentUser(user);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen relative font-sans w-full max-w-md mx-auto bg-surface shadow-2xl overflow-hidden sm:border-x sm:border-surface-variant">
      
      {/* Dynamic View Rendering */}
      <div className="flex-1 overflow-y-auto hide-scrollbar relative">
        {activeTab === 'home' && <HomeView onNavigate={setActiveTab} />}
        {activeTab === 'ai' && <AIChatView />}
        {activeTab === 'care' && <CareView />}
        {activeTab === 'devices' && <SimpleModeView />}
        {activeTab === 'profile' && <ProfileView onLogout={() => {
          localStorage.removeItem('authUser');
          setRegisteredUsername('');
          setAuthNotice(null);
          setAuthView('login');
          sessionStorage.removeItem('pendingLoginUsername');
          sessionStorage.removeItem('pendingLoginNotice');
          setCurrentUser(null);
        }} />}
        {activeTab === 'messages' && <MessageView onBack={() => setActiveTab('home')} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="shrink-0 flex justify-around items-center px-4 pt-2 pb-6 bg-surface-container-lowest/90 backdrop-blur-md shadow-glass-nav z-50 rounded-t-[20px] border-t border-outline-variant/30">
        <NavItem
          icon={<Home size={24} />}
          label="首页"
          id="home"
          active={activeTab}
          onClick={setActiveTab}
        />
        <NavItem
          icon={<Bot size={24} />}
          label="AI管家"
          id="ai"
          active={activeTab}
          onClick={setActiveTab}
        />
        <NavItem
          icon={<Heart size={24} />}
          label="关怀"
          id="care"
          active={activeTab}
          onClick={setActiveTab}
        />
        <NavItem
          icon={<LayoutGrid size={24} />}
          label="设备"
          id="devices"
          active={activeTab}
          onClick={setActiveTab}
        />
        <NavItem
          icon={<User size={24} />}
          label="我的"
          id="profile"
          active={activeTab}
          onClick={setActiveTab}
        />
      </nav>
    </div>
  );
}

function NavItem({ 
  icon, 
  label, 
  id, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  id: string, 
  active: string, 
  onClick: (id: string) => void 
}) {
  const isActive = active === id;
  
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex flex-col items-center justify-center py-2 px-3 rounded-[14px] transition-all duration-300 min-w-[60px] ${
        isActive
          ? 'text-primary bg-primary-container/20 scale-100'
          : 'text-on-surface-variant hover:text-primary scale-95'
      }`}
    >
      <div className={`mb-1 transition-colors ${isActive ? 'fill-current stroke-[2.5px]' : 'stroke-2'}`}>
        {icon}
      </div>
      <span className={`text-[11px] leading-none transition-all ${isActive ? 'font-bold' : 'font-medium'}`}>
        {label}
      </span>
    </button>
  );
}

import React, { useState } from 'react';
import { AuthAccount, Program, PitchStartup, Role } from './types';
import {
  AUTH_ACCOUNTS,
  INITIAL_PROGRAMS,
  INITIAL_STARTUPS,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { LoginGateway } from './components/LoginGateway';
import { AdminPortal } from './components/AdminPortal';
import { JudgePortal } from './components/JudgePortal';
import { StartupPortal } from './components/StartupPortal';
import { ConsultantPortal } from './components/ConsultantPortal';
import { ClientPortal } from './components/ClientPortal';
import { MasterDbPortal } from './components/MasterDbPortal';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<AuthAccount | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program>(INITIAL_PROGRAMS[0]);
  const [pitches, setPitches] = useState<PitchStartup[]>(INITIAL_STARTUPS);

  // Global Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Login handler
  const handleLogin = (account: AuthAccount) => {
    setCurrentUser(account);
    showToast(`환영합니다, ${account.name}님 (${account.role})으로 로그인되었습니다.`);
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    showToast('로그아웃되었습니다.');
  };

  // Switch role directly from Navbar
  const handleSwitchRole = (acc: AuthAccount) => {
    setCurrentUser(acc);
    showToast(`역할이 [${acc.role}] (${acc.name})으로 전환되었습니다.`);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#0E1B14] flex flex-col font-sans selection:bg-[#EAF3E4] selection:text-[#2E6B48]">
      
      {/* Toast Popup Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0E1B14] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-3 border border-[#2A3830]">
          <CheckCircle2 className="w-4 h-4 text-[#5CA47A] shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        accounts={AUTH_ACCOUNTS}
        onSwitchRole={handleSwitchRole}
        selectedProgram={selectedProgram}
        onSelectProgram={setSelectedProgram}
        programs={INITIAL_PROGRAMS}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!currentUser ? (
          // View 1: Login Gateway
          <LoginGateway
            accounts={AUTH_ACCOUNTS}
            onSelectAccount={handleLogin}
            selectedProgram={selectedProgram}
          />
        ) : (
          // View 2: Role-based Dedicated Portals
          <div className="space-y-6 animate-in fade-in duration-300">
            {currentUser.role === 'ADMIN' && (
              <AdminPortal
                program={selectedProgram}
                setProgram={setSelectedProgram}
                pitches={pitches}
                setPitches={setPitches}
                showToast={showToast}
              />
            )}

            {currentUser.role === 'JUDGE' && (
              <JudgePortal
                program={selectedProgram}
                pitches={pitches}
                setPitches={setPitches}
                showToast={showToast}
              />
            )}

            {currentUser.role === 'STARTUP' && (
              <StartupPortal
                program={selectedProgram}
                pitches={pitches}
                showToast={showToast}
              />
            )}

            {currentUser.role === 'CONSULTANT' && (
              <ConsultantPortal
                program={selectedProgram}
                pitches={pitches}
                showToast={showToast}
              />
            )}

            {currentUser.role === 'CLIENT' && (
              <ClientPortal
                program={selectedProgram}
                setProgram={setSelectedProgram}
                pitches={pitches}
                showToast={showToast}
              />
            )}

            {currentUser.role === 'MASTER_DB' && (
              <MasterDbPortal
                program={selectedProgram}
                pitches={pitches}
                showToast={showToast}
              />
            )}
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[#E2E8E3] bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5B6A62]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#0E1B14] tracking-tight">EDEN-IR PLATFORM</span>
            <span>|</span>
            <span>초격차 공공·민간 스타트업 IR 운영 및 통합 마스터 DB 시스템</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>보안 등급: <strong>공공 1급 암호화 적용</strong></span>
            <span>정부 R&D / TIPS 연계 DB 동기화 완료</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
export default App;

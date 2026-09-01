import React from 'react';
import { AuthAccount, Program } from '../types';
import { LogOut, ArrowRight, CheckCircle2, ChevronDown, Layers, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentUser: AuthAccount | null;
  onLogout: () => void;
  accounts: AuthAccount[];
  onSwitchRole: (acc: AuthAccount) => void;
  programs: Program[];
  selectedProgram: Program;
  onSelectProgram: (p: Program) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  accounts,
  onSwitchRole,
  programs,
  selectedProgram,
  onSelectProgram,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#E2E8E3] sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-[0_2px_12px_rgba(30,50,35,0.04)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Program Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF3E4] border border-[#D8EAD3] flex items-center justify-center text-[#2E6B48] shadow-sm">
            {/* Eden Leaf Mark */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="block">
              <path
                d="M6 18C6 11.5 11.5 6 18 6C18 12.5 12.5 18 6 18Z"
                fill="currentColor"
                fillOpacity="0.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M6 18L15 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-[#0E1B14] tracking-tight">Eden — IR</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF3E4] text-[#2E6B48] border border-[#D8EAD3] font-bold">
                하이브리드 컨설팅 플랫폼
              </span>
            </div>

            {/* Current Event Selector */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <Layers className="w-3.5 h-3.5 text-[#3E8A5C]" />
              <select
                value={selectedProgram.id}
                onChange={(e) => {
                  const p = programs.find((pr) => pr.id === e.target.value);
                  if (p) onSelectProgram(p);
                }}
                className="bg-transparent text-xs font-bold text-[#2A3830] focus:outline-none cursor-pointer underline decoration-[#3E8A5C]/40 max-w-xs sm:max-w-md truncate"
              >
                {programs.map((pr) => (
                  <option key={pr.id} value={pr.id} className="bg-white text-[#0E1B14]">
                    {pr.title} ({pr.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Current User Session & Role Switcher */}
        {currentUser ? (
          <div className="flex items-center gap-2.5">
            {/* User Badge */}
            <div className="flex items-center gap-2.5 bg-[#F7F8F5] border border-[#E2E8E3] px-3 py-1.5 rounded-2xl">
              <div className={`w-7 h-7 rounded-xl ${currentUser.badgeBg} ${currentUser.badgeFg} flex items-center justify-center font-bold text-xs shadow-inner`}>
                {currentUser.avatarText}
              </div>
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-[#0E1B14]">{currentUser.name}</span>
                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold border ${currentUser.badgeBg} ${currentUser.badgeFg} ${currentUser.badgeBorder}`}>
                    {currentUser.roleKor}
                  </span>
                </div>
                <span className="text-[11px] text-[#5B6A62] block truncate max-w-[180px]">{currentUser.affiliation}</span>
              </div>
            </div>

            {/* Quick Role Switcher Dropdown */}
            <div className="flex items-center bg-[#F7F8F5] px-2.5 py-1.5 rounded-xl border border-[#E2E8E3] text-xs">
              <span className="text-[#5B6A62] font-medium mr-1.5 hidden md:inline">앱 전환:</span>
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const acc = accounts.find((a) => a.id === e.target.value);
                  if (acc) onSwitchRole(acc);
                }}
                className="bg-transparent font-bold text-[#2E6B48] focus:outline-none cursor-pointer"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id} className="bg-white text-[#0E1B14]">
                    {a.roleKor} ({a.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FBE8E6] text-[#5B6A62] hover:text-[#C24E3A] border border-[#E2E8E3] hover:border-[#F1CDC2] text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="로그아웃"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5B6A62]">로그인 대기 중</span>
          </div>
        )}

      </div>
    </header>
  );
};

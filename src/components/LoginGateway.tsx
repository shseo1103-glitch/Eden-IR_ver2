import React, { useState } from 'react';
import { AuthAccount } from '../types';
import { Lock, User, Key, ShieldCheck, ArrowRight, AlertCircle, Sparkles, Building2, Award, Compass, Briefcase, Database, ShieldAlert } from 'lucide-react';

interface LoginGatewayProps {
  accounts: AuthAccount[];
  onLoginSuccess: (account: AuthAccount) => void;
  showToast: (msg: string) => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({ accounts, onLoginSuccess, showToast }) => {
  const [inputId, setInputId] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const found = accounts.find(
      (a) => a.id === inputId.trim() && a.password === inputPassword.trim()
    );

    if (found) {
      onLoginSuccess(found);
      showToast(`🎉 [${found.roleKor}] ${found.name}님 환영합니다!`);
    } else {
      setErrorMsg('아이디 또는 비밀번호가 일치하지 않습니다. 아래 빠른 데모 계정 카드를 클릭하거나 ID/PW를 확인해 주세요.');
    }
  };

  const handleQuickLogin = (account: AuthAccount) => {
    setInputId(account.id);
    setInputPassword(account.password);
    onLoginSuccess(account);
    showToast(`🚀 [${account.roleKor}] 전용 앱으로 자동 로그인되었습니다.`);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return ShieldAlert;
      case 'JUDGE': return Award;
      case 'STARTUP': return Building2;
      case 'CONSULTANT': return Compass;
      case 'CLIENT': return Briefcase;
      case 'MASTER_DB': return Database;
      default: return User;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-[#F7F8F5] relative overflow-hidden">
      {/* Decorative Sage Leaf Watermark */}
      <div className="absolute -top-12 -right-12 text-[#3E8A5C] opacity-[0.05] pointer-events-none transform -rotate-12">
        <svg width="480" height="480" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 18C6 11.5 11.5 6 18 6C18 12.5 12.5 18 6 18Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="max-w-5xl w-full space-y-8 relative z-10">
        
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-[#EAF3E4] border border-[#D8EAD3] flex items-center justify-center text-[#2E6B48] shadow-md mx-auto">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 18C6 11.5 11.5 6 18 6C18 12.5 12.5 18 6 18Z"
                fill="currentColor"
                fillOpacity="0.25"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M6 18L15 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3E4] text-[#2E6B48] border border-[#D8EAD3] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3E8A5C]" /> Eden-IR Multi-Role Portal System
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0E1B14] tracking-tight">
            Eden-IR 통합 하이브리드 컨설팅 포털
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6A62] max-w-xl mx-auto leading-relaxed">
            아이디에 따라 각 사용자가 사용하는 맞춤형 전용 앱(관리자·심사위원·스타트업·컨설턴트·발주처)과 <strong className="text-[#0E1B14]">Eden-IR 통합 마스터 DB 및 통계 대시보드</strong>로 입장합니다.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8E3] shadow-[0_8px_32px_rgba(30,50,35,0.06)] max-w-md mx-auto space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2A3830] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#3E8A5C]" /> 아이디 (User ID)
              </label>
              <input
                type="text"
                required
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="예: admin, judge1, startup1, consultant1..."
                className="w-full bg-[#F7F8F5] border border-[#DCE4DE] rounded-2xl px-4 py-3 text-sm text-[#0E1B14] placeholder-[#9CA69F] focus:outline-none focus:border-[#3E8A5C] focus:bg-white focus:ring-2 focus:ring-[#3E8A5C]/20 transition font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2A3830] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#3E8A5C]" /> 비밀번호 (Password)
              </label>
              <input
                type="password"
                required
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full bg-[#F7F8F5] border border-[#DCE4DE] rounded-2xl px-4 py-3 text-sm text-[#0E1B14] placeholder-[#9CA69F] focus:outline-none focus:border-[#3E8A5C] focus:bg-white focus:ring-2 focus:ring-[#3E8A5C]/20 transition font-mono"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-[#FBE8E6] border border-[#F1CDC2] rounded-2xl text-[#C24E3A] text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-sm shadow-md shadow-[#2E6B48]/20 flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <span>전용 앱 시스템 입장하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 6 Quick Demo Persona Cards */}
        <div className="space-y-3.5 pt-2">
          <div className="flex flex-wrap items-center justify-between text-xs text-[#5B6A62] px-2 gap-2">
            <span className="font-bold flex items-center gap-1.5 text-[#0E1B14]">
              <Sparkles className="w-4 h-4 text-[#F0B453]" /> 역할별 전용 로그인 계정 안내 (원클릭 즉시 입장 가능)
            </span>
            <span className="text-[11px] text-[#5B6A62]">카드를 누르면 ID/PW가 자동 입력되어 해당 앱으로 입장합니다.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((acc) => {
              const RoleIcon = getRoleIcon(acc.role);
              return (
                <div
                  key={acc.id}
                  onClick={() => handleQuickLogin(acc)}
                  className="bg-white hover:bg-[#FBFDFB] border border-[#E2E8E3] hover:border-[#3E8A5C] p-4 rounded-3xl cursor-pointer transition-all space-y-2.5 shadow-[0_2px_12px_rgba(30,50,35,0.03)] hover:shadow-[0_8px_24px_rgba(46,107,72,0.12)] flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${acc.badgeBg} ${acc.badgeFg} ${acc.badgeBorder}`}>
                        {acc.roleKor}
                      </span>
                      <span className="text-xs text-[#5B6A62] group-hover:text-[#2E6B48] flex items-center gap-1 font-bold transition">
                        입장 <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <div className={`w-9 h-9 rounded-2xl ${acc.badgeBg} ${acc.badgeFg} flex items-center justify-center shrink-0 shadow-inner`}>
                        <RoleIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-extrabold text-sm text-[#0E1B14] block truncate">{acc.name}</span>
                        <span className="text-[11px] text-[#5B6A62] block truncate">{acc.affiliation}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#5B6A62] leading-relaxed line-clamp-2 pt-0.5">
                      {acc.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#EEF1E9] flex items-center justify-between font-mono text-[11px] text-[#5B6A62] bg-[#F7F8F5] px-3 py-1.5 rounded-xl">
                    <span>ID: <strong className="text-[#2E6B48]">{acc.id}</strong></span>
                    <span>PW: <strong className="text-[#2A3830]">{acc.password}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

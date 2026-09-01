import React, { useState, useEffect } from 'react';
import { Program, ProgramParticipant, PitchStartup } from '../types';
import {
  ShieldAlert,
  Radio,
  Clock,
  Play,
  Pause,
  RotateCcw,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  FileSpreadsheet,
  FolderDown,
  Sparkles,
  Award,
  Layers,
  Settings,
  ShieldCheck,
  Check,
  Plus,
  RefreshCw,
  Eye,
  Briefcase
} from 'lucide-react';

interface AdminPortalProps {
  program: Program;
  setProgram: React.Dispatch<React.SetStateAction<Program>>;
  participants: ProgramParticipant[];
  setParticipants: React.Dispatch<React.SetStateAction<ProgramParticipant[]>>;
  pitches: PitchStartup[];
  setPitches: React.Dispatch<React.SetStateAction<PitchStartup[]>>;
  showToast: (msg: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  program,
  setProgram,
  participants,
  setParticipants,
  pitches,
  setPitches,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'liveControl' | 'admissions' | 'pitches' | 'judges' | 'reports' | 'programConfig'>('liveControl');
  
  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Modals & Batch State
  const [selectedJudgeDoc, setSelectedJudgeDoc] = useState<ProgramParticipant | null>(null);
  const [isAiBatchRunning, setIsAiBatchRunning] = useState(false);
  const [showNewProgramModal, setShowNewProgramModal] = useState(false);
  const [selectedDeckView, setSelectedDeckView] = useState<PitchStartup | null>(null);

  // Timer Countdown Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((sec) => sec - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. Toggle Individual Host Admission (Zoom-like Admit Control)
  const handleToggleAdmit = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.isAdmitted;
          return {
            ...p,
            isAdmitted: next,
            admittedAt: next ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
          };
        }
        return p;
      })
    );
    showToast('참가자 호스트 대기실 입장 승인 상태가 업데이트되었습니다.');
  };

  // 2. Admit All in Waiting Room
  const handleAdmitAll = () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setParticipants((prev) =>
      prev.map((p) => ({
        ...p,
        isAdmitted: true,
        admittedAt: p.admittedAt || timeNow,
      }))
    );
    showToast('대기실의 모든 참가자가 즉시 행사장에 입장 승인되었습니다.');
  };

  // 3. Toggle Pre-Consulting Switch
  const handleTogglePreConsulting = () => {
    setProgram((prev) => ({
      ...prev,
      hasPreConsulting: !prev.hasPreConsulting,
    }));
    showToast(`사전 컨설팅 질문 생성 모듈이 ${!program.hasPreConsulting ? '활성화(ON)' : '비활성화(OFF)'} 되었습니다.`);
  };

  // 4. Verify Judge Tax Document
  const handleVerifyDocument = (participantId: string, docType: 'ID_CARD' | 'BANKBOOK', status: 'VERIFIED' | 'PENDING') => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            [docType === 'ID_CARD' ? 'idCardStatus' : 'bankbookStatus']: status,
          };
        }
        return p;
      })
    );
    setSelectedJudgeDoc(null);
    showToast(`심사위원 증빙 서류 상태가 [${status === 'VERIFIED' ? '승인' : '보완요청'}] 처리되었습니다.`);
  };

  // 5. Stage Pitching Order Switcher
  const handleSetCurrentPitchOrder = (order: number) => {
    setPitches((prev) =>
      prev.map((p) => ({
        ...p,
        pitchStatus: p.order === order ? 'ON_STAGE' : p.order < order ? 'COMPLETED' : 'PENDING',
      }))
    );
    setProgram((prev) => ({
      ...prev,
      currentPitchOrder: order,
    }));
    setTimerSeconds(15 * 60);
    setIsTimerRunning(true);
    showToast(`📢 발표 순서가 [#${order} ${pitches.find((p) => p.order === order)?.companyName}] 기업으로 전환되었습니다.`);
  };

  // 6. Batch AI Pitch Deck Analysis
  const handleRunBatchAiAnalysis = () => {
    setIsAiBatchRunning(true);
    setTimeout(() => {
      setIsAiBatchRunning(false);
      setPitches((prev) =>
        prev.map((p) => ({
          ...p,
          aiScore: Math.min(100, p.aiScore + 1),
        }))
      );
      showToast('✨ 전체 피칭 덱에 대한 AI 심층 분석 및 예상 질문지 생성이 완료되었습니다.');
    }, 1200);
  };

  const currentPitchingStartup = pitches.find((p) => p.order === program.currentPitchOrder) || pitches[0];

  return (
    <div className="space-y-6">
      
      {/* Top Program Banner & Pre-Consulting Switch */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] shadow-[0_4px_20px_rgba(30,50,35,0.04)] flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FBE8E6] text-[#C24E3A] text-xs font-bold border border-[#F1CDC2] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> 총괄 관리자 (Admin Console)
            </span>
            <span className="text-xs text-[#5B6A62]">| 행사 고유코드: <strong className="font-mono text-[#0E1B14]">{program.code}</strong></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E1B14]">{program.title}</h1>
          <p className="text-xs text-[#5B6A62]">
            주관 기관: <strong className="text-[#2A3830]">{program.organization}</strong> | 장소: {program.venue}
          </p>
        </div>

        {/* Pre-Consulting Toggle */}
        <div className="flex items-center gap-3 bg-[#F7F8F5] px-4 py-2.5 rounded-2xl border border-[#E2E8E3] text-xs">
          <div>
            <span className="text-[#0E1B14] font-bold block">사전 컨설팅 모듈 스위치</span>
            <span className="text-[11px] text-[#5B6A62]">질문지 자동생성 활성화</span>
          </div>
          <button
            onClick={handleTogglePreConsulting}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              program.hasPreConsulting ? 'bg-[#3E8A5C]' : 'bg-[#C4D4C8]'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                program.hasPreConsulting ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`font-mono font-bold text-xs ${program.hasPreConsulting ? 'text-[#2E6B48]' : 'text-[#9CA69F]'}`}>
            {program.hasPreConsulting ? 'ON (활성화)' : 'OFF (데모데이 전용)'}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#E2E8E3] pb-3">
        {[
          { id: 'liveControl', label: '실시간 무대 총괄 관제실', icon: Radio },
          { id: 'admissions', label: '대기실 & 호스트 입장 제어', icon: UserCheck, count: participants.filter((p) => !p.isAdmitted).length },
          { id: 'pitches', label: '피칭 기업 & 덱 AI 분석실', icon: FileText },
          { id: 'judges', label: '심사위원단 & 수당 서류 검증', icon: ShieldCheck, count: participants.filter((p) => p.role === 'JUDGE' && p.idCardStatus === 'PENDING').length },
          { id: 'reports', label: '최종 산출물 & 데이터 패키징', icon: FileSpreadsheet },
          { id: 'programConfig', label: '사업 운영 환경설정', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-[#EAF3E4] text-[#2E6B48] border border-[#D8EAD3] shadow-sm'
                  : 'text-[#5B6A62] hover:text-[#0E1B14] hover:bg-white border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#DA5A4B] text-white text-[10px] font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Live Stage Control */}
      {activeTab === 'liveControl' && (
        <div className="space-y-6">
          {/* Live Stage Hero Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8E3] shadow-[0_4px_20px_rgba(30,50,35,0.04)] flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#EAF3E4] text-[#2E6B48] text-xs font-bold border border-[#D8EAD3] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3E8A5C] animate-ping" />
                  LIVE ON STAGE
                </span>
                <span className="text-xs text-[#5B6A62]">장소: {program.venue}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0E1B14]">
                현재 발표 기업: <span className="text-[#2E6B48]">#{currentPitchingStartup.order} {currentPitchingStartup.companyName}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#2A3830] font-medium leading-relaxed">
                {currentPitchingStartup.title} ({currentPitchingStartup.representative} 대표)
              </p>
            </div>

            {/* Countdown Timer Module */}
            <div className="flex items-center gap-4 bg-[#F7F8F5] p-4 rounded-3xl border border-[#E2E8E3]">
              <div className="text-right">
                <span className="text-[10px] text-[#5B6A62] block font-bold">무대 발표 잔여 시간</span>
                <span className={`text-2xl sm:text-3xl font-black font-mono tracking-wider ${timerSeconds < 180 ? 'text-[#DA5A4B] animate-pulse' : 'text-[#2E6B48]'}`}>
                  {formatTimer(timerSeconds)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 border-l border-[#DCE4DE] pl-3">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#EEF1E9] text-[#2E6B48] border border-[#DCE4DE] shadow-sm transition"
                  title={isTimerRunning ? '일시정지' : '시작'}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(15 * 60);
                  }}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#EEF1E9] text-[#5B6A62] border border-[#DCE4DE] shadow-sm transition"
                  title="15분 초기화"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 2-Column: Timetable Switcher & Real-time Scoring Monitor */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Pitching Timetable (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E2E8E3] space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EEF1E9] pb-3">
                <h3 className="font-extrabold text-sm text-[#0E1B14] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#3E8A5C]" />
                  IR 피칭 타임테이블 및 무대 순서 제어
                </h3>
                <span className="text-xs text-[#5B6A62]">순서 클릭 시 해당 기업으로 발표 동기화</span>
              </div>

              <div className="space-y-3">
                {pitches.map((p) => {
                  const isCurrent = p.order === program.currentPitchOrder;
                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        isCurrent
                          ? 'bg-[#EAF3E4]/70 border-[#5CA47A] shadow-md shadow-[#3E8A5C]/10'
                          : p.pitchStatus === 'COMPLETED'
                          ? 'bg-[#F7F8F5] border-[#E2E8E3] opacity-80'
                          : 'bg-white border-[#E2E8E3] hover:border-[#C4D4C8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center ${
                            isCurrent
                              ? 'bg-[#2E6B48] text-white shadow-sm'
                              : 'bg-[#EEF1E9] text-[#2A3830]'
                          }`}
                        >
                          #{p.order}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-[#0E1B14]">{p.companyName}</span>
                            <span className="text-xs text-[#5B6A62]">({p.representative} 대표)</span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                isCurrent
                                  ? 'bg-[#2E6B48] text-white'
                                  : p.pitchStatus === 'COMPLETED'
                                  ? 'bg-[#EAF3E4] text-[#2E6B48]'
                                  : 'bg-[#EEF1E9] text-[#5B6A62]'
                              }`}
                            >
                              {isCurrent ? '현재 무대 발표중' : p.pitchStatus === 'COMPLETED' ? '피칭 완료' : '발표 대기'}
                            </span>
                          </div>
                          <p className="text-xs text-[#5B6A62] truncate max-w-md mt-0.5">{p.title}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSetCurrentPitchOrder(p.order)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                            isCurrent
                              ? 'bg-[#2E6B48] text-white'
                              : 'bg-white hover:bg-[#F7F8F5] text-[#2A3830] border border-[#DCE4DE]'
                          }`}
                        >
                          {isCurrent ? '무대 진행중' : '무대 호출'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Real-time Scoring Monitor (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E2E8E3] space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EEF1E9] pb-3">
                <h3 className="font-extrabold text-sm text-[#0E1B14] flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#F0B453]" />
                  심사위원단 실시간 채점 입력 관제
                </h3>
                <span className="text-[11px] text-[#2E6B48] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 실시간 동기화
                </span>
              </div>

              <div className="space-y-3">
                {participants
                  .filter((p) => p.role === 'JUDGE')
                  .map((j) => (
                    <div key={j.id} className="p-3.5 bg-[#F7F8F5] rounded-2xl border border-[#E2E8E3] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-extrabold text-[#0E1B14]">{j.name} {j.title}</div>
                        <div className="text-[11px] text-[#5B6A62]">{j.affiliation} ({j.assignedCategory})</div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            j.isEvaluatedAll
                              ? 'bg-[#EAF3E4] text-[#2E6B48] border border-[#D8EAD3]'
                              : 'bg-[#FDF6E3] text-[#B08A3E] border border-[#F4E3BA]'
                          }`}
                        >
                          {j.isEvaluatedAll ? '전체 채점 완료' : '채점 작성 중'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="pt-3 border-t border-[#EEF1E9] text-xs text-[#5B6A62] space-y-1.5">
                <div className="flex justify-between">
                  <span>현재 선두 평가 기업:</span>
                  <span className="font-mono font-bold text-[#2E6B48]">92.5점 (네오스케일 AI)</span>
                </div>
                <div className="flex justify-between">
                  <span>호스트 입장 완료 인원:</span>
                  <span className="font-mono font-bold text-[#2E6B48]">
                    {participants.filter((p) => p.isAdmitted).length} / {participants.length}명
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Host Admissions Control */}
      {activeTab === 'admissions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8E3] space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1E9] pb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#0E1B14] flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#3E8A5C]" />
                실시간 대기실 및 호스트 입장 승인 관리 (Admissions Control)
              </h3>
              <p className="text-xs text-[#5B6A62] mt-0.5">
                접속한 심사위원 및 기업 대표를 관리자가 확인 후 승인(Admit)하여 발표장 접근 권한을 부여합니다.
              </p>
            </div>

            <button
              onClick={handleAdmitAll}
              className="px-4 py-2 rounded-2xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#2E6B48]/15 transition"
            >
              <Check className="w-4 h-4" /> 대기자 전원 일괄 입장 승인
            </button>
          </div>

          {/* Participant Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E2E8E3]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F7F8F5] text-[#5B6A62] font-bold border-b border-[#E2E8E3]">
                <tr>
                  <th className="p-3.5">참가자명</th>
                  <th className="p-3.5">소속 / 직책</th>
                  <th className="p-3.5">역할</th>
                  <th className="p-3.5">연락처 / 이메일</th>
                  <th className="p-3.5">증빙 서류</th>
                  <th className="p-3.5">입장 승인 상태</th>
                  <th className="p-3.5 text-right">제어</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1E9] text-[#2A3830]">
                {participants.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FBFDFB] transition">
                    <td className="p-3.5 font-bold text-[#0E1B14]">{p.name}</td>
                    <td className="p-3.5 text-[#5B6A62]">{p.affiliation} ({p.title})</td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                          p.role === 'JUDGE'
                            ? 'bg-[#EAF3E4] text-[#2E6B48] border-[#D8EAD3]'
                            : p.role === 'STARTUP'
                            ? 'bg-[#E6F3FB] text-[#1E70A2] border-[#C2E3F7]'
                            : 'bg-[#F5EBFB] text-[#7B3DA8] border-[#E7C6F7]'
                        }`}
                      >
                        {p.roleKor}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-xs text-[#5B6A62]">
                      <div>{p.phone}</div>
                      <div className="text-[11px] text-[#9CA69F]">{p.email}</div>
                    </td>
                    <td className="p-3.5">
                      {p.role === 'JUDGE' ? (
                        <button
                          onClick={() => setSelectedJudgeDoc(p)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1 transition ${
                            p.idCardStatus === 'VERIFIED'
                              ? 'bg-[#EAF3E4] text-[#2E6B48] border-[#D8EAD3]'
                              : 'bg-[#FDF6E3] text-[#B08A3E] border-[#F4E3BA]'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {p.idCardStatus === 'VERIFIED' ? '서류 완비' : '검증 필요'}
                        </button>
                      ) : (
                        <span className="text-[#9CA69F] text-xs">-</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-max ${
                          p.isAdmitted
                            ? 'bg-[#EAF3E4] text-[#2E6B48] border border-[#D8EAD3]'
                            : 'bg-[#FBE8E6] text-[#C24E3A] border border-[#F1CDC2]'
                        }`}
                      >
                        {p.isAdmitted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> 입장 완료 ({p.admittedAt})
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" /> 대기실 대기중
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleToggleAdmit(p.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition shadow-sm ${
                          p.isAdmitted
                            ? 'bg-white hover:bg-[#FBE8E6] text-[#C24E3A] border border-[#E2E8E3]'
                            : 'bg-[#2E6B48] hover:bg-[#245239] text-white'
                        }`}
                      >
                        {p.isAdmitted ? '입장 취소' : '수락 (Admit)'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Pitch Decks & AI Batch Analysis */}
      {activeTab === 'pitches' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="font-extrabold text-base text-[#0E1B14] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#3E8A5C]" />
                피칭 기업 포트폴리오 및 AI 분석 엔진 제어
              </h3>
              <p className="text-xs text-[#5B6A62] mt-0.5">
                기업들이 업로드한 피칭 덱을 일괄 검토하고, AI를 통해 핵심 요약과 심사용 질의 항목을 자동 생성합니다.
              </p>
            </div>

            <button
              onClick={handleRunBatchAiAnalysis}
              disabled={isAiBatchRunning}
              className="px-4 py-2.5 rounded-2xl bg-[#3E8A5C] hover:bg-[#2E6B48] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#3E8A5C]/20 transition"
            >
              {isAiBatchRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isAiBatchRunning ? 'AI 일괄 분석 파이프라인 가동 중...' : '전체 덱 AI 일괄 재분석 실행'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pitches.map((pitch) => (
              <div key={pitch.id} className="bg-white rounded-3xl p-5 border border-[#E2E8E3] space-y-4 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#3E8A5C]">발표 순서 #{pitch.order}</span>
                    <h4 className="font-extrabold text-base text-[#0E1B14] mt-0.5">{pitch.companyName}</h4>
                    <span className="text-xs text-[#5B6A62]">{pitch.representative} 대표</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-[#EAF3E4] text-[#2E6B48] font-mono text-xs font-bold border border-[#D8EAD3]">
                    AI {pitch.aiGrade} ({pitch.aiScore}점)
                  </span>
                </div>

                <p className="text-xs text-[#2A3830] line-clamp-2 leading-relaxed bg-[#F7F8F5] p-3 rounded-2xl border border-[#EEF1E9]">
                  {pitch.title}
                </p>

                <div className="text-xs space-y-1 text-[#5B6A62]">
                  <div className="flex justify-between">
                    <span>등록 파일:</span>
                    <span className="text-[#2E6B48] font-bold truncate max-w-[180px]">{pitch.deckFileName} ({pitch.deckPages}P)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>컨설턴트 진단:</span>
                    <span className="font-mono text-[#2A3830] font-bold">{pitch.consultantAssessment?.totalScore || 0}점</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EEF1E9] flex justify-between gap-2">
                  <button
                    onClick={() => setSelectedDeckView(pitch)}
                    className="flex-1 py-2 rounded-xl bg-[#F7F8F5] hover:bg-[#EEF1E9] text-[#2A3830] text-xs font-bold border border-[#E2E8E3] flex items-center justify-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#3E8A5C]" /> 덱 보기
                  </button>
                  <button
                    onClick={() => showToast(`✨ [${pitch.companyName}] AI 추천 질문 3건이 갱신되었습니다.`)}
                    className="px-3.5 py-2 rounded-xl bg-[#EAF3E4] hover:bg-[#D8EAD3] text-[#2E6B48] text-xs font-bold border border-[#D8EAD3] transition"
                  >
                    AI 질문 갱신
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Judges & Credentials */}
      {activeTab === 'judges' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8E3] space-y-6 shadow-sm">
          <div className="border-b border-[#EEF1E9] pb-4">
            <h3 className="text-base font-extrabold text-[#0E1B14] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#3E8A5C]" />
              심사위원단 자격 및 수당 지급용 증빙 서류 검증
            </h3>
            <p className="text-xs text-[#5B6A62] mt-0.5">
              정부 과제 수당 지급 기준에 따른 신분증 및 통장 사본을 대조 검증하고 지출 결의용 패키지를 준비합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {participants
              .filter((p) => p.role === 'JUDGE')
              .map((judge) => (
                <div key={judge.id} className="p-5 bg-[#F7F8F5] rounded-3xl border border-[#E2E8E3] space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-extrabold text-base text-[#0E1B14]">{judge.name} {judge.title}</span>
                      <span className="text-xs text-[#5B6A62] block">{judge.affiliation} | {judge.assignedCategory}</span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        judge.idCardStatus === 'VERIFIED' && judge.bankbookStatus === 'VERIFIED'
                          ? 'bg-[#EAF3E4] text-[#2E6B48] border border-[#D8EAD3]'
                          : 'bg-[#FDF6E3] text-[#B08A3E] border border-[#F4E3BA]'
                      }`}
                    >
                      {judge.idCardStatus === 'VERIFIED' && judge.bankbookStatus === 'VERIFIED' ? '검증 완료' : '서류 보완 필요'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-white rounded-2xl border border-[#E2E8E3] flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#0E1B14] block">신분증 사본</span>
                        <span className="text-[11px] text-[#5B6A62]">{judge.idCardFile || '미등록'}</span>
                      </div>
                      <span className={`font-bold text-xs ${judge.idCardStatus === 'VERIFIED' ? 'text-[#3E8A5C]' : 'text-[#CE8A2E]'}`}>
                        {judge.idCardStatus === 'VERIFIED' ? '✓ 승인됨' : '미승인'}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-2xl border border-[#E2E8E3] flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#0E1B14] block">통장 사본 (수당 계좌)</span>
                        <span className="text-[11px] text-[#5B6A62]">{judge.bankbookFile || '미등록'}</span>
                      </div>
                      <span className={`font-bold text-xs ${judge.bankbookStatus === 'VERIFIED' ? 'text-[#3E8A5C]' : 'text-[#CE8A2E]'}`}>
                        {judge.bankbookStatus === 'VERIFIED' ? '✓ 승인됨' : '미승인'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedJudgeDoc(judge)}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-[#EEF1E9] text-[#2E6B48] text-xs font-bold border border-[#DCE4DE] shadow-sm transition"
                    >
                      증빙 서류 상세 검수
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 5: Final Deliverables Packaging */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="font-extrabold text-base text-[#0E1B14] flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#3E8A5C]" />
                발주처 납품용 산출물 패키지 및 엑셀 집계표 생성
              </h3>
              <p className="text-xs text-[#5B6A62] mt-0.5">
                모든 평가 및 진단 데이터를 종합하여 정부 과제 규격의 최종 결과 보고서(Word/Excel/ZIP)로 즉시 다운로드합니다.
              </p>
            </div>

            <button
              onClick={() => showToast('📦 [초격차 데모데이] 전체 산출물 통합 압축팩(ZIP) 다운로드가 시작되었습니다.')}
              className="px-4 py-2 rounded-2xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#2E6B48]/15 transition"
            >
              <FolderDown className="w-4 h-4" /> 전체 산출물 일괄 다운로드 (ZIP)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl p-5 border border-[#E2E8E3] space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-[#2E6B48] font-bold text-sm">
                <FileText className="w-5 h-5" />
                <span>행사 성과 결과보고서 (DOCX)</span>
              </div>
              <p className="text-xs text-[#5B6A62] leading-relaxed">
                행사 개요, 종합 심사 총평, 기업별 피칭 요약 및 현장 행사 사진 대장이 포함된 완본 문서입니다.
              </p>
              <button
                onClick={() => showToast('📄 성과 결과보고서 Word(DOCX) 다운로드가 시작되었습니다.')}
                className="w-full py-2 bg-[#F7F8F5] hover:bg-[#EEF1E9] text-[#2E6B48] rounded-xl text-xs font-bold border border-[#E2E8E3]"
              >
                Word(DOCX) 다운로드
              </button>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#E2E8E3] space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-[#3E8A5C] font-bold text-sm">
                <FileSpreadsheet className="w-5 h-5" />
                <span>심사위원 채점 집계표 (XLSX)</span>
              </div>
              <p className="text-xs text-[#5B6A62] leading-relaxed">
                기술성, 시장성, 팀 역량, 발표력 4대 세부 배점별 원데이터 및 순위 산출 공식이 연동된 엑셀 시트입니다.
              </p>
              <button
                onClick={() => showToast('📊 채점 집계표 Excel(XLSX) 다운로드가 시작되었습니다.')}
                className="w-full py-2 bg-[#F7F8F5] hover:bg-[#EEF1E9] text-[#3E8A5C] rounded-xl text-xs font-bold border border-[#E2E8E3]"
              >
                Excel(XLSX) 다운로드
              </button>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#E2E8E3] space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-[#B08A3E] font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>수당 지급 증빙 패키지 (PDF)</span>
              </div>
              <p className="text-xs text-[#5B6A62] leading-relaxed">
                심사위원 신분증, 통장 사본, 보안 서약서 및 전자 서명 날인 원본이 포함된 지출 결의 증빙 파일입니다.
              </p>
              <button
                onClick={() => showToast('📑 수당 증빙 패키지 PDF 다운로드가 시작되었습니다.')}
                className="w-full py-2 bg-[#F7F8F5] hover:bg-[#EEF1E9] text-[#B08A3E] rounded-xl text-xs font-bold border border-[#E2E8E3]"
              >
                PDF 증빙 다운로드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Program Configuration */}
      {activeTab === 'programConfig' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8E3] space-y-6 shadow-sm">
          <div className="border-b border-[#EEF1E9] pb-4">
            <h3 className="text-base font-extrabold text-[#0E1B14] flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#3E8A5C]" />
              지원 사업 및 IR 행사 기본 운영 환경설정
            </h3>
            <p className="text-xs text-[#5B6A62] mt-0.5">
              행사 일정, 발표 제한 시간, 사전 질문 활성화 여부 및 배점 가중치를 관리합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-[#2A3830] block">사업명 / 행사 공식 타이틀</label>
              <input
                type="text"
                value={program.title}
                readOnly
                className="w-full bg-[#F7F8F5] border border-[#E2E8E3] rounded-2xl p-3 text-[#0E1B14]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#2A3830] block">행사 관리 고유 코드</label>
              <input
                type="text"
                value={program.code}
                readOnly
                className="w-full bg-[#F7F8F5] border border-[#E2E8E3] rounded-2xl p-3 text-[#2E6B48] font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#2A3830] block">장소 및 온·오프라인 모드</label>
              <input
                type="text"
                value={program.venue}
                readOnly
                className="w-full bg-[#F7F8F5] border border-[#E2E8E3] rounded-2xl p-3 text-[#0E1B14]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#2A3830] block">기업당 배정 발표 시간 (분)</label>
              <input
                type="number"
                defaultValue={15}
                className="w-full bg-[#F7F8F5] border border-[#E2E8E3] rounded-2xl p-3 text-[#2E6B48] font-mono font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Judge Document Inspection Modal */}
      {selectedJudgeDoc && (
        <div className="fixed inset-0 z-50 bg-[#0E1B14]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-[#E2E8E3] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EEF1E9] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#3E8A5C]" />
                <h3 className="font-extrabold text-base text-[#0E1B14]">
                  [{selectedJudgeDoc.name} {selectedJudgeDoc.title}] 증빙 서류 검수
                </h3>
              </div>
              <button
                onClick={() => setSelectedJudgeDoc(null)}
                className="text-[#5B6A62] hover:text-[#0E1B14] text-xs p-1"
              >
                닫기 ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#E2E8E3] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#0E1B14]">1. 신분증 사본 파일</span>
                  <span className="text-[11px] text-[#2E6B48] font-mono font-bold">{selectedJudgeDoc.idCardFile || 'id_card.png'}</span>
                </div>
                <div className="h-24 rounded-xl bg-white flex items-center justify-center text-[#5B6A62] border border-dashed border-[#C4D4C8]">
                  [신분증 사본 이미지 렌더링 영역 - 주민번호 뒷자리 마스킹 완료]
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleVerifyDocument(selectedJudgeDoc.id, 'ID_CARD', 'VERIFIED')}
                    className="px-3 py-1.5 bg-[#3E8A5C] hover:bg-[#2E6B48] text-white rounded-xl font-bold text-xs shadow-sm"
                  >
                    신분증 승인
                  </button>
                </div>
              </div>

              <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#E2E8E3] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#0E1B14]">2. 통장 사본 파일</span>
                  <span className="text-[11px] text-[#2E6B48] font-mono font-bold">{selectedJudgeDoc.bankbookFile || 'bankbook.png'}</span>
                </div>
                <div className="h-24 rounded-xl bg-white flex items-center justify-center text-[#5B6A62] border border-dashed border-[#C4D4C8]">
                  [통장 사본 이미지 렌더링 영역 - 계좌번호 확인 완료]
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleVerifyDocument(selectedJudgeDoc.id, 'BANKBOOK', 'VERIFIED')}
                    className="px-3 py-1.5 bg-[#3E8A5C] hover:bg-[#2E6B48] text-white rounded-xl font-bold text-xs shadow-sm"
                  >
                    통장 사본 승인
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EEF1E9] flex justify-end">
              <button
                onClick={() => setSelectedJudgeDoc(null)}
                className="px-5 py-2 rounded-xl bg-[#F7F8F5] hover:bg-[#EEF1E9] text-[#2A3830] font-bold text-xs border border-[#E2E8E3]"
              >
                검수 창 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Pitch Deck Slide Viewer */}
      {selectedDeckView && (
        <div className="fixed inset-0 z-50 bg-[#0E1B14]/80 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[#2A3830] text-white">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#5CA47A]" />
              <span className="font-extrabold text-sm sm:text-base">
                [{selectedDeckView.companyName}] 피칭 슬라이드 덱 뷰어 ({selectedDeckView.deckFileName})
              </span>
            </div>
            <button
              onClick={() => setSelectedDeckView(null)}
              className="px-3 py-1 bg-[#2A3830] text-white rounded-xl text-xs font-bold hover:bg-[#3B4340]"
            >
              닫기 ✕
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center my-4">
            <div className="w-full max-w-4xl aspect-[16/9] bg-white rounded-3xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden shadow-2xl border border-[#E2E8E3]">
              <div className="text-[#3E8A5C] font-mono text-xs font-bold mb-2">EDEN-IR SLIDE DECK VIEWER</div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0E1B14]">{selectedDeckView.title}</h3>
              <p className="text-sm text-[#5B6A62] mt-2">{selectedDeckView.companyName} | 발표자: {selectedDeckView.representative} 대표</p>
              
              <div className="mt-8 p-4 bg-[#F7F8F5] rounded-2xl border border-[#EEF1E9] max-w-md text-xs text-[#2A3830] leading-relaxed">
                {selectedDeckView.summaryText}
                <div className="mt-2 text-[11px] text-[#9CA69F]">슬라이드 1 / {selectedDeckView.deckPages} 페이지</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

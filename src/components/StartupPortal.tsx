import React, { useState } from 'react';
import { Program, PitchStartup } from '../types';
import {
  Rocket,
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  Clock,
  HelpCircle,
  Award,
  BarChart3,
  Download,
  Eye,
  Building2,
  UserCheck,
  AlertCircle,
  RefreshCw,
  Check,
  Target
} from 'lucide-react';

interface StartupPortalProps {
  program: Program;
  pitches: PitchStartup[];
  showToast: (msg: string) => void;
}

export const StartupPortal: React.FC<StartupPortalProps> = ({
  program,
  pitches,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'waitingRoom' | 'deckUpload' | 'preConsulting' | 'aiCoach' | 'feedback' | 'ddb'>('waitingRoom');
  
  // Default to First Startup (네오스케일 AI)
  const [startupData, setStartupData] = useState<PitchStartup>(pitches[0]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Modals
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showEditAnswerModal, setShowEditAnswerModal] = useState<{ id: number; question: string; answer: string } | null>(null);
  const [editingAnswerText, setEditingAnswerText] = useState('');

  // Summary Editor
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [tempSummary, setTempSummary] = useState(startupData.summaryText);

  // Save Pre-consulting answer
  const handleSaveAnswer = () => {
    if (!showEditAnswerModal) return;
    setStartupData((prev) => ({
      ...prev,
      preConsultingQnAs: prev.preConsultingQnAs.map((q) =>
        q.id === showEditAnswerModal.id
          ? { ...q, answer: editingAnswerText, status: 'ANSWERED' }
          : q
      ),
    }));
    setShowEditAnswerModal(null);
    showToast('사전 컨설팅 답변이 성공적으로 등록되었습니다.');
  };

  // Re-run AI Diagnosis
  const handleReanalyzeDeck = () => {
    setIsAiProcessing(true);
    setTimeout(() => {
      setIsAiProcessing(false);
      setStartupData((prev) => ({
        ...prev,
        aiScore: 94,
        aiMetrics: {
          ...prev.aiMetrics,
          businessModel: 92,
          pitchQuality: 96,
        },
        aiSummary: prev.aiSummary + ' [최신 2026 하반기 투자 시장 벤치마크 재검증 완료: 투자 유치 적합도 94점 산출]',
      }));
      showToast('✨ AI 사전 진단이 완료되어 새로운 분석 지표가 반영되었습니다.');
    }, 1200);
  };

  // File Upload Simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStartupData((prev) => ({
        ...prev,
        deckFileName: file.name,
        deckFileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        uploadedAt: new Date().toLocaleString(),
      }));
      showToast(`새로운 피칭 덱 [${file.name}] 업로드가 완료되었습니다.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Admission Status */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] shadow-[0_4px_20px_rgba(30,50,35,0.04)] flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E6F3FB] text-[#1E70A2] text-xs font-bold border border-[#C2E3F7] flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5" /> 피칭 기업 전용 포털
            </span>
            <span className="text-xs text-[#5B6A62]">참여 행사: <strong className="text-[#0E1B14]">{program.title}</strong></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E1B14]">{startupData.companyName}</h1>
          <p className="text-xs text-[#5B6A62]">
            대표자: <strong className="text-[#0E1B14]">{startupData.representative} 대표</strong> | 분야: {startupData.category}
          </p>
        </div>

        {/* Admission Badge */}
        <div className="flex items-center gap-3 bg-[#F7F8F5] px-4 py-2.5 rounded-2xl border border-[#E2E8E3] text-xs">
          <span className="px-3 py-1 rounded-full bg-[#EAF3E4] text-[#2E6B48] border border-[#D8EAD3] font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#3E8A5C]" /> 행사 입장 승인 완료 (13:42)
          </span>
          <button
            onClick={() => setShowDeckModal(true)}
            className="px-3 py-1 bg-white hover:bg-[#EEF1E9] text-[#2E6B48] rounded-xl text-xs font-bold border border-[#DCE4DE] shadow-sm flex items-center gap-1 transition"
          >
            <Eye className="w-3.5 h-3.5" /> 덱 뷰어
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#E2E8E3] pb-3">
        {[
          { id: 'waitingRoom', label: '실시간 피칭 대기실', icon: UserCheck },
          { id: 'deckUpload', label: '피칭 덱 및 기업 정보 관리', icon: FileText },
          { id: 'preConsulting', label: '사전 컨설팅 질의응답', icon: HelpCircle, count: startupData.preConsultingQnAs.filter((q) => q.status === 'PENDING').length },
          { id: 'aiCoach', label: 'AI 피칭 사전 진단 & 코칭', icon: Sparkles },
          { id: 'feedback', label: '심사 결과 & 피드백 리포트', icon: Award },
          { id: 'ddb', label: 'IR 성장 이력 & D-DB', icon: BarChart3 },
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

      {/* Tab 1: Live Waiting Room */}
      {activeTab === 'waitingRoom' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8E3] shadow-[0_4px_20px_rgba(30,50,35,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full bg-[#EAF3E4] text-[#2E6B48] text-xs font-bold border border-[#D8EAD3]">
                  LIVE SESSION READY
                </span>
                <span className="text-xs text-[#5B6A62]">발표 순서: #{startupData.order} (14:30 예정)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0E1B14]">
                {program.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#2A3830] mt-2 max-w-xl leading-relaxed">
                주관 기관: {program.organization} | 발표 순서 1번으로 배정되었습니다. 관리자 호스트의 호출에 맞춰 발표를 진행해 주세요.
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
              <div className="bg-[#F7F8F5] px-6 py-4 rounded-2xl border border-[#E2E8E3] text-center sm:text-right w-full">
                <span className="text-xs text-[#5B6A62] block font-medium">관리자 호스트 상태</span>
                <span className="text-base font-black text-[#2E6B48] flex items-center justify-center sm:justify-end gap-1.5 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-[#3E8A5C]" /> 발표장 입장 허가됨 (13:42)
                </span>
              </div>
              <button
                onClick={() => setShowDeckModal(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#2E6B48]/15 flex items-center justify-center gap-2 transition"
              >
                <Eye className="w-4 h-4" /> 피칭 덱 화면 띄우기
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-3xl border border-[#E2E8E3] space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-[#2E6B48] text-sm font-bold">
                <Clock className="w-4 h-4" />
                <span>발표 시간 안내</span>
              </div>
              <p className="text-xs text-[#5B6A62] leading-relaxed">
                피칭 <strong>10분</strong> 발표 후 심사위원 질의응답 <strong>5분</strong>(총 15분)으로 진행됩니다. 8분 경과 시 1차 알림이 울립니다.
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2E8E3] space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-[#3E8A5C] text-sm font-bold">
                <FileText className="w-4 h-4" />
                <span>등록된 피칭 덱</span>
              </div>
              <p className="text-xs text-[#5B6A62] leading-relaxed">
                현재 <strong>{startupData.deckFileName}</strong> ({startupData.deckPages}P) 파일이 심사위원 화면에 실시간 동기화되어 제공되고 있습니다.
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2E8E3] space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-[#B08A3E] text-sm font-bold">
                <Sparkles className="w-4 h-4" />
                <span>예상 심사 질의 대비</span>
              </div>
              <p className="text-xs text-[#5B6A62] leading-relaxed">
                AI 사전 분석을 통해 도출된 핵심 예상 질문들이 등록되어 있으니 사전 모의 답변을 준비하세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Deck Management */}
      {activeTab === 'deckUpload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E2E8E3] space-y-6 shadow-sm">
            <div className="border-b border-[#EEF1E9] pb-3">
              <h3 className="font-extrabold text-base text-[#0E1B14] flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#3E8A5C]" />
                피칭 덱 파일 관리 및 업데이트
              </h3>
              <p className="text-xs text-[#5B6A62] mt-0.5">
                심사용 최종 발표자료(PDF/PPT)를 등록하면 AI 엔진이 핵심 키워드와 요약본을 자동 추출합니다.
              </p>
            </div>

            <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#E2E8E3] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF3E4] border border-[#D8EAD3] flex items-center justify-center text-[#2E6B48]">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-sm text-[#0E1B14] block">{startupData.deckFileName}</span>
                  <span className="text-xs text-[#5B6A62]">
                    용량: {startupData.deckFileSize} · 등록일시: {startupData.uploadedAt}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowDeckModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#EEF1E9] text-[#2E6B48] text-xs font-bold border border-[#DCE4DE] shadow-sm flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> 미리보기
              </button>
            </div>

            <div className="border-2 border-dashed border-[#C4D4C8] hover:border-[#3E8A5C] rounded-3xl p-8 text-center transition bg-[#F7F8F5]/50 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#EAF3E4] text-[#2E6B48] flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <label className="cursor-pointer">
                  <span className="text-xs font-bold text-[#2E6B48] hover:underline">새로운 파일 업로드하기</span>
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-[#9CA69F] mt-1">PDF, PPTX 형식 지원 (최대 50MB)</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#0E1B14]">
                  기업 및 핵심 아이템 한 줄 요약 (심사위원 안내용)
                </label>
                <button
                  onClick={() => {
                    if (isEditingSummary) {
                      setStartupData((p) => ({ ...p, summaryText: tempSummary }));
                      showToast('아이템 요약문이 저장되었습니다.');
                    }
                    setIsEditingSummary(!isEditingSummary);
                  }}
                  className="text-xs text-[#2E6B48] hover:underline font-bold"
                >
                  {isEditingSummary ? '저장 완료' : '수정하기'}
                </button>
              </div>
              {isEditingSummary ? (
                <textarea
                  rows={3}
                  value={tempSummary}
                  onChange={(e) => setTempSummary(e.target.value)}
                  className="w-full bg-[#F7F8F5] border border-[#3E8A5C] rounded-2xl p-3.5 text-xs text-[#0E1B14] focus:outline-none"
                />
              ) : (
                <p className="bg-[#F7F8F5] p-3.5 rounded-2xl border border-[#EEF1E9] text-xs text-[#2A3830] leading-relaxed">
                  {startupData.summaryText}
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E2E8E3] space-y-4 shadow-sm">
            <div className="border-b border-[#EEF1E9] pb-3">
              <h3 className="font-extrabold text-base text-[#0E1B14] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#3E8A5C]" />
                기업 기본 정보 확인
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F7F8F5] p-3.5 rounded-2xl border border-[#EEF1E9]">
                <span className="text-[#5B6A62] block mb-0.5">기업명</span>
                <span className="font-bold text-[#0E1B14] text-sm">{startupData.companyName}</span>
              </div>
              <div className="bg-[#F7F8F5] p-3.5 rounded-2xl border border-[#EEF1E9]">
                <span className="text-[#5B6A62] block mb-0.5">대표자명</span>
                <span className="font-bold text-[#0E1B14]">{startupData.representative} 대표</span>
              </div>
              <div className="bg-[#F7F8F5] p-3.5 rounded-2xl border border-[#EEF1E9]">
                <span className="text-[#5B6A62] block mb-0.5">사업자등록번호</span>
                <span className="font-mono font-bold text-[#0E1B14]">{startupData.businessNumber}</span>
              </div>
              <div className="bg-[#F7F8F5] p-3.5 rounded-2xl border border-[#EEF1E9]">
                <span className="text-[#5B6A62] block mb-0.5">전문 분야 및 타깃 시장</span>
                <span className="font-bold text-[#2E6B48]">{startupData.category}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pre-Consulting Q&As */}
      {activeTab === 'preConsulting' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8E3] space-y-6 shadow-sm">
          <div className="border-b border-[#EEF1E9] pb-3">
            <h3 className="font-extrabold text-base text-[#0E1B14] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#B08A3E]" />
              사전 컨설팅 질의응답 작성
            </h3>
            <p className="text-xs text-[#5B6A62] mt-0.5">
              행사 전 AI 및 전문 컨설턴트가 제기한 질문에 답변을 작성하면 심사위원에게 사전 전달됩니다.
            </p>
          </div>

          <div className="space-y-4">
            {startupData.preConsultingQnAs.map((q, idx) => (
              <div
                key={q.id}
                className={`p-5 rounded-3xl border transition ${
                  q.status === 'ANSWERED'
                    ? 'bg-white border-[#E2E8E3]'
                    : 'bg-[#FDF6E3]/40 border-[#F4E3BA]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#EAF3E4] text-[#2E6B48] font-mono text-xs font-bold flex items-center justify-center">
                        Q{idx + 1}
                      </span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                          q.status === 'ANSWERED'
                            ? 'bg-[#EAF3E4] text-[#2E6B48] border-[#D8EAD3]'
                            : 'bg-[#FBE8E6] text-[#C24E3A] border-[#F1CDC2]'
                        }`}
                      >
                        {q.status === 'ANSWERED' ? '답변 완료' : '답변 대기중'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-extrabold text-[#0E1B14] pt-1">
                      {q.question}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowEditAnswerModal(q);
                      setEditingAnswerText(q.answer || '');
                    }}
                    className="px-4 py-2 rounded-2xl bg-[#F7F8F5] hover:bg-[#EEF1E9] text-[#2E6B48] text-xs font-bold border border-[#E2E8E3] shrink-0 transition"
                  >
                    {q.status === 'ANSWERED' ? '답변 수정' : '답변 작성하기'}
                  </button>
                </div>

                {q.answer ? (
                  <div className="mt-3 pt-3 border-t border-[#EEF1E9] pl-3 border-l-2 border-[#3E8A5C] text-xs text-[#2A3830] leading-relaxed bg-[#F7F8F5] p-3.5 rounded-r-2xl">
                    <span className="font-bold text-[#2E6B48] block mb-1">[작성된 답변 내용]:</span>
                    {q.answer}
                  </div>
                ) : (
                  <div className="mt-3 pt-3 border-t border-[#EEF1E9] text-[11px] text-[#B08A3E] flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    심사위원이 검토할 수 있도록 답변을 작성해주세요.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: AI Coaching & 4-Pillar Radar */}
      {activeTab === 'aiCoach' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D8EAD3] shadow-[0_4px_20px_rgba(30,50,35,0.04)] flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-5 h-5 text-[#3E8A5C]" />
                <span className="text-xs font-bold text-[#2E6B48]">AI 피칭 덱 사전 진단 리포트</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0E1B14]">
                투자 유치 준비도: <span className="text-[#2E6B48] font-mono">{startupData.aiScore}점</span> (예상 등급: {startupData.aiGrade})
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6A62] mt-2 max-w-xl leading-relaxed">
                {startupData.aiSummary}
              </p>
            </div>

            <button
              onClick={handleReanalyzeDeck}
              disabled={isAiProcessing}
              className="px-5 py-3 rounded-2xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#2E6B48]/20 transition"
            >
              {isAiProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isAiProcessing ? 'AI 분석 중...' : '덱 기반 AI 재진단 실행'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: '기술적 차별성 (Moat)', score: startupData.aiMetrics.techMoat, desc: '특허 및 자체 알고리즘 독창성' },
              { label: '시장 적합도 (PMF)', score: startupData.aiMetrics.marketFit, desc: '타깃 시장 규모 및 고객 니즈' },
              { label: '수익 모델 (BM)', score: startupData.aiMetrics.businessModel, desc: '과금 구조 및 손익분기점 타당성' },
              { label: 'IR 덱 완성도', score: startupData.aiMetrics.pitchQuality, desc: '스토리라인 및 가독성' },
            ].map((m, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-[#E2E8E3] text-center space-y-1 shadow-sm">
                <span className="text-xs text-[#5B6A62] font-semibold block">{m.label}</span>
                <span className="text-2xl sm:text-3xl font-black text-[#2E6B48] font-mono block py-1">
                  {m.score} <span className="text-xs text-[#5B6A62] font-normal">/ 100</span>
                </span>
                <span className="text-[11px] text-[#9CA69F] block">{m.desc}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E2E8E3] space-y-3 shadow-sm">
              <h4 className="font-extrabold text-sm text-[#2E6B48] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                AI가 분석한 핵심 강점 포인트 (Strengths)
              </h4>
              <ul className="space-y-2 text-xs text-[#2A3830]">
                {startupData.aiStrengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2 bg-[#F7F8F5] p-3 rounded-2xl border border-[#EEF1E9]">
                    <span className="text-[#3E8A5C] font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E2E8E3] space-y-3 shadow-sm">
              <h4 className="font-extrabold text-sm text-[#B08A3E] flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                IR 발표 시 보완 권장 제언 (Recommendations)
              </h4>
              <ul className="space-y-2 text-xs text-[#2A3830]">
                {startupData.aiWeaknesses.map((weak, i) => (
                  <li key={i} className="flex items-start gap-2 bg-[#F7F8F5] p-3 rounded-2xl border border-[#EEF1E9]">
                    <span className="text-[#B08A3E] font-bold">•</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Evaluation Results Feedback */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="font-extrabold text-base text-[#0E1B14] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#3E8A5C]" />
                심사위원 평가 결과 및 종합 진단서
              </h3>
              <p className="text-xs text-[#5B6A62] mt-0.5">
                행사 종료 후 심사위원이 채점한 정량 점수 및 정성 피드백이 실시간 취합되어 제공됩니다.
              </p>
            </div>

            <button
              onClick={() => showToast(`📄 [${startupData.companyName}] IR 진단 평가 보고서(DOCX/PDF) 다운로드가 시작되었습니다.`)}
              className="px-4 py-2.5 rounded-2xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#2E6B48]/15"
            >
              <Download className="w-4 h-4" /> 진단 보고서 다운로드
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {startupData.evaluations.map((ev, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-5 border border-[#E2E8E3] space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-[#0E1B14] block">{ev.judgeName} ({ev.affiliation})</span>
                    <span className="text-[11px] text-[#2E6B48] font-semibold">
                      {ev.investmentInterest === 'STRONG_RECOMMEND' ? '🔥 후속 미팅 적극 추천' : '🧐 추가 검토'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#2E6B48] font-mono">{ev.totalScore}</span>
                    <span className="text-xs text-[#5B6A62] font-normal"> 점</span>
                  </div>
                </div>

                <p className="text-xs text-[#2A3830] bg-[#F7F8F5] p-3.5 rounded-2xl border border-[#EEF1E9] leading-relaxed">
                  "{ev.feedback}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Digital Database (D-DB) */}
      {activeTab === 'ddb' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8E3] space-y-6 shadow-sm">
          <div className="border-b border-[#EEF1E9] pb-3">
            <h3 className="font-extrabold text-base text-[#0E1B14] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#3E8A5C]" />
              기업 IR 히스토리 & 성장 데이터 자산화 (D-DB)
            </h3>
            <p className="text-xs text-[#5B6A62] mt-0.5">
              정부 지원 사업 참여 이력 및 심사 데이터를 축적하여 후속 펀딩 및 R&D 사업 수주 매칭에 활용합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#F7F8F5] p-5 rounded-3xl border border-[#E2E8E3] space-y-2">
              <span className="text-xs text-[#5B6A62]">누적 IR 참여 횟수</span>
              <span className="text-2xl font-black text-[#0E1B14] font-mono block">4회</span>
              <span className="text-[11px] text-[#2E6B48] font-bold">평균 심사 평점 92.5점</span>
            </div>

            <div className="bg-[#F7F8F5] p-5 rounded-3xl border border-[#E2E8E3] space-y-2">
              <span className="text-xs text-[#5B6A62]">투자 기관 후속 미팅 요청</span>
              <span className="text-2xl font-black text-[#2E6B48] font-mono block">3개 사</span>
              <span className="text-[11px] text-[#2E6B48] font-semibold">VC 및 TIPS 운영사 매칭</span>
            </div>

            <div className="bg-[#F7F8F5] p-5 rounded-3xl border border-[#E2E8E3] space-y-2">
              <span className="text-xs text-[#5B6A62]">정부 과제 수주 적합도</span>
              <span className="text-2xl font-black text-[#2E6B48] font-mono block">95%</span>
              <span className="text-[11px] text-[#2E6B48] font-semibold">초격차 스타트업 1000+ 추천</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Slide Deck Fullscreen Viewer */}
      {showDeckModal && (
        <div className="fixed inset-0 z-50 bg-[#0E1B14]/80 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[#2A3830] text-white">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#5CA47A]" />
              <span className="font-extrabold text-sm sm:text-base">
                [{startupData.companyName}] IR 슬라이드 덱 뷰어 ({startupData.deckFileName})
              </span>
            </div>
            <button
              onClick={() => setShowDeckModal(false)}
              className="px-3 py-1 bg-[#2A3830] text-white rounded-xl text-xs font-bold hover:bg-[#3B4340]"
            >
              닫기 ✕
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center my-4">
            <div className="w-full max-w-4xl aspect-[16/9] bg-white rounded-3xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden shadow-2xl border border-[#E2E8E3]">
              <div className="text-[#3E8A5C] font-mono text-xs font-bold mb-2">EDEN-IR STARTUP DECK</div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0E1B14]">{startupData.title}</h3>
              <p className="text-sm text-[#5B6A62] mt-2">{startupData.companyName} | {startupData.representative} 대표</p>
              
              <div className="mt-8 p-4 bg-[#F7F8F5] rounded-2xl border border-[#EEF1E9] max-w-md text-xs text-[#2A3830]">
                {startupData.summaryText}
                <div className="mt-2 text-[11px] text-[#9CA69F]">슬라이드 1 / {startupData.deckPages} 페이지</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Answer Modal */}
      {showEditAnswerModal && (
        <div className="fixed inset-0 z-50 bg-[#0E1B14]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-[#E2E8E3] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EEF1E9] pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#B08A3E]" />
                <h3 className="font-extrabold text-base text-[#0E1B14]">사전 컨설팅 답변 작성</h3>
              </div>
              <button
                onClick={() => setShowEditAnswerModal(null)}
                className="text-[#5B6A62] hover:text-[#0E1B14] text-xs p-1"
              >
                닫기 ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-[#F7F8F5] p-3.5 rounded-2xl border border-[#EEF1E9] text-xs text-[#0E1B14]">
                <strong className="text-[#B08A3E] block mb-1">[질문 내용]:</strong>
                {showEditAnswerModal.question}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0E1B14] block">기업 응답 내용 작성</label>
                <textarea
                  rows={5}
                  value={editingAnswerText}
                  onChange={(e) => setEditingAnswerText(e.target.value)}
                  placeholder="구체적인 수치, PoC 데이터, 특허 출원 현황 등을 포함하여 명확하게 작성해주세요."
                  className="w-full bg-[#F7F8F5] border border-[#E2E8E3] rounded-2xl p-3.5 text-xs text-[#0E1B14] placeholder-[#9CA69F] focus:outline-none focus:border-[#3E8A5C] focus:bg-white leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#EEF1E9] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditAnswerModal(null)}
                className="px-4 py-2 rounded-2xl bg-[#F7F8F5] hover:bg-[#EEF1E9] text-[#5B6A62] text-xs font-bold border border-[#E2E8E3]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveAnswer}
                className="px-5 py-2.5 rounded-2xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" /> 답변 저장
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

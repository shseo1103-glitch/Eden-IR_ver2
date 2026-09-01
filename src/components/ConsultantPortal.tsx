import React, { useState, useMemo } from 'react';
import { Program, PitchStartup } from '../types';
import {
  Compass,
  FileCheck,
  Award,
  Sparkles,
  Target,
  CheckCircle2,
  Download,
  Building2,
  Layers,
  Save,
  Plus,
  HelpCircle,
  Clock,
  TrendingUp,
  FileSpreadsheet,
  Check
} from 'lucide-react';

interface ConsultantPortalProps {
  program: Program;
  pitches: PitchStartup[];
  showToast: (msg: string) => void;
}

export const ConsultantPortal: React.FC<ConsultantPortalProps> = ({
  program,
  pitches,
  showToast,
}) => {
  const [selectedStartupId, setSelectedStartupId] = useState<number>(pitches[0]?.id || 101);
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'roadmap' | 'preConsulting' | 'summary'>('diagnosis');

  const currentStartup = useMemo(() => {
    return pitches.find((p) => p.id === selectedStartupId) || pitches[0];
  }, [pitches, selectedStartupId]);

  // Consultant Scores
  const [techScore, setTechScore] = useState(25);
  const [marketScore, setMarketScore] = useState(23);
  const [financeScore, setFinanceScore] = useState(22);
  const [tipsScore, setTipsScore] = useState(24);
  const [summaryText, setSummaryText] = useState(currentStartup.consultantAssessment?.qualitativeSummary || '독보적인 SLM 경량화 원천기술을 보유하여 중기부 딥테크 팁스(TIPS) 15억 원 패스트트랙 추천에 적합함.');

  const totalScore = techScore + marketScore + financeScore + tipsScore;

  // New question form
  const [newQuestionText, setNewQuestionText] = useState('');

  const handleSaveDiagnosis = () => {
    showToast(`✅ [${currentStartup.companyName}] 전문 컨설턴트 4대 영역 정밀 진단서(${totalScore}점)가 저장되었습니다.`);
  };

  const handleAddPreQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    showToast(`사전 진단 질문이 [${currentStartup.companyName}] 기업 화면으로 전송되었습니다.`);
    setNewQuestionText('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] shadow-[0_4px_20px_rgba(30,50,35,0.04)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F5EBFB] text-[#7B3DA8] text-xs font-bold border border-[#E7C6F7] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> 전문 컨설턴트 포털 (Consultant Portal)
            </span>
            <span className="text-xs text-[#5B6A62]">행사: <strong className="text-[#0E1B14]">{program.title}</strong></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E1B14]">정현우 수석전문위원 (한국경영컨설팅원)</h1>
          <p className="text-xs text-[#5B6A62]">
            배정 역할: 딥테크 TIPS 과제 추천 심의 및 3단계 스케일업 종합 진단
          </p>
        </div>

        <button
          onClick={() => showToast('📑 수혜 기업 전체 3단계 스케일업 진단서(DOCX/PDF) 일괄 다운로드를 시작합니다.')}
          className="px-4 py-2.5 rounded-2xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#2E6B48]/15 transition"
        >
          <Download className="w-4 h-4" /> 진단서 전체 다운로드 (DOCX)
        </button>
      </div>

      {/* Target Startup Switcher */}
      <div className="bg-white rounded-3xl p-4 border border-[#E2E8E3] flex items-center gap-2 overflow-x-auto shadow-sm">
        <span className="text-xs font-extrabold text-[#5B6A62] mr-1 shrink-0 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-[#3E8A5C]" />
          진단 대상 기업:
        </span>
        {pitches.map((s) => {
          const isSelected = s.id === selectedStartupId;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedStartupId(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap border ${
                isSelected
                  ? 'bg-[#EAF3E4] text-[#2E6B48] border-[#5CA47A] shadow-sm'
                  : 'bg-[#F7F8F5] text-[#5B6A62] border-[#E2E8E3] hover:text-[#0E1B14]'
              }`}
            >
              <span>#{s.order} {s.companyName}</span>
              <span className="font-mono text-[10px] text-[#2E6B48]">
                ({s.consultantAssessment?.totalScore || 90}점)
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E2E8E3] pb-3">
        {[
          { id: 'diagnosis', label: '4대 영역 정밀 진단표', icon: FileCheck },
          { id: 'roadmap', label: '3단계 스케일업 로드맵', icon: Target },
          { id: 'preConsulting', label: '사전 질문 출제 & 검증', icon: HelpCircle },
          { id: 'summary', label: 'TIPS 패스트트랙 추천서', icon: Award },
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
            </button>
          );
        })}
      </div>

      {/* Tab 1: 4-Area Diagnosis */}
      {activeTab === 'diagnosis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E2E8E3] space-y-5 shadow-sm">
            <div className="flex justify-between items-center border-b border-[#EEF1E9] pb-3">
              <div>
                <h3 className="font-extrabold text-base text-[#0E1B14]">
                  [{currentStartup.companyName}] 4대 전문 진단 항목 채점
                </h3>
                <span className="text-xs text-[#5B6A62]">{currentStartup.category}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#5B6A62] block">진단 합계</span>
                <span className="text-2xl font-black text-[#2E6B48] font-mono">{totalScore} <span className="text-xs text-[#5B6A62] font-normal">/ 100</span></span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#EEF1E9] space-y-2">
                <div className="flex justify-between font-bold">
                  <span>1. 기술 완성도 및 TRL 성숙도 (25점)</span>
                  <span className="font-mono text-[#2E6B48]">{techScore} / 25점</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={techScore}
                  onChange={(e) => setTechScore(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCE4DE] rounded-lg accent-[#3E8A5C] cursor-pointer"
                />
              </div>

              <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#EEF1E9] space-y-2">
                <div className="flex justify-between font-bold">
                  <span>2. 시장 타당성 및 BM 정합성 (25점)</span>
                  <span className="font-mono text-[#2E6B48]">{marketScore} / 25점</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={marketScore}
                  onChange={(e) => setMarketScore(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCE4DE] rounded-lg accent-[#3E8A5C] cursor-pointer"
                />
              </div>

              <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#EEF1E9] space-y-2">
                <div className="flex justify-between font-bold">
                  <span>3. 재무 건전성 및 런웨이 방어 (25점)</span>
                  <span className="font-mono text-[#2E6B48]">{financeScore} / 25점</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={financeScore}
                  onChange={(e) => setFinanceScore(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCE4DE] rounded-lg accent-[#3E8A5C] cursor-pointer"
                />
              </div>

              <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#EEF1E9] space-y-2">
                <div className="flex justify-between font-bold">
                  <span>4. 딥테크 TIPS 과제 적합도 (25점)</span>
                  <span className="font-mono text-[#2E6B48]">{tipsScore} / 25점</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={tipsScore}
                  onChange={(e) => setTipsScore(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCE4DE] rounded-lg accent-[#3E8A5C] cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSaveDiagnosis}
                className="w-full py-3 bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs rounded-2xl shadow-md shadow-[#2E6B48]/15 flex items-center justify-center gap-1.5 transition"
              >
                <Save className="w-4 h-4" /> 진단 점수 및 소견 저장
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E2E8E3] space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-[#0E1B14]">컨설턴트 종합 정밀 소견</h3>
              <textarea
                rows={8}
                value={summaryText}
                onChange={(e) => setSummaryText(e.target.value)}
                className="w-full bg-[#F7F8F5] border border-[#E2E8E3] rounded-2xl p-3.5 text-xs text-[#0E1B14] leading-relaxed focus:outline-none focus:border-[#3E8A5C]"
              />
            </div>

            <div className="p-4 bg-[#EAF3E4] rounded-2xl border border-[#D8EAD3] text-xs space-y-1">
              <span className="font-bold text-[#2E6B48] block">추천 정책지원사업</span>
              <p className="text-[#0E1B14] font-semibold">{currentStartup.consultantAssessment?.recommendedGrant}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 3-Step Scale-up Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8E3] space-y-6 shadow-sm">
          <div className="border-b border-[#EEF1E9] pb-4">
            <h3 className="text-base font-extrabold text-[#0E1B14] flex items-center gap-2">
              <Target className="w-5 h-5 text-[#3E8A5C]" />
              [{currentStartup.companyName}] 3단계 스케일업 로드맵 (Milestone Blueprint)
            </h3>
            <p className="text-xs text-[#5B6A62] mt-0.5">
              정부 R&D 과제 수주 및 시리즈 A 후속 펀딩을 위한 단계별 핵심 마일스톤 설계서입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {currentStartup.consultantAssessment?.scaleUpRoadmap?.map((item, idx) => (
              <div key={idx} className="p-5 rounded-3xl bg-[#F7F8F5] border border-[#E2E8E3] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EAF3E4] text-[#2E6B48] text-[11px] font-bold border border-[#D8EAD3]">
                    {item.phase}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#5B6A62]">{item.timeline}</span>
                </div>

                <div>
                  <span className="font-extrabold text-sm text-[#0E1B14] block">{item.goal}</span>
                  <p className="text-xs text-[#5B6A62] mt-2 leading-relaxed bg-white p-3 rounded-2xl border border-[#EEF1E9]">
                    {item.actionItem}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Pre-Consulting Questions Management */}
      {activeTab === 'preConsulting' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8E3] space-y-6 shadow-sm">
          <div className="border-b border-[#EEF1E9] pb-4">
            <h3 className="text-base font-extrabold text-[#0E1B14] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#B08A3E]" />
              사전 컨설팅 질문 출제 및 기업 답변 검증
            </h3>
            <p className="text-xs text-[#5B6A62] mt-0.5">
              피칭 전 기업의 핵심 리스크를 점검할 수 있는 사전 질문을 출제하고 제출된 답변을 검토합니다.
            </p>
          </div>

          <form onSubmit={handleAddPreQuestion} className="space-y-3">
            <label className="text-xs font-bold text-[#0E1B14] block">새로운 사전 컨설팅 질문 출제</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="기업의 특허 권리범위, PoC 실측 지표, 인허가 리스크 등에 대한 사전 질문을 작성하세요..."
                className="flex-1 bg-[#F7F8F5] border border-[#E2E8E3] rounded-2xl px-4 py-3 text-xs text-[#0E1B14] focus:outline-none focus:border-[#3E8A5C] focus:bg-white"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" /> 질문 전송
              </button>
            </div>
          </form>

          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-[#0E1B14]">현재 등록된 사전 질문 및 기업 응답</h4>
            {currentStartup.preConsultingQnAs.map((q, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#EEF1E9] space-y-2 text-xs">
                <div className="font-bold text-[#B08A3E]">[사전 질문 {i + 1}]: {q.question}</div>
                <div className="text-[#0E1B14] pl-3 border-l-2 border-[#3E8A5C]">
                  <strong>[기업 응답]:</strong> {q.answer || '답변 대기중'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: TIPS Certificate */}
      {activeTab === 'summary' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8E3] space-y-6 shadow-sm">
          <div className="border-b border-[#EEF1E9] pb-4">
            <h3 className="text-base font-extrabold text-[#0E1B14] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#2E6B48]" />
              중소벤처기업부 딥테크 TIPS 패스트트랙 추천 심의서
            </h3>
          </div>

          <div className="p-6 rounded-3xl bg-[#F7F8F5] border border-[#E2E8E3] space-y-4">
            <div className="flex justify-between items-center border-b border-[#EEF1E9] pb-3">
              <div>
                <span className="text-xs text-[#5B6A62]">추천 대상 기업</span>
                <h4 className="text-lg font-black text-[#0E1B14]">{currentStartup.companyName} ({currentStartup.representative} 대표)</h4>
              </div>
              <span className="px-3 py-1 bg-[#EAF3E4] text-[#2E6B48] rounded-full text-xs font-bold border border-[#D8EAD3]">
                종합 적합도 94.0점 (최우수)
              </span>
            </div>

            <div className="text-xs text-[#2A3830] space-y-2 leading-relaxed">
              <p>
                본 기업은 온디바이스 SLM 양자화 원천기술 및 특허 6건을 기반으로 글로벌 로봇 OEM사와의 PoC 실증 데이터를 완비하였음.
              </p>
              <p>
                전문가 4대 영역 정밀 진단 결과, 기술성 및 시장성 지표가 팁스 운영사 투자 기준을 상회하여 패스트트랙 추천 대상으로 최종 판정함.
              </p>
            </div>

            <div className="pt-3 flex justify-between items-center text-xs">
              <span className="text-[#5B6A62]">발급 기관: 한국경영컨설팅원</span>
              <span className="font-bold text-[#2E6B48] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#3E8A5C]" /> 전자 직인 날인 완료
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

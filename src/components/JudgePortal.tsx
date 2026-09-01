import React, { useState, useEffect, useMemo } from 'react';
import { Program, PitchStartup, InvestmentInterest } from '../types';
import {
  Award,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Check,
  AlertCircle,
  HelpCircle,
  Plus,
  Save,
  PenTool,
  Eye,
  MessageSquare,
  Sliders,
  Layers
} from 'lucide-react';

interface JudgePortalProps {
  program: Program;
  pitches: PitchStartup[];
  setPitches: React.Dispatch<React.SetStateAction<PitchStartup[]>>;
  showToast: (msg: string) => void;
}

export const JudgePortal: React.FC<JudgePortalProps> = ({
  program,
  pitches,
  setPitches,
  showToast,
}) => {
  const [selectedStartupId, setSelectedStartupId] = useState<number>(pitches[0]?.id || 101);
  const [isAdmitted, setIsAdmitted] = useState(true);

  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFinalSubmitModal, setShowFinalSubmitModal] = useState(false);
  const [showDeckViewerModal, setShowDeckViewerModal] = useState(false);

  // Judge Documents
  const [idCardUploaded, setIdCardUploaded] = useState(true);
  const [bankbookUploaded, setBankbookUploaded] = useState(true);

  // Pitch Timer (15 min)
  const [timerSeconds, setTimerSeconds] = useState(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // E-Signature
  const [signatureName, setSignatureName] = useState('이지훈 수석심사역');
  const [isAgreedTerms, setIsAgreedTerms] = useState(true);
  const [isFinalSubmitted, setIsFinalSubmitted] = useState(false);

  // In-situ Question Input
  const [newQuestionInput, setNewQuestionInput] = useState('');

  // Selected Startup
  const currentStartup = useMemo(() => {
    return pitches.find((p) => p.id === selectedStartupId) || pitches[0];
  }, [pitches, selectedStartupId]);

  // Current Judge Evaluation Data
  const currentEval = useMemo(() => {
    return currentStartup.evaluations.find((e) => e.judgeId === 'judge1') || {
      judgeId: 'judge1',
      judgeName: '이지훈 수석심사역',
      affiliation: '카카오벤처스',
      scores: { tech: 28, business: 28, team: 19, pitch: 19 },
      totalScore: 94,
      feedback: '온디바이스 AI 시장의 명확한 니즈를 파악하였으며 실증 데이터가 매우 우수함.',
      investmentInterest: 'STRONG_RECOMMEND' as InvestmentInterest,
      evaluatedAt: '2026-08-30',
    };
  }, [currentStartup]);

  const currentTotalScore = useMemo(() => {
    const s = currentEval.scores;
    return (s.tech || 0) + (s.business || 0) + (s.team || 0) + (s.pitch || 0);
  }, [currentEval]);

  const completedCount = useMemo(() => {
    return pitches.filter((p) => p.evaluations.some((e) => e.judgeId === 'judge1')).length;
  }, [pitches]);

  // Timer Effect
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

  // Score Change Handler
  const handleScoreChange = (field: 'tech' | 'business' | 'team' | 'pitch', value: number) => {
    const maxVal = field === 'tech' || field === 'business' ? 30 : 20;
    const num = Math.min(Math.max(0, Number(value)), maxVal);

    setPitches((prev) =>
      prev.map((p) => {
        if (p.id === selectedStartupId) {
          const nextScores = { ...currentEval.scores, [field]: num };
          const nextTotal = (nextScores.tech || 0) + (nextScores.business || 0) + (nextScores.team || 0) + (nextScores.pitch || 0);
          const evalIndex = p.evaluations.findIndex((e) => e.judgeId === 'judge1');
          const updatedEval = {
            ...currentEval,
            scores: nextScores,
            totalScore: nextTotal,
          };

          const newEvals = evalIndex >= 0
            ? p.evaluations.map((e, idx) => (idx === evalIndex ? updatedEval : e))
            : [...p.evaluations, updatedEval];

          return { ...p, evaluations: newEvals };
        }
        return p;
      })
    );
  };

  // Feedback Change Handler
  const handleFeedbackChange = (text: string) => {
    setPitches((prev) =>
      prev.map((p) => {
        if (p.id === selectedStartupId) {
          const evalIndex = p.evaluations.findIndex((e) => e.judgeId === 'judge1');
          const updatedEval = { ...currentEval, feedback: text };
          const newEvals = evalIndex >= 0
            ? p.evaluations.map((e, idx) => (idx === evalIndex ? updatedEval : e))
            : [...p.evaluations, updatedEval];
          return { ...p, evaluations: newEvals };
        }
        return p;
      })
    );
  };

  // Investment Interest Change
  const handleInterestChange = (interest: InvestmentInterest) => {
    setPitches((prev) =>
      prev.map((p) => {
        if (p.id === selectedStartupId) {
          const evalIndex = p.evaluations.findIndex((e) => e.judgeId === 'judge1');
          const updatedEval = { ...currentEval, investmentInterest: interest };
          const newEvals = evalIndex >= 0
            ? p.evaluations.map((e, idx) => (idx === evalIndex ? updatedEval : e))
            : [...p.evaluations, updatedEval];
          return { ...p, evaluations: newEvals };
        }
        return p;
      })
    );
  };

  // Toggle Suggested Question
  const handleToggleQuestion = (qId: number) => {
    setPitches((prev) =>
      prev.map((p) => {
        if (p.id === selectedStartupId) {
          return {
            ...p,
            suggestedQuestions: p.suggestedQuestions.map((q) =>
              q.id === qId ? { ...q, isChecked: !q.isChecked } : q
            ),
          };
        }
        return p;
      })
    );
  };

  // Add Custom Question
  const handleAddCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionInput.trim()) return;
    const newQ = {
      id: Date.now(),
      text: newQuestionInput.trim(),
      source: '심사위원 (본인)',
      isChecked: true,
    };
    setPitches((prev) =>
      prev.map((p) => {
        if (p.id === selectedStartupId) {
          return {
            ...p,
            suggestedQuestions: [...p.suggestedQuestions, newQ],
          };
        }
        return p;
      })
    );
    setNewQuestionInput('');
    showToast('심사위원 현장 추가 질문이 질문지 풀에 등록되었습니다.');
  };

  // AI Refine Feedback Text
  const handleAiRefineFeedback = () => {
    const aiDraft = `${currentStartup.companyName}은 ${currentStartup.category} 부문에서 양산형 솔루션 대비 우수한 성능을 검증받았으며, AI 사전 분석(${currentStartup.aiScore}점)에 부합하는 높은 시장 잠재력을 갖추고 있습니다. 향후 글로벌 시장 진출을 위한 라이선스 체계 및 해외 규제 검증을 체계화한다면 시리즈 A 투자 유치 및 중기부 팁스(TIPS) 과제 수주가 유력합니다.`;
    handleFeedbackChange(aiDraft);
    showToast('✨ AI가 평가의견을 정부 공문서 및 보고서 양식에 맞게 정돈했습니다.');
  };

  // Save Current Evaluation
  const handleSaveCurrentEvaluation = () => {
    showToast(`✅ [${currentStartup.companyName}] 평가 점수(${currentTotalScore}점) 및 심사의견이 저장되었습니다.`);
  };

  // Final Submit
  const handleFinalSubmit = () => {
    if (!isAgreedTerms) {
      showToast('심사 공정성 서약 및 개인정보 처리에 동의해주세요.');
      return;
    }
    setIsFinalSubmitted(true);
    setShowFinalSubmitModal(false);
    showToast('🎉 전체 기업 심사평가서 및 전자서명이 주최 측에 최종 제출되었습니다.');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Program Banner & Timer */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] shadow-[0_4px_20px_rgba(30,50,35,0.04)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF3E4] text-[#2E6B48] text-xs font-bold border border-[#D8EAD3]">
              심사위원 전용 포털 (Judge Portal)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF3E4] text-[#2E6B48] border border-[#D8EAD3] font-bold flex items-center gap-1">
              <Check className="w-2.5 h-2.5" /> 입장 승인됨
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E1B14]">{program.title}</h1>
          <p className="text-xs text-[#5B6A62]">
            심사위원: <strong className="text-[#0E1B14]">이지훈 수석심사역</strong> (카카오벤처스 파트너) | 장소: {program.venue}
          </p>
        </div>

        {/* Pitching Timer & Submissions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-[#F7F8F5] px-4 py-2 rounded-2xl border border-[#E2E8E3]">
            <div className="flex items-center gap-2 font-mono">
              <Clock className={`w-4 h-4 ${timerSeconds < 180 ? 'text-[#DA5A4B] animate-pulse' : 'text-[#3E8A5C]'}`} />
              <span className={`text-base font-black tracking-wider ${timerSeconds < 180 ? 'text-[#DA5A4B]' : 'text-[#2E6B48]'}`}>
                {formatTimer(timerSeconds)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-1 rounded-lg bg-white hover:bg-[#EEF1E9] text-[#2A3830] border border-[#DCE4DE]"
                title={isTimerRunning ? '일시정지' : '타이머 시작'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(15 * 60);
                }}
                className="p-1 rounded-lg bg-white hover:bg-[#EEF1E9] text-[#5B6A62] border border-[#DCE4DE]"
                title="15분 초기화"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowProfileModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-[#F7F8F5] hover:bg-[#EEF1E9] text-[#2A3830] text-xs font-bold border border-[#E2E8E3] flex items-center gap-1.5 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#3E8A5C]" />
            <span>서류 관리</span>
          </button>

          <button
            onClick={() => setShowFinalSubmitModal(true)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
              isFinalSubmitted
                ? 'bg-[#EAF3E4] text-[#2E6B48] border border-[#D8EAD3] cursor-default'
                : 'bg-[#2E6B48] hover:bg-[#245239] text-white shadow-[#2E6B48]/20'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{isFinalSubmitted ? '제출 완료됨' : '최종 서명 제출'}</span>
          </button>
        </div>
      </div>

      {/* Startup Presentation Switcher Bar */}
      <div className="bg-white rounded-3xl p-4 border border-[#E2E8E3] flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          <span className="text-xs font-extrabold text-[#5B6A62] mr-1 flex items-center gap-1 shrink-0">
            <Layers className="w-3.5 h-3.5 text-[#3E8A5C]" />
            피칭 순서:
          </span>
          {pitches.map((s) => {
            const isSelected = s.id === selectedStartupId;
            const hasEvaluated = s.evaluations.some((e) => e.judgeId === 'judge1');
            return (
              <button
                key={s.id}
                onClick={() => setSelectedStartupId(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap border ${
                  isSelected
                    ? 'bg-[#EAF3E4] text-[#2E6B48] border-[#5CA47A] shadow-sm'
                    : 'bg-[#F7F8F5] text-[#5B6A62] border-[#E2E8E3] hover:text-[#0E1B14] hover:border-[#C4D4C8]'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-mono border border-[#DCE4DE]">
                  #{s.order}
                </span>
                <span>{s.companyName}</span>
                {hasEvaluated && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3E8A5C] ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs text-[#5B6A62] ml-auto font-medium">
          <span>평가 완료 현황:</span>
          <div className="w-24 bg-[#EEF1E9] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#3E8A5C] h-full rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / pitches.length) * 100}%` }}
            />
          </div>
          <span className="font-bold text-[#2E6B48] font-mono">{completedCount}/{pitches.length}개사</span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Startup Deck Info, AI Summary, Q&A, Suggested Questions (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1. Header Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] space-y-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EAF3E4] text-[#2E6B48] text-[11px] font-bold border border-[#D8EAD3]">
                  발표 #{currentStartup.order}
                </span>
                <span className="text-xs text-[#5B6A62] font-semibold">{currentStartup.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#5B6A62] font-medium">AI 사전 평가:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                    currentStartup.aiGrade === 'HIGH'
                      ? 'bg-[#EAF3E4] text-[#2E6B48] border-[#D8EAD3]'
                      : 'bg-[#FDF6E3] text-[#B08A3E] border-[#F4E3BA]'
                  }`}
                >
                  {currentStartup.aiGrade} ({currentStartup.aiScore}점)
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0E1B14]">{currentStartup.companyName}</h2>
              <p className="text-xs sm:text-sm text-[#2A3830] mt-1 font-medium leading-snug">
                {currentStartup.title}
              </p>
              <p className="text-xs text-[#5B6A62] mt-1">발표자: {currentStartup.representative} 대표</p>
            </div>

            <div className="mt-3 pt-3 border-t border-[#EEF1E9] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#2A3830]">
                <FileText className="w-4 h-4 text-[#3E8A5C]" />
                <span>{currentStartup.deckFileName} (총 {currentStartup.deckPages}페이지)</span>
              </div>
              <button
                onClick={() => setShowDeckViewerModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#F7F8F5] hover:bg-[#EEF1E9] text-[#2E6B48] text-xs font-bold border border-[#E2E8E3] flex items-center gap-1.5 transition"
              >
                <Eye className="w-3.5 h-3.5" /> 슬라이드 전체화면 보기
              </button>
            </div>
          </div>

          {/* 2. AI Intelligence Summary Block */}
          <div className="bg-[#F7F8F5] rounded-3xl p-5 border border-[#D8EAD3] space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E6B48]">
              <Sparkles className="w-4 h-4 text-[#3E8A5C]" />
              AI 피칭 덱 핵심 요약 및 차별화 분석 (AI Intelligence Summary)
            </div>
            <p className="text-xs sm:text-sm text-[#2A3830] leading-relaxed bg-white p-4 rounded-2xl border border-[#E2E8E3]">
              {currentStartup.aiSummary}
            </p>
          </div>

          {/* 3. Pre-Consulting Q&A */}
          {program.hasPreConsulting && currentStartup.preConsultingQnAs.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-[#E2E8E3] space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-[#B08A3E]">
                <HelpCircle className="w-4 h-4" />
                사전 컨설팅 질의응답 (Pre-Consulting Q&A)
              </div>
              <div className="space-y-2.5">
                {currentStartup.preConsultingQnAs.map((qna) => (
                  <div key={qna.id} className="bg-[#F7F8F5] p-3.5 rounded-2xl border border-[#EEF1E9] space-y-1.5 text-xs">
                    <div className="text-[#5B6A62]">
                      <strong className="text-[#B08A3E] font-semibold">[사전 질문]:</strong> {qna.question}
                    </div>
                    <div className="text-[#0E1B14] pl-3 border-l-2 border-[#3E8A5C]">
                      <strong className="text-[#2E6B48] font-semibold">[기업 답변]:</strong> {qna.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Suggested Core Questions Checklist */}
          <div className="bg-white rounded-3xl p-5 border border-[#E2E8E3] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#3E8A5C]" />
                <h3 className="font-extrabold text-sm text-[#0E1B14]">현장 추천 질의 질문지 풀 (Core Questions)</h3>
              </div>
              <span className="text-[11px] text-[#5B6A62]">체크하여 현장 질의 항목으로 채택</span>
            </div>

            <div className="space-y-2.5">
              {currentStartup.suggestedQuestions.map((q) => (
                <div
                  key={q.id}
                  onClick={() => handleToggleQuestion(q.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                    q.isChecked
                      ? 'bg-[#EAF3E4]/70 border-[#5CA47A] text-[#0E1B14] shadow-sm'
                      : 'bg-[#F7F8F5] border-[#E2E8E3] text-[#5B6A62] hover:border-[#C4D4C8]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={q.isChecked}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-[#C4D4C8] text-[#3E8A5C] focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded-full font-bold border ${
                          q.source.includes('AI')
                            ? 'bg-[#F5EBFB] text-[#7B3DA8] border-[#E7C6F7]'
                            : q.source.includes('본인')
                            ? 'bg-[#E6F3FB] text-[#1E70A2] border-[#C2E3F7]'
                            : 'bg-[#EAF3E4] text-[#2E6B48] border-[#D8EAD3]'
                        }`}
                      >
                        {q.source}
                      </span>
                      {q.isChecked && (
                        <span className="text-[10px] text-[#2E6B48] font-bold">✓ 질의용 채택됨</span>
                      )}
                    </div>
                    <p className="leading-relaxed font-medium">{q.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Question Input */}
            <form onSubmit={handleAddCustomQuestion} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newQuestionInput}
                onChange={(e) => setNewQuestionInput(e.target.value)}
                placeholder="현장에서 기업에 직접 묻고 싶은 추가 질문을 작성하세요..."
                className="flex-1 bg-[#F7F8F5] border border-[#E2E8E3] rounded-2xl px-4 py-2.5 text-xs text-[#0E1B14] placeholder-[#9CA69F] focus:outline-none focus:border-[#3E8A5C] focus:bg-white transition"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> 추가
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Quantitative Scoring, Qualitative Feedback, AI Polish (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EEF1E9] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#3E8A5C]" />
                <h3 className="font-extrabold text-sm text-[#0E1B14]">정량 평가 항목 채점 (100점 만점)</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#5B6A62] block">합계 점수</span>
                <span className="text-2xl font-black text-[#2E6B48] font-mono">
                  {currentTotalScore} <span className="text-xs text-[#5B6A62] font-normal">/ 100</span>
                </span>
              </div>
            </div>

            {/* 4 Scoring Sliders */}
            <div className="space-y-4 text-xs">
              {/* 1. Tech (30) */}
              <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#EEF1E9] space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#0E1B14]">1. 기술성 및 차별성</span>
                    <span className="text-[10px] text-[#5B6A62] block">독창성, 특허 보유, TRL 성숙도</span>
                  </div>
                  <span className="font-mono font-bold text-[#2E6B48] text-sm">{currentEval.scores.tech} / 30점</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={currentEval.scores.tech}
                  onChange={(e) => handleScoreChange('tech', Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCE4DE] rounded-lg appearance-none cursor-pointer accent-[#3E8A5C]"
                />
              </div>

              {/* 2. Business (30) */}
              <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#EEF1E9] space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#0E1B14]">2. 시장성 및 BM 타당성</span>
                    <span className="text-[10px] text-[#5B6A62] block">타깃 시장 규모, 수익 모델, 고객 PoC</span>
                  </div>
                  <span className="font-mono font-bold text-[#2E6B48] text-sm">{currentEval.scores.business} / 30점</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={currentEval.scores.business}
                  onChange={(e) => handleScoreChange('business', Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCE4DE] rounded-lg appearance-none cursor-pointer accent-[#3E8A5C]"
                />
              </div>

              {/* 3. Team (20) */}
              <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#EEF1E9] space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#0E1B14]">3. 팀 역량 및 사업 추진력</span>
                    <span className="text-[10px] text-[#5B6A62] block">대표자 및 핵심 인력 전문성</span>
                  </div>
                  <span className="font-mono font-bold text-[#2E6B48] text-sm">{currentEval.scores.team} / 20점</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={currentEval.scores.team}
                  onChange={(e) => handleScoreChange('team', Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCE4DE] rounded-lg appearance-none cursor-pointer accent-[#3E8A5C]"
                />
              </div>

              {/* 4. Pitch (20) */}
              <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#EEF1E9] space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#0E1B14]">4. 발표 전달력 & 질의응답 대응</span>
                    <span className="text-[10px] text-[#5B6A62] block">논리적 전개 및 심사 질의 답변 완성도</span>
                  </div>
                  <span className="font-mono font-bold text-[#2E6B48] text-sm">{currentEval.scores.pitch} / 20점</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={currentEval.scores.pitch}
                  onChange={(e) => handleScoreChange('pitch', Number(e.target.value))}
                  className="w-full h-1.5 bg-[#DCE4DE] rounded-lg appearance-none cursor-pointer accent-[#3E8A5C]"
                />
              </div>
            </div>

            {/* Investment Interest Buttons */}
            <div className="space-y-2 pt-2 border-t border-[#EEF1E9]">
              <span className="text-xs font-bold text-[#0E1B14] block">후속 투자 및 사업 연계 추천 여부</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'STRONG_RECOMMEND', label: '🔥 적극 추천', activeClass: 'border-[#3E8A5C] bg-[#EAF3E4] text-[#2E6B48]' },
                  { id: 'REVIEW', label: '🧐 추가 검토', activeClass: 'border-[#F0B453] bg-[#FDF6E3] text-[#B08A3E]' },
                  { id: 'PASS', label: '✋ 보류 / 패스', activeClass: 'border-[#DA5A4B] bg-[#FBE8E6] text-[#C24E3A]' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleInterestChange(item.id as InvestmentInterest)}
                    className={`py-2 px-2 rounded-2xl text-xs font-bold border transition ${
                      currentEval.investmentInterest === item.id
                        ? `${item.activeClass} shadow-sm font-black`
                        : 'border-[#E2E8E3] bg-[#F7F8F5] text-[#5B6A62] hover:border-[#C4D4C8]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Qualitative Feedback Textarea + AI Polish Button */}
            <div className="space-y-2 pt-2 border-t border-[#EEF1E9]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#0E1B14] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#3E8A5C]" />
                  전문가 정성 심사의견 (총평 & 보완점)
                </label>
                <button
                  type="button"
                  onClick={handleAiRefineFeedback}
                  className="text-[11px] text-[#2E6B48] hover:text-[#245239] font-bold flex items-center gap-1 bg-[#EAF3E4] px-2.5 py-1 rounded-xl border border-[#D8EAD3] transition"
                >
                  <Sparkles className="w-3 h-3 text-[#3E8A5C]" /> AI 문장 다듬기
                </button>
              </div>
              <textarea
                rows={4}
                value={currentEval.feedback}
                onChange={(e) => handleFeedbackChange(e.target.value)}
                placeholder="기업의 핵심 강점, 기술적 리스크, 후속 성장을 위한 전문가 제언을 상세히 입력해주세요."
                className="w-full bg-[#F7F8F5] border border-[#E2E8E3] rounded-2xl p-3.5 text-xs text-[#0E1B14] placeholder-[#9CA69F] focus:outline-none focus:border-[#3E8A5C] focus:bg-white transition leading-relaxed"
              />
            </div>

            {/* Save & Next Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveCurrentEvaluation}
                className="flex-1 py-3 rounded-2xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs shadow-md shadow-[#2E6B48]/15 flex items-center justify-center gap-1.5 transition"
              >
                <Save className="w-4 h-4" />
                <span>현재 기업 평가 확정 & 저장</span>
              </button>

              {currentStartup.order < pitches.length && (
                <button
                  type="button"
                  onClick={() => {
                    handleSaveCurrentEvaluation();
                    setSelectedStartupId(pitches[currentStartup.order].id);
                  }}
                  className="px-4 py-3 rounded-2xl bg-[#F7F8F5] hover:bg-[#EEF1E9] text-[#2A3830] font-bold text-xs border border-[#E2E8E3] flex items-center gap-1 transition"
                >
                  <span>다음 기업</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Modal 1: Judge Profile & Qualifications Document */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-[#0E1B14]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-[#E2E8E3] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EEF1E9] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#3E8A5C]" />
                <h3 className="font-extrabold text-base text-[#0E1B14]">심사위원 프로필 및 수당 자격 서류 관리</h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-[#5B6A62] hover:text-[#0E1B14] text-xs p-1"
              >
                닫기 ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F7F8F5] p-3.5 rounded-2xl border border-[#EEF1E9]">
                  <span className="text-[#5B6A62] block">성명</span>
                  <span className="font-bold text-[#0E1B14] text-sm">이지훈 수석심사역</span>
                </div>
                <div className="bg-[#F7F8F5] p-3.5 rounded-2xl border border-[#EEF1E9]">
                  <span className="text-[#5B6A62] block">소속 및 직책</span>
                  <span className="font-bold text-[#0E1B14] text-sm">카카오벤처스 / 파트너</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="font-bold text-[#0E1B14] block">
                  정부 지원 사업 수당 지급용 증빙 서류
                </span>

                {/* ID Card */}
                <div className="bg-[#F7F8F5] p-3.5 rounded-2xl border border-[#EEF1E9] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#3E8A5C]" />
                    <div>
                      <span className="font-bold text-[#0E1B14] block">신분증 사본 (주민등록증/운전면허증)</span>
                      <span className="text-[11px] text-[#2E6B48]">
                        {idCardUploaded ? '✓ 서류 등록 완료 (id_card_lee.png)' : '미등록'}
                      </span>
                    </div>
                  </div>
                  <label className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EEF1E9] text-[#2E6B48] text-xs font-bold border border-[#DCE4DE] cursor-pointer flex items-center gap-1 shadow-sm">
                    <Upload className="w-3 h-3" /> 변경
                    <input
                      type="file"
                      className="hidden"
                      onChange={() => {
                        setIdCardUploaded(true);
                        showToast('신분증 사본이 성공적으로 업로드되었습니다.');
                      }}
                    />
                  </label>
                </div>

                {/* Bankbook */}
                <div className="bg-[#F7F8F5] p-3.5 rounded-2xl border border-[#EEF1E9] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#3E8A5C]" />
                    <div>
                      <span className="font-bold text-[#0E1B14] block">통장 사본 (본인 명의 계좌)</span>
                      <span className="text-[11px] text-[#2E6B48]">
                        {bankbookUploaded ? '✓ 서류 등록 완료 (bankbook_kakao.png)' : '미등록'}
                      </span>
                    </div>
                  </div>
                  <label className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EEF1E9] text-[#2E6B48] text-xs font-bold border border-[#DCE4DE] cursor-pointer flex items-center gap-1 shadow-sm">
                    <Upload className="w-3 h-3" /> 변경
                    <input
                      type="file"
                      className="hidden"
                      onChange={() => {
                        setBankbookUploaded(true);
                        showToast('통장 사본이 성공적으로 업로드되었습니다.');
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EEF1E9] flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-5 py-2 rounded-2xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs shadow-sm"
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Slide Deck Viewer */}
      {showDeckViewerModal && (
        <div className="fixed inset-0 z-50 bg-[#0E1B14]/80 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[#2A3830] text-white">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#5CA47A]" />
              <span className="font-extrabold text-sm sm:text-base">
                [{currentStartup.companyName}] 피칭 슬라이드 덱 뷰어
              </span>
            </div>
            <button
              onClick={() => setShowDeckViewerModal(false)}
              className="px-3 py-1 bg-[#2A3830] text-white rounded-xl text-xs font-bold hover:bg-[#3B4340]"
            >
              닫기 ✕
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center my-4">
            <div className="w-full max-w-4xl aspect-[16/9] bg-white rounded-3xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden shadow-2xl border border-[#E2E8E3]">
              <div className="text-[#3E8A5C] font-mono text-xs font-bold mb-2">EDEN-IR DECK VIEWER</div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0E1B14]">{currentStartup.title}</h3>
              <p className="text-sm text-[#5B6A62] mt-2">{currentStartup.companyName} | 발표자: {currentStartup.representative} 대표</p>
              
              <div className="mt-8 p-4 bg-[#F7F8F5] rounded-2xl border border-[#EEF1E9] max-w-md text-xs text-[#2A3830]">
                <div className="text-[11px] text-[#9CA69F]">슬라이드 1 / {currentStartup.deckPages} 페이지</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Final E-Signature Submission */}
      {showFinalSubmitModal && (
        <div className="fixed inset-0 z-50 bg-[#0E1B14]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-[#E2E8E3] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EEF1E9] pb-3">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-[#3E8A5C]" />
                <h3 className="font-extrabold text-base text-[#0E1B14]">최종 평가표 전자 서명 및 제출</h3>
              </div>
              <button
                onClick={() => setShowFinalSubmitModal(false)}
                className="text-[#5B6A62] hover:text-[#0E1B14] text-xs p-1"
              >
                닫기 ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#EEF1E9] space-y-2">
                <div className="flex justify-between text-[#5B6A62]">
                  <span>행사명:</span>
                  <span className="font-bold text-[#0E1B14]">{program.title}</span>
                </div>
                <div className="flex justify-between text-[#5B6A62]">
                  <span>심사위원:</span>
                  <span className="font-bold text-[#2E6B48]">{signatureName}</span>
                </div>
                <div className="flex justify-between text-[#5B6A62]">
                  <span>평가 완료 현황:</span>
                  <span className="font-bold text-[#2E6B48]">{completedCount} / {pitches.length} 개사 완료</span>
                </div>
              </div>

              <div className="p-4 bg-[#F7F8F5] rounded-2xl border border-[#EEF1E9]">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={isAgreedTerms}
                    onChange={(e) => setIsAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded border-[#C4D4C8] text-[#3E8A5C] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-[11px] text-[#2A3830] leading-relaxed cursor-pointer font-medium">
                    본인은 심사위원으로서 관련 규정을 준수하고 공정하게 평가하였으며, 제출된 평가 결과는 최종 확정본임을 확인합니다.
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#0E1B14] block">심사위원 정자 서명 확인</label>
                <div className="relative">
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    className="w-full bg-[#F7F8F5] border border-[#E2E8E3] rounded-2xl px-4 py-3 text-sm font-bold text-[#2E6B48] focus:outline-none focus:border-[#3E8A5C] focus:bg-white"
                  />
                  <span className="absolute right-4 top-3 text-xs text-[#5B6A62] font-serif italic">(서명)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EEF1E9] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFinalSubmitModal(false)}
                className="px-4 py-2 rounded-2xl bg-[#F7F8F5] hover:bg-[#EEF1E9] text-[#5B6A62] text-xs font-bold border border-[#E2E8E3]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 rounded-2xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs shadow-md shadow-[#2E6B48]/15 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> 최종 전송 확정
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

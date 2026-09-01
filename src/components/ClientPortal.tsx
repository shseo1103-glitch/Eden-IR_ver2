import React, { useState, useMemo } from 'react';
import { Program, PitchStartup } from '../types';
import {
  Briefcase,
  FileCheck,
  BarChart3,
  Award,
  CheckCircle2,
  Download,
  Eye,
  Sparkles,
  Building2,
  TrendingUp,
  FileText,
  FileSpreadsheet,
  Check,
  FolderDown,
  Target,
  Copy,
  BookmarkCheck
} from 'lucide-react';

interface ClientPortalProps {
  program: Program;
  setProgram: React.Dispatch<React.SetStateAction<Program>>;
  pitches: PitchStartup[];
  showToast: (msg: string) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  program,
  setProgram,
  pitches,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'monitor' | 'matrix' | 'deliverables' | 'policyMatch'>('overview');
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<number>(pitches[0]?.id || 101);
  const [isOfficialApproved, setIsOfficialApproved] = useState(true);

  const currentEnterprise = useMemo(() => {
    return pitches.find((p) => p.id === selectedEnterpriseId) || pitches[0];
  }, [pitches, selectedEnterpriseId]);

  // Copy to clipboard helper
  const handleCopyToClipboard = (text: string, label: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`📋 ${label} 내용이 클립보드에 복사되었습니다. (공문서 및 내부 보고서에 붙여넣기 가능)`);
    } catch (err) {
      showToast('복사에 실패했습니다.');
    }
    document.body.removeChild(textArea);
  };

  // Toggle Official Deliverable Sign-off
  const handleToggleOfficialApproval = () => {
    setIsOfficialApproved(!isOfficialApproved);
    showToast(
      isOfficialApproved
        ? '⚠️ 최종 검수 승인이 취소되고 보완 요청 상태로 전환되었습니다.'
        : '🎉 [발주처 공식 승인 완료] 운영사 납품 결과 보고서가 최종 검수 승인(Sign-off) 처리되었습니다.'
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] shadow-[0_4px_20px_rgba(30,50,35,0.04)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#207D42] text-xs font-bold border border-[#C4EDCE] flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> 발주처 · 주관기관 전용 포털 (Client Portal)
            </span>
            <span className="text-xs text-[#5B6A62]">사업 코드: <strong className="font-mono text-[#0E1B14]">{program.code}</strong></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E1B14]">중소벤처기업진흥공단 (강민구 팀장)</h1>
          <p className="text-xs text-[#5B6A62]">
            소속: 글로벌혁신성장본부 스케일업지원처 | 예산: <strong className="text-[#0E1B14]">{program.budget}</strong>
          </p>
        </div>

        {/* Official Sign-off Button */}
        <button
          onClick={handleToggleOfficialApproval}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-md ${
            isOfficialApproved
              ? 'bg-[#2E6B48] hover:bg-[#245239] text-white shadow-[#2E6B48]/15'
              : 'bg-[#CE8A2E] hover:bg-[#B77820] text-white shadow-[#CE8A2E]/15'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>{isOfficialApproved ? '✓ 사업 납품 결과 최종 검수 완료됨' : '사업 납품 결과물 검수 승인'}</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#E2E8E3] pb-3">
        {[
          { id: 'overview', label: '사업 성과 총괄 현황', icon: BarChart3 },
          { id: 'monitor', label: '실시간 행사 관제 & 참관', icon: Eye },
          { id: 'matrix', label: '기업별 심사·진단 매트릭스', icon: Award },
          { id: 'deliverables', label: '결과 납품 보고서 최종 검수', icon: FileSpreadsheet },
          { id: 'policyMatch', label: 'TIPS 및 후속 정책연계 매칭', icon: TrendingUp },
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

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E2E8E3] space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#5B6A62]">
                <span>참여 기업 피칭 완수율</span>
                <CheckCircle2 className="w-4 h-4 text-[#3E8A5C]" />
              </div>
              <div className="text-2xl font-black text-[#0E1B14]">100%</div>
              <div className="text-[11px] text-[#2E6B48] font-semibold">3 / 3개사 피칭 및 질의 완수</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2E8E3] space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#5B6A62]">
                <span>심사위원단 종합 평균 평점</span>
                <Award className="w-4 h-4 text-[#F0B453]" />
              </div>
              <div className="text-2xl font-black text-[#2E6B48] font-mono">89.7점</div>
              <div className="text-[11px] text-[#2E6B48] font-semibold">전년 대비 +4.2점 향상</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2E8E3] space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#5B6A62]">
                <span>투자사 후속 미팅 추천율</span>
                <TrendingUp className="w-4 h-4 text-[#B08A3E]" />
              </div>
              <div className="text-2xl font-black text-[#B08A3E] font-mono">66.7%</div>
              <div className="text-[11px] text-[#B08A3E] font-semibold">2개사 VC 즉시 텀시트 검토</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2E8E3] space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#5B6A62]">
                <span>TIPS / 초격차 과제 추천</span>
                <Sparkles className="w-4 h-4 text-[#7B3DA8]" />
              </div>
              <div className="text-2xl font-black text-[#7B3DA8] font-mono">2개 사</div>
              <div className="text-[11px] text-[#7B3DA8] font-semibold">패스트트랙 추천 확정</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] space-y-4 shadow-sm">
            <h3 className="font-extrabold text-[#0E1B14] text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-[#3E8A5C]" />
              지원 사업 수혜 기업 종합 성과 순위표
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-[#E2E8E3]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#F7F8F5] text-[#5B6A62] font-bold border-b border-[#E2E8E3]">
                  <tr>
                    <th className="p-3.5">순위</th>
                    <th className="p-3.5">기업명 (대표자)</th>
                    <th className="p-3.5">핵심 기술 분야</th>
                    <th className="p-3.5">AI 등급</th>
                    <th className="p-3.5">심사위원 평균</th>
                    <th className="p-3.5">컨설턴트 점수</th>
                    <th className="p-3.5">추천 정책사업</th>
                    <th className="p-3.5 text-right">상세 검토</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF1E9] text-[#2A3830]">
                  {pitches.map((ent, idx) => {
                    const judgeAvg = (ent.evaluations.reduce((a, b) => a + b.totalScore, 0) / ent.evaluations.length).toFixed(1);
                    return (
                      <tr key={ent.id} className="hover:bg-[#FBFDFB] transition">
                        <td className="p-3.5">
                          <span className="w-6 h-6 rounded-full bg-[#EEF1E9] text-[#0E1B14] font-bold flex items-center justify-center text-xs font-mono">
                            #{idx + 1}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-[#0E1B14]">
                          <div>{ent.companyName}</div>
                          <div className="text-[11px] text-[#5B6A62] font-normal">{ent.representative} 대표</div>
                        </td>
                        <td className="p-3.5 text-[#5B6A62]">{ent.category}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EAF3E4] text-[#2E6B48] text-[11px] font-bold border border-[#D8EAD3]">
                            {ent.aiGrade} ({ent.aiScore}점)
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-[#2A3830]">{judgeAvg}점</td>
                        <td className="p-3.5 font-mono font-bold text-[#2E6B48]">{ent.consultantAssessment?.totalScore || 0}점</td>
                        <td className="p-3.5 text-xs font-bold text-[#2E6B48]">{ent.consultantAssessment?.recommendedGrant}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedEnterpriseId(ent.id);
                              setActiveTab('matrix');
                            }}
                            className="px-3 py-1.5 bg-[#F7F8F5] hover:bg-[#EEF1E9] text-[#2E6B48] rounded-xl text-xs font-bold border border-[#DCE4DE]"
                          >
                            진단서 보기
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Live Monitor */}
      {activeTab === 'monitor' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8E3] space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1E9] pb-4">
            <div>
              <h3 className="font-extrabold text-base text-[#0E1B14] flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#3E8A5C]" />
                실시간 IR 피칭 및 심사위원 평가 관제실 (Observer Mode)
              </h3>
              <p className="text-xs text-[#5B6A62] mt-0.5">
                발주처 담당자 권한으로 심사 현장 진행률, 참가자 출석 현황, 실시간 채점 입력 상태를 참관합니다.
              </p>
            </div>
            <span className="px-3 py-1 bg-[#EAF3E4] text-[#2E6B48] rounded-full text-xs font-bold border border-[#D8EAD3] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3E8A5C] animate-ping" />
              실시간 연동 중
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="p-5 rounded-3xl bg-[#F7F8F5] border border-[#E2E8E3] space-y-3">
              <span className="font-bold text-sm text-[#0E1B14] block">1. 행사 대기실 및 출석</span>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-2xl border border-[#EEF1E9] flex justify-between">
                  <span>심사위원 출석률</span>
                  <span className="font-mono font-bold text-[#2E6B48]">3 / 3명 (100%)</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-[#EEF1E9] flex justify-between">
                  <span>피칭 기업 출석률</span>
                  <span className="font-mono font-bold text-[#2E6B48]">3 / 3개사 (100%)</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#F7F8F5] border border-[#E2E8E3] space-y-3">
              <span className="font-bold text-sm text-[#0E1B14] block">2. 사전 컨설팅 모듈 현황</span>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-2xl border border-[#EEF1E9] flex justify-between">
                  <span>사전 컨설팅 스위치</span>
                  <span className="font-bold text-[#2E6B48]">활성화 (ON)</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-[#EEF1E9] flex justify-between">
                  <span>사전 질의응답 완수</span>
                  <span className="font-mono font-bold text-[#2E6B48]">완료</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#F7F8F5] border border-[#E2E8E3] space-y-3">
              <span className="font-bold text-sm text-[#0E1B14] block">3. 심사표 전자 서명</span>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-2xl border border-[#EEF1E9] flex justify-between">
                  <span>심사위원 서명 완료</span>
                  <span className="font-mono font-bold text-[#2E6B48]">3 / 3명 완료</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-[#EEF1E9] flex justify-between">
                  <span>수당 증빙서류 확인</span>
                  <span className="font-bold text-[#2E6B48]">신분증/통장 완료</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Matrix */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#E2E8E3] space-y-3 shadow-sm">
            <h3 className="font-extrabold text-sm text-[#0E1B14] mb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#3E8A5C]" />
              기업별 심층 성과표 선택
            </h3>
            <div className="space-y-2">
              {pitches.map((ent) => (
                <div
                  key={ent.id}
                  onClick={() => setSelectedEnterpriseId(ent.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                    ent.id === selectedEnterpriseId
                      ? 'bg-[#EAF3E4] border-[#5CA47A] text-[#0E1B14]'
                      : 'bg-[#F7F8F5] border-[#E2E8E3] text-[#5B6A62] hover:border-[#C4D4C8]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-[#0E1B14]">{ent.companyName}</span>
                    <span className="font-mono font-bold text-[#2E6B48] text-xs">AI {ent.aiScore}점</span>
                  </div>
                  <div className="text-[11px] text-[#5B6A62] mt-1 truncate">{ent.category}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#E2E8E3] space-y-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF1E9] pb-4">
              <div>
                <h2 className="text-lg font-black text-[#0E1B14]">{currentEnterprise.companyName}</h2>
                <p className="text-xs text-[#5B6A62] mt-0.5">{currentEnterprise.category} | 대표자: {currentEnterprise.representative}</p>
              </div>

              <button
                onClick={() => handleCopyToClipboard(
                  `[${currentEnterprise.companyName} 성과 요약]\n- AI 점수: ${currentEnterprise.aiScore}점 (${currentEnterprise.aiGrade})\n- 핵심 평가: ${currentEnterprise.aiSummary}\n- 추천 과제: ${currentEnterprise.consultantAssessment?.recommendedGrant}`,
                  `${currentEnterprise.companyName} 성과 요약`
                )}
                className="px-3.5 py-1.5 rounded-xl bg-[#F7F8F5] hover:bg-[#EEF1E9] text-[#2E6B48] font-bold text-xs border border-[#E2E8E3] flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> 상급부처 보고용 복사
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#EEF1E9] text-center">
                <span className="text-[11px] text-[#5B6A62] block">AI 1차 진단</span>
                <span className="text-lg font-black text-[#2E6B48] font-mono">{currentEnterprise.aiScore}점</span>
              </div>
              <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#EEF1E9] text-center">
                <span className="text-[11px] text-[#5B6A62] block">심사위원단 평균</span>
                <span className="text-lg font-black text-[#2A3830] font-mono">
                  {(currentEnterprise.evaluations.reduce((a, b) => a + b.totalScore, 0) / currentEnterprise.evaluations.length).toFixed(1)}점
                </span>
              </div>
              <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#EEF1E9] text-center">
                <span className="text-[11px] text-[#5B6A62] block">전문 컨설턴트</span>
                <span className="text-lg font-black text-[#7B3DA8] font-mono">
                  {currentEnterprise.consultantAssessment?.totalScore || 0}점
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#0E1B14] block">종합 검토 소견</span>
              <p className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#EEF1E9] text-[#2A3830] leading-relaxed">
                {currentEnterprise.aiSummary}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#2E6B48] block">후속 정부 지원 사업 추천 타깃</span>
              <div className="bg-[#EAF3E4] p-4 rounded-2xl border border-[#D8EAD3] text-[#2E6B48] font-bold flex items-center gap-2">
                <Target className="w-4 h-4 text-[#3E8A5C] shrink-0" />
                <span>{currentEnterprise.consultantAssessment?.recommendedGrant}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Deliverables Inspection */}
      {activeTab === 'deliverables' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8E3] space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1E9] pb-4">
              <div>
                <h3 className="font-extrabold text-base text-[#0E1B14] flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-[#3E8A5C]" />
                  위탁 운영사 공식 납품 산출물 검수 목록
                </h3>
                <p className="text-xs text-[#5B6A62] mt-0.5">
                  운영사가 생성한 최종 결과 보고서(DOCX), 심사 집계표(XLSX), 사진 대장을 검수하고 최종 지급 승인 여부를 결정합니다.
                </p>
              </div>

              <button
                onClick={() => showToast('📦 [초격차 데모데이] 전체 산출물 통합 압축팩(ZIP) 다운로드를 시작합니다.')}
                className="px-4 py-2.5 rounded-2xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#2E6B48]/15"
              >
                <FolderDown className="w-4 h-4" /> 산출물 일괄 다운로드 (ZIP)
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { title: '2026 하반기 초격차 스타트업 IR 데모데이 최종 성과보고서', format: 'DOCX (18.4 MB)', desc: '종합 총평, 수혜 기업별 성과표, 사진 대장 포함 완본' },
                { title: '심사위원 채점 집계표 및 평가위원별 정성 의견서', format: 'XLSX (4.2 MB)', desc: '세부 배점 항목별 원데이터 및 순위 산출식 연동' },
                { title: '심사위원 수당 지급 증빙 패키지 (신분증/통장/보안서약서)', format: 'PDF (12.1 MB)', desc: '지출 결의용 원천징수 대상자 서류 완비' },
                { title: '기업별 3단계 스케일업 및 TIPS 추천 진단서 3부', format: 'DOCX (8.7 MB)', desc: '전문 컨설턴트 정밀 진단 평가서' },
              ].map((doc, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#EEF1E9] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-[#3E8A5C] shrink-0" />
                    <div>
                      <span className="font-extrabold text-[#0E1B14] text-sm block">{doc.title}</span>
                      <span className="text-[11px] text-[#5B6A62]">{doc.desc} · {doc.format}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[#2E6B48] font-bold text-xs flex items-center gap-1">
                      <Check className="w-4 h-4 text-[#3E8A5C]" /> 검수 적합
                    </span>
                    <button
                      onClick={() => showToast(`📄 [${doc.title}] 다운로드가 시작되었습니다.`)}
                      className="px-3 py-1.5 bg-white hover:bg-[#EEF1E9] text-[#0E1B14] rounded-xl text-xs font-bold border border-[#E2E8E3] shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 inline mr-1" /> 받기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Policy Matching */}
      {activeTab === 'policyMatch' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8E3] space-y-6 shadow-sm">
            <div className="border-b border-[#EEF1E9] pb-4">
              <h3 className="text-base font-extrabold text-[#0E1B14] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#7B3DA8]" />
                발주처 후속 정책 자금 및 딥테크 TIPS 추천 심의
              </h3>
              <p className="text-xs text-[#5B6A62] mt-0.5">
                IR 행사 결과를 기반으로 중기부 딥테크 팁스, 기술보증기금 보증 연계, 글로벌 바우처 대상 기업을 확정합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {pitches.map((ent) => (
                <div key={ent.id} className="p-5 rounded-3xl bg-[#F7F8F5] border border-[#E2E8E3] space-y-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-base font-black text-[#0E1B14]">{ent.companyName}</span>
                      <span className="text-xs text-[#5B6A62] block mt-0.5">{ent.category}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-[#EAF3E4] text-[#2E6B48] font-mono text-xs font-bold border border-[#D8EAD3]">
                      AI {ent.aiScore}점
                    </span>
                  </div>

                  <div className="p-3.5 bg-white rounded-2xl border border-[#EEF1E9] text-xs space-y-1">
                    <span className="font-bold text-[#5B6A62] block">연계 추천 타깃:</span>
                    <p className="text-[#2E6B48] font-extrabold">{ent.consultantAssessment?.recommendedGrant}</p>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-[#5B6A62]">추천 심의 상태:</span>
                    <span className="text-[#2E6B48] font-bold flex items-center gap-1">
                      <BookmarkCheck className="w-4 h-4 text-[#3E8A5C]" /> 추천 대상 확정
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

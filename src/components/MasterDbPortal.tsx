import React, { useState, useMemo } from 'react';
import { Program, PitchStartup, MasterRawRow } from '../types';
import { MASTER_RAW_ROWS } from '../data/mockData';
import {
  Database,
  BarChart3,
  Download,
  Search,
  CheckCircle2,
  Building2,
  Award,
  Sparkles,
  Target,
  TrendingUp,
  FileSpreadsheet,
  Check
} from 'lucide-react';

interface MasterDbPortalProps {
  program: Program;
  pitches: PitchStartup[];
  showToast: (msg: string) => void;
}

export const MasterDbPortal: React.FC<MasterDbPortalProps> = ({
  program,
  pitches,
  showToast,
}) => {
  const [activeView, setActiveView] = useState<'collectedDb' | 'statsDashboard'>('collectedDb');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Rows matching current program
  const currentRows = useMemo(() => {
    return MASTER_RAW_ROWS.filter((r) => r.eventId === program.id);
  }, [program.id]);

  // Filtered rows by search & role
  const filteredRows = useMemo(() => {
    return currentRows.filter((r) => {
      const matchRole = roleFilter === 'ALL' || r.role === roleFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        r.name.toLowerCase().includes(q) ||
        r.affiliation.toLowerCase().includes(q) ||
        r.field.toLowerCase().includes(q) ||
        r.rowId.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [currentRows, roleFilter, searchQuery]);

  // Aggregation Calculations for Statistics Dashboard
  const stats = useMemo(() => {
    const startups = currentRows.filter((r) => r.role === 'STARTUP');
    const judges = currentRows.filter((r) => r.role === 'JUDGE');

    const enterpriseAggregations = startups.map((s) => {
      const ai = s.aiScore;
      const judge = s.judgeAvgScore;
      const consultantScore = s.consultantScore;
      const finalComposite = (ai * 0.2 + judge * 0.5 + consultantScore * 0.3).toFixed(1);

      return {
        companyName: s.affiliation,
        representative: s.name,
        field: s.field,
        aiGrade: s.aiGrade,
        aiScore: ai,
        judgeAvgScore: judge,
        consultantScore: consultantScore,
        finalScore: parseFloat(finalComposite),
        recommendedGrant: s.recommendedGrant,
        summary: s.aiSummary,
      };
    });

    enterpriseAggregations.sort((a, b) => b.finalScore - a.finalScore);
    enterpriseAggregations.forEach((item, idx) => {
      (item as any).rank = idx + 1;
    });

    const totalUsers = currentRows.length;
    const allJudgeScores = judges.map((j) => j.judgeAvgScore).filter((score) => score > 0);
    const globalJudgeAvg = allJudgeScores.length > 0
      ? (allJudgeScores.reduce((a, b) => a + b, 0) / allJudgeScores.length).toFixed(1)
      : '0.0';

    return {
      totalUsers,
      startupCount: startups.length,
      judgeCount: judges.length,
      globalJudgeAvg,
      enterpriseAggregations: enterpriseAggregations as (typeof enterpriseAggregations[0] & { rank: number })[],
    };
  }, [currentRows]);

  // Real Excel CSV Download with UTF-8 BOM for Master Raw Sheet
  const downloadMasterExcel = () => {
    const headers = [
      'No',
      '행ID',
      '역할구분',
      '성명',
      '직책',
      '소속/기업명',
      '이메일',
      '연락처',
      '사업자번호/계좌번호(서류)',
      '전문분야/업종',
      '제출문서(피칭덱/서약서)',
      '사전질의응답요약',
      'AI등급',
      'AI점수',
      'AI요약소견',
      '심사위원세부배점',
      '심사위원평균점수',
      '심사평/정성의견',
      '컨설턴트세부점수',
      '컨설턴트진단점수',
      '컨설턴트소견',
      '추천정책지원사업',
      '발주처검수상태',
      '수집일시',
    ];

    const rowsData = filteredRows.map((r, index) => [
      index + 1,
      r.rowId,
      r.roleKor,
      r.name,
      r.title,
      r.affiliation,
      r.email,
      r.phone,
      r.bizNumOrAccount,
      r.field,
      r.submittedDoc,
      r.preConsultingSummary,
      r.aiGrade,
      r.aiScore,
      r.aiSummary,
      r.judgeScoresDetail,
      r.judgeAvgScore,
      r.judgeComments,
      r.consultantScoresDetail,
      r.consultantScore,
      r.consultantSummary,
      r.recommendedGrant,
      r.clientAuditStatus,
      r.collectedAt,
    ]);

    const csvContent = '\uFEFF' + [
      headers.map((h) => `"${h}"`).join(','),
      ...rowsData.map((row) => row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `[Eden-IR_통합마스터DB]_${program.code}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('📊 엑셀 호환 CSV 마스터 DB 파일 다운로드가 완료되었습니다.');
  };

  // Download Aggregated Ranking Sheet CSV
  const downloadStatsExcel = () => {
    const headers = [
      '최종순위',
      '기업명',
      '대표자',
      '전문분야',
      'AI진단점수(20%)',
      'AI등급',
      '심사위원평균(50%)',
      '컨설턴트점수(30%)',
      '최종가중합산점수(100%)',
      '추천정책지원사업',
    ];

    const rowsData = stats.enterpriseAggregations.map((e) => [
      e.rank,
      e.companyName,
      e.representative,
      e.field,
      e.aiScore,
      e.aiGrade,
      e.judgeAvgScore,
      e.consultantScore,
      e.finalScore,
      e.recommendedGrant,
    ]);

    const csvContent = '\uFEFF' + [
      headers.map((h) => `"${h}"`).join(','),
      ...rowsData.map((row) => row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `[Eden-IR_가중합산순위집계표]_${program.code}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('📊 엑셀 호환 종합 순위 집계표 다운로드가 완료되었습니다.');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & View Switcher */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] shadow-[0_4px_20px_rgba(30,50,35,0.04)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FDF6E3] text-[#B08A3E] text-xs font-bold border border-[#F4E3BA] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> Eden-IR Master Sheet
            </span>
            <span className="text-xs text-[#5B6A62]">행사: <strong className="text-[#0E1B14]">{program.title}</strong></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E1B14]">통합 마스터 DB 및 통계 대시보드</h1>
          <p className="text-xs text-[#5B6A62]">
            각 사용자가 입력한 모든 원천 데이터(스타트업, 심사위원, 컨설턴트, 발주처)가 엑셀 형태로 통합 집계됩니다.
          </p>
        </div>

        {/* View Switcher Pill */}
        <div className="flex items-center bg-[#F7F8F5] p-1.5 rounded-2xl border border-[#E2E8E3]">
          <button
            onClick={() => setActiveView('collectedDb')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeView === 'collectedDb'
                ? 'bg-[#2E6B48] text-white shadow-sm'
                : 'text-[#5B6A62] hover:text-[#0E1B14]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>1. 단일 통합 DB 시트</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
              {currentRows.length}행
            </span>
          </button>

          <button
            onClick={() => setActiveView('statsDashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeView === 'statsDashboard'
                ? 'bg-[#2E6B48] text-white shadow-sm'
                : 'text-[#5B6A62] hover:text-[#0E1B14]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>2. 통계 및 집계 대시보드</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Unified Excel Grid View (24 Columns) */}
      {activeView === 'collectedDb' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF1E9] pb-4">
            <div>
              <h2 className="text-base font-extrabold text-[#0E1B14] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#3E8A5C]" />
                사용자별 전수 수집 데이터 단일 마스터 시트
              </h2>
              <p className="text-xs text-[#5B6A62] mt-0.5">
                피칭기업(덱·AI요약·Q&A), 심사위원(증빙서류·채점표·심사평), 컨설턴트(진단서), 발주처(검수)가 가로로 일괄 수집된 DB입니다.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#9CA69F]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="이름, 소속, 분야 검색..."
                  className="bg-[#F7F8F5] border border-[#E2E8E3] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#0E1B14] focus:outline-none focus:border-[#3E8A5C] focus:bg-white"
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-[#F7F8F5] text-xs font-bold text-[#2A3830] px-3 py-1.5 rounded-xl border border-[#E2E8E3] focus:outline-none cursor-pointer"
              >
                <option value="ALL">전체 사용자 ({currentRows.length}명)</option>
                <option value="STARTUP">피칭기업 (STARTUP)</option>
                <option value="JUDGE">심사위원 (JUDGE)</option>
                <option value="CONSULTANT">전문컨설턴트 (CONSULTANT)</option>
                <option value="CLIENT">발주처 담당관 (CLIENT)</option>
              </select>

              {/* CSV/XLSX Export */}
              <button
                onClick={downloadMasterExcel}
                className="px-4 py-2 rounded-xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#2E6B48]/15 transition"
              >
                <Download className="w-4 h-4" />
                <span>엑셀 다운로드 (XLSX/CSV)</span>
              </button>
            </div>
          </div>

          {/* 24-Column Excel Sheet Grid Table */}
          <div className="overflow-x-auto overflow-y-auto border border-[#E2E8E3] rounded-2xl bg-white max-h-[640px] shadow-inner">
            <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-[#F7F8F5] border-b border-[#DCE4DE] text-[#2A3830] sticky top-0 z-20 font-bold text-[11px] uppercase tracking-wider">
                  <th className="p-3 border-r border-[#E2E8E3] text-center w-12 sticky left-0 bg-[#F7F8F5] z-30">No</th>
                  <th className="p-3 border-r border-[#E2E8E3] sticky left-12 bg-[#F7F8F5] z-30">역할구분</th>
                  <th className="p-3 border-r border-[#E2E8E3] sticky left-28 bg-[#F7F8F5] z-30">성명 (직책)</th>
                  <th className="p-3 border-r border-[#E2E8E3]">소속 기관 / 기업명</th>
                  <th className="p-3 border-r border-[#E2E8E3]">연락처</th>
                  <th className="p-3 border-r border-[#E2E8E3]">이메일</th>
                  <th className="p-3 border-r border-[#E2E8E3]">사업자번호 / 수당계좌 (증빙서류)</th>
                  <th className="p-3 border-r border-[#E2E8E3]">전문분야 / 업종</th>
                  <th className="p-3 border-r border-[#E2E8E3]">제출문서 (피칭덱 / 서약서)</th>
                  <th className="p-3 border-r border-[#E2E8E3] min-w-[280px]">사전 컨설팅 질의 & 답변 요약</th>
                  <th className="p-3 border-r border-[#E2E8E3] text-center">AI 등급</th>
                  <th className="p-3 border-r border-[#E2E8E3] text-center">AI 점수</th>
                  <th className="p-3 border-r border-[#E2E8E3] min-w-[280px]">AI 덱 분석 핵심 요약</th>
                  <th className="p-3 border-r border-[#E2E8E3]">심사위원 세부 배점</th>
                  <th className="p-3 border-r border-[#E2E8E3] text-center">심사평균</th>
                  <th className="p-3 border-r border-[#E2E8E3] min-w-[280px]">심사평 / 정성 코멘트</th>
                  <th className="p-3 border-r border-[#E2E8E3]">컨설턴트 4대영역 점수</th>
                  <th className="p-3 border-r border-[#E2E8E3] text-center">진단점수</th>
                  <th className="p-3 border-r border-[#E2E8E3] min-w-[260px]">컨설턴트 진단 총평</th>
                  <th className="p-3 border-r border-[#E2E8E3] min-w-[200px]">추천 정책지원사업</th>
                  <th className="p-3 border-r border-[#E2E8E3]">발주처 검수상태</th>
                  <th className="p-3">수집일시</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1E9] text-[#2A3830]">
                {filteredRows.map((r, idx) => (
                  <tr key={r.rowId} className="hover:bg-[#FBFDFB] transition-colors group">
                    <td className="p-3 border-r border-[#EEF1E9] text-center font-mono text-[#5B6A62] bg-white group-hover:bg-[#FBFDFB] sticky left-0 z-10">
                      {idx + 1}
                    </td>
                    <td className="p-3 border-r border-[#EEF1E9] font-bold bg-white group-hover:bg-[#FBFDFB] sticky left-12 z-10">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          r.role === 'STARTUP'
                            ? 'bg-[#E6F3FB] text-[#1E70A2] border-[#C2E3F7]'
                            : r.role === 'JUDGE'
                            ? 'bg-[#EAF3E4] text-[#2E6B48] border-[#D8EAD3]'
                            : r.role === 'CONSULTANT'
                            ? 'bg-[#F5EBFB] text-[#7B3DA8] border-[#E7C6F7]'
                            : 'bg-[#EBF7EE] text-[#207D42] border-[#C4EDCE]'
                        }`}
                      >
                        {r.roleKor}
                      </span>
                    </td>
                    <td className="p-3 border-r border-[#EEF1E9] font-extrabold text-[#0E1B14] bg-white group-hover:bg-[#FBFDFB] sticky left-28 z-10">
                      {r.name} <span className="text-[#5B6A62] font-normal text-[11px]">({r.title})</span>
                    </td>
                    <td className="p-3 border-r border-[#EEF1E9] font-medium text-[#0E1B14]">{r.affiliation}</td>
                    <td className="p-3 border-r border-[#EEF1E9] font-mono text-[#5B6A62] text-[11px]">{r.phone}</td>
                    <td className="p-3 border-r border-[#EEF1E9] font-mono text-[#5B6A62] text-[11px]">{r.email}</td>
                    <td className="p-3 border-r border-[#EEF1E9] font-mono text-[11px] text-[#2A3830]">{r.bizNumOrAccount}</td>
                    <td className="p-3 border-r border-[#EEF1E9] text-[#2A3830]">{r.field}</td>
                    <td className="p-3 border-r border-[#EEF1E9] text-[#2E6B48] font-semibold text-[11px]">{r.submittedDoc}</td>
                    <td className="p-3 border-r border-[#EEF1E9] text-[#2A3830] max-w-xs truncate text-[11px]" title={r.preConsultingSummary}>
                      {r.preConsultingSummary}
                    </td>
                    <td className="p-3 border-r border-[#EEF1E9] text-center font-bold">
                      {r.aiGrade !== '-' ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.aiGrade === 'HIGH' ? 'bg-[#EAF3E4] text-[#2E6B48]' : 'bg-[#FDF6E3] text-[#B08A3E]'
                        }`}>
                          {r.aiGrade}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="p-3 border-r border-[#EEF1E9] text-center font-mono font-bold text-[#7B3DA8]">
                      {r.aiScore > 0 ? `${r.aiScore}점` : '-'}
                    </td>
                    <td className="p-3 border-r border-[#EEF1E9] text-[#5B6A62] max-w-xs truncate text-[11px]" title={r.aiSummary}>
                      {r.aiSummary}
                    </td>
                    <td className="p-3 border-r border-[#EEF1E9] font-mono text-[#2A3830] text-[11px]">{r.judgeScoresDetail}</td>
                    <td className="p-3 border-r border-[#EEF1E9] text-center font-mono font-bold text-[#B08A3E]">
                      {r.judgeAvgScore > 0 ? `${r.judgeAvgScore}점` : '-'}
                    </td>
                    <td className="p-3 border-r border-[#EEF1E9] text-[#2A3830] max-w-xs truncate text-[11px]" title={r.judgeComments}>
                      {r.judgeComments}
                    </td>
                    <td className="p-3 border-r border-[#EEF1E9] font-mono text-[#2A3830] text-[11px]">{r.consultantScoresDetail}</td>
                    <td className="p-3 border-r border-[#EEF1E9] text-center font-mono font-bold text-[#2E6B48]">
                      {r.consultantScore > 0 ? `${r.consultantScore}점` : '-'}
                    </td>
                    <td className="p-3 border-r border-[#EEF1E9] text-[#5B6A62] max-w-xs truncate text-[11px]" title={r.consultantSummary}>
                      {r.consultantSummary}
                    </td>
                    <td className="p-3 border-r border-[#EEF1E9] font-bold text-[#2E6B48] text-[11px]">{r.recommendedGrant}</td>
                    <td className="p-3 border-r border-[#EEF1E9] text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-[#EAF3E4] text-[#2E6B48] font-bold border border-[#D8EAD3]">
                        {r.clientAuditStatus}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#9CA69F]">{r.collectedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center text-xs text-[#5B6A62] pt-1">
            <span>총 {filteredRows.length}개의 마스터 데이터 행이 수집되었습니다. (가로 스크롤을 통해 24개 세부 항목 열람 가능)</span>
            <button
              onClick={downloadMasterExcel}
              className="text-[#2E6B48] hover:underline font-bold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> CSV 엑셀 파일 받기
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: Aggregated Statistics Dashboard */}
      {activeView === 'statsDashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E2E8E3] space-y-1 shadow-sm">
              <div className="flex justify-between items-center text-xs text-[#5B6A62]">
                <span>총 수집 데이터 행</span>
                <Database className="w-4 h-4 text-[#3E8A5C]" />
              </div>
              <div className="text-2xl font-black text-[#0E1B14] font-mono">{stats.totalUsers} 개 행 완비</div>
              <div className="text-[11px] text-[#2E6B48] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% 정상 수집 완료
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2E8E3] space-y-1 shadow-sm">
              <div className="flex justify-between items-center text-xs text-[#5B6A62]">
                <span>심사위원단 종합 평균</span>
                <Award className="w-4 h-4 text-[#F0B453]" />
              </div>
              <div className="text-2xl font-black text-[#2E6B48] font-mono">{stats.globalJudgeAvg} 점</div>
              <div className="text-[11px] text-[#5B6A62] font-semibold">심사위원 3인 평가 집계</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2E8E3] space-y-1 shadow-sm">
              <div className="flex justify-between items-center text-xs text-[#5B6A62]">
                <span>피칭 기업 수</span>
                <Building2 className="w-4 h-4 text-[#3E8A5C]" />
              </div>
              <div className="text-2xl font-black text-[#0E1B14] font-mono">{stats.startupCount} 개 사</div>
              <div className="text-[11px] text-[#2E6B48] font-semibold">초격차 딥테크 트랙</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2E8E3] space-y-1 shadow-sm">
              <div className="flex justify-between items-center text-xs text-[#5B6A62]">
                <span>TIPS / R&D 추천 확정</span>
                <Target className="w-4 h-4 text-[#7B3DA8]" />
              </div>
              <div className="text-2xl font-black text-[#7B3DA8] font-mono">2 개 사</div>
              <div className="text-[11px] text-[#7B3DA8] font-semibold">발주처 최종 승인 완료</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEF1E9] pb-4">
              <div>
                <h3 className="font-extrabold text-base text-[#0E1B14] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#3E8A5C]" />
                  수혜 기업별 최종 종합 순위 및 가중평점 집계표
                </h3>
                <p className="text-xs text-[#5B6A62] mt-0.5">
                  AI 점수(20%) + 심사위원 평균(50%) + 컨설턴트 점수(30%)를 가중 집계한 최종 순위표입니다.
                </p>
              </div>

              <button
                onClick={downloadStatsExcel}
                className="px-4 py-2 rounded-xl bg-[#2E6B48] hover:bg-[#245239] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#2E6B48]/15 transition"
              >
                <Download className="w-4 h-4" /> 집계표 엑셀 다운로드 (XLSX/CSV)
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E2E8E3]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#F7F8F5] text-[#5B6A62] font-bold border-b border-[#E2E8E3]">
                  <tr>
                    <th className="p-3.5 text-center w-16">순위</th>
                    <th className="p-3.5">기업명 (대표자)</th>
                    <th className="p-3.5">전문 기술 분야</th>
                    <th className="p-3.5 text-center">AI 점수 (20%)</th>
                    <th className="p-3.5 text-center">심사위원 평균 (50%)</th>
                    <th className="p-3.5 text-center">컨설턴트 점수 (30%)</th>
                    <th className="p-3.5 text-center">최종 가중합산 (100%)</th>
                    <th className="p-3.5">후속 정책지원사업 추천</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF1E9] text-[#2A3830]">
                  {stats.enterpriseAggregations.map((ent) => (
                    <tr key={ent.companyName} className="hover:bg-[#FBFDFB] transition">
                      <td className="p-3.5 text-center">
                        <span className={`w-7 h-7 rounded-xl font-bold flex items-center justify-center text-xs font-mono border mx-auto ${
                          ent.rank === 1
                            ? 'bg-[#EAF3E4] text-[#2E6B48] border-[#D8EAD3]'
                            : 'bg-[#EEF1E9] text-[#0E1B14] border-[#DCE4DE]'
                        }`}>
                          #{ent.rank}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-[#0E1B14]">
                        <div>{ent.companyName}</div>
                        <div className="text-[11px] text-[#5B6A62] font-normal">{ent.representative} 대표</div>
                      </td>
                      <td className="p-3.5 text-[#5B6A62]">{ent.field}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-[#7B3DA8]">
                        {ent.aiScore}점 ({ent.aiGrade})
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-[#2A3830]">
                        {ent.judgeAvgScore}점
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-[#2E6B48]">
                        {ent.consultantScore}점
                      </td>
                      <td className="p-3.5 text-center font-mono font-black text-[#2E6B48] text-base">
                        {ent.finalScore}점
                      </td>
                      <td className="p-3.5 font-bold text-[#2E6B48] text-xs">
                        {ent.recommendedGrant}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] space-y-4 shadow-sm">
              <h4 className="font-extrabold text-sm text-[#0E1B14] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#3E8A5C]" />
                심사위원 4대 배점 영역별 평균 점수 분포 (100점 만점)
              </h4>
              <div className="space-y-3.5 text-xs pt-1">
                {[
                  { label: '1. 기술성 및 혁신성', score: 27.2, max: 30, color: 'bg-[#2E6B48]' },
                  { label: '2. 시장성 및 비즈니스 모델', score: 26.5, max: 30, color: 'bg-[#3E8A5C]' },
                  { label: '3. 팀 역량 및 실행력', score: 18.2, max: 20, color: 'bg-[#5CA47A]' },
                  { label: '4. 발표 전달력 및 Q&A 대응', score: 18.6, max: 20, color: 'bg-[#B08A3E]' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-[#2A3830]">{item.label}</span>
                      <span className="font-mono text-[#2E6B48]">{item.score} / {item.max}점</span>
                    </div>
                    <div className="w-full bg-[#EEF1E9] h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${(item.score / item.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E2E8E3] space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-[#0E1B14] flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#3E8A5C]" />
                  후속 정부 지원 사업 및 TIPS 연계 매칭 현황
                </h4>
                <div className="space-y-2.5 mt-3 text-xs">
                  <div className="p-3.5 bg-[#F7F8F5] rounded-2xl border border-[#EEF1E9] flex justify-between items-center">
                    <span className="text-[#2A3830] font-medium">중기부 딥테크 TIPS 패스트트랙</span>
                    <span className="font-mono font-bold text-[#2E6B48]">1개 사 (네오스케일 AI)</span>
                  </div>
                  <div className="p-3.5 bg-[#F7F8F5] rounded-2xl border border-[#EEF1E9] flex justify-between items-center">
                    <span className="text-[#2A3830] font-medium">산업부 에너지 신산업 R&D</span>
                    <span className="font-mono font-bold text-[#2E6B48]">1개 사 (그린에너지 로보틱스)</span>
                  </div>
                  <div className="p-3.5 bg-[#F7F8F5] rounded-2xl border border-[#EEF1E9] flex justify-between items-center">
                    <span className="text-[#2A3830] font-medium">보건복지부 바이오 전용 펀드</span>
                    <span className="font-mono font-bold text-[#7B3DA8]">1개 사 (바이오셀 랩스)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EEF1E9] text-xs text-[#5B6A62] flex items-center justify-between">
                <span>발주처 공식 검수 상태:</span>
                <span className="text-[#2E6B48] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3E8A5C]" /> 최종 승인 완료
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

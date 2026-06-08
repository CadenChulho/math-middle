import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const UNIT_COLORS = {
  unit1: '#6C63FF',
  unit2: '#FF6584',
  unit3: '#43C6AC',
};

export default function QuizPage() {
  const router = useRouter();
  const { unitId } = router.query;

  const [studentName, setStudentName] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState('loading');
  const [result, setResult] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [error, setError] = useState('');

  const accent = UNIT_COLORS[unitId] || '#6C63FF';

  useEffect(() => {
    if (!unitId) return;
    const name = sessionStorage.getItem('studentName');
    if (!name) { router.replace('/'); return; }
    setStudentName(name);

    fetch(`/api/questions?unitId=${unitId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return; }
        setQuizData(data);
        setPhase('quiz');
      })
      .catch(() => setError('문제를 불러오지 못했습니다.'));
  }, [unitId]);

  if (!unitId) return null;

  const q = quizData?.questions[currentIdx];
  const total = quizData?.questions.length || 5;

  async function handleSubmit() {
    setPhase('submitting');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, unitId, answers }),
      });
      const data = await res.json();
      setResult(data);
      setPhase('result');
    } catch (e) {
      setError('제출 중 오류가 발생했습니다.');
      setPhase('quiz');
    }
  }

  function handleNext() {
    if (currentIdx < total - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      handleSubmit();
    }
  }

  function handleAnswer(val) {
    setAnswers(prev => ({ ...prev, [currentIdx]: val }));
  }

  const diffLabel = {
    '하': { text: '기초', bg: 'rgba(74,222,128,0.15)', color: '#4ade80' },
    '중': { text: '표준', bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
    '상': { text: '심화', bg: 'rgba(248,113,113,0.15)', color: '#f87171' }
  };

  // LOADING
  if (phase === 'loading') {
    return (
      <PageShell>
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9ca3af' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          문제를 불러오는 중...
          {error && <div style={{ color: '#f87171', marginTop: '1rem' }}>{error}</div>}
        </div>
      </PageShell>
    );
  }

  // QUIZ
  if (phase === 'quiz' && q) {
    const answered = answers[currentIdx] !== undefined && answers[currentIdx] !== '';
    const dl = diffLabel[q.난이도] || diffLabel['중'];

    return (
      <PageShell accent={accent}>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          .opts-mc { display: flex; flex-direction: column; gap: 0.65rem; }
          .opt-btn {
            background: rgba(255,255,255,0.05);
            border: 1.5px solid rgba(255,255,255,0.10);
            border-radius: 14px;
            padding: 0.85rem 1.1rem;
            color: #f0f0f5;
            font-family: 'Noto Sans KR', sans-serif;
            font-size: 0.95rem;
            cursor: pointer;
            text-align: left;
            transition: all 0.15s;
            display: flex; align-items: center; gap: 0.65rem;
            width: 100%;
          }
          .opt-btn:hover { background: rgba(255,255,255,0.10); }
          .opt-btn.selected { border-color: ${accent}; background: rgba(108,99,255,0.12); }
          .opt-num {
            width: 26px; height: 26px; border-radius: 50%;
            background: rgba(255,255,255,0.07);
            display: flex; align-items: center; justify-content: center;
            font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
            color: #9ca3af;
          }
          .opt-btn.selected .opt-num { background: ${accent}; color: #fff; }
          .sa-input {
            width: 100%;
            background: rgba(255,255,255,0.06);
            border: 1.5px solid rgba(255,255,255,0.12);
            border-radius: 14px;
            padding: 0.9rem 1.2rem;
            color: #f0f0f5;
            font-family: 'Noto Sans KR', sans-serif;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.2s;
          }
          .sa-input:focus { border-color: ${accent}; }
        `}</style>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.85rem' }}>← 홈</button>
          <div style={{ fontSize: '0.82rem', color: '#9ca3af' }}>{studentName} 학생</div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{quizData.단원}</span>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 700 }}>{currentIdx + 1} / {total}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
            <div style={{ background: accent, height: '100%', borderRadius: 999, width: `${((currentIdx + 1) / total) * 100}%`, transition: 'width 0.3s' }} />
          </div>
        </div>

        <div style={{ fontSize: '0.73rem', color: '#6b7280', marginBottom: '1.2rem' }}>
          📅 {quizData.weekStart} ~ {quizData.weekEnd} 문제
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: '1.5rem', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.72rem', background: dl.bg, color: dl.color, borderRadius: 999, padding: '0.2rem 0.6rem', fontWeight: 700 }}>{dl.text}</span>
            <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{q.유형}</span>
          </div>
          <div style={{ fontSize: '1.02rem', lineHeight: 1.7, fontWeight: 500 }}>{q.문제}</div>
        </div>

        {q.유형 === '객관식' ? (
          <div className="opts-mc">
            {q.보기.map((opt, i) => (
              <button
                key={i}
                className={`opt-btn${answers[currentIdx] === opt ? ' selected' : ''}`}
                onClick={() => handleAnswer(opt)}
              >
                <span className="opt-num">{['①','②','③','④'][i]}</span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <label style={{ fontSize: '0.82rem', color: '#9ca3af', display: 'block', marginBottom: '0.5rem' }}>답 입력</label>
            <input
              className="sa-input"
              placeholder="답을 입력하세요"
              value={answers[currentIdx] || ''}
              onChange={e => handleAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && answered && handleNext()}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          {currentIdx > 0 && (
            <button onClick={() => setCurrentIdx(i => i - 1)} style={{ flex: 1, padding: '0.9rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#9ca3af', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}>
              ← 이전
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!answered}
            style={{
              flex: 2, padding: '0.9rem',
              background: answered ? accent : 'rgba(255,255,255,0.06)',
              border: 'none', borderRadius: 14,
              color: answered ? '#fff' : '#6b7280',
              cursor: answered ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', fontSize: '0.95rem', fontWeight: 700,
              transition: 'all 0.2s',
            }}
          >
            {currentIdx < total - 1 ? '다음 문제 →' : '🎯 제출하기'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#4b5563' }}>
          📝 시험 모드 — 결과 화면에서 정답을 확인할 수 있어요
        </div>
      </PageShell>
    );
  }

  // SUBMITTING
  if (phase === 'submitting') {
    return (
      <PageShell>
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9ca3af' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
          채점 중...
        </div>
      </PageShell>
    );
  }

  // RESULT
  if (phase === 'result' && result) {
    const { graded, score, total: tot } = result;
    const pct = Math.round((score / tot) * 100);
    const emoji = pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 60 ? '😊' : '💪';

    return (
      <PageShell accent={accent}>
        <style>{`
          .result-item {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.09);
            border-radius: 16px;
            padding: 1.1rem 1.2rem;
            margin-bottom: 0.75rem;
          }
          .result-item.correct { border-left: 3px solid #4ade80; }
          .result-item.wrong { border-left: 3px solid #f87171; }
          .exp-box {
            margin-top: 0.6rem;
            padding: 0.7rem 0.9rem;
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            border-left: 2px solid #6C63FF;
          }
        `}</style>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{emoji}</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: accent }}>{score} / {tot}</div>
          <div style={{ fontSize: '1rem', color: '#9ca3af', marginTop: '0.25rem' }}>{pct}점 달성!</div>
          <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '0.5rem' }}>{studentName} 학생 · {quizData?.단원}</div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setShowAnswers(v => !v)}
            style={{
              flex: 1, padding: '0.85rem',
              background: showAnswers ? accent : 'rgba(255,255,255,0.07)',
              border: `1px solid ${showAnswers ? accent : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 14, color: showAnswers ? '#fff' : '#d1d5db',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 700,
              transition: 'all 0.2s',
            }}
          >
            {showAnswers ? '정답 숨기기 🙈' : '정답 + 해설 보기 👁'}
          </button>
          <button
            onClick={() => router.push('/')}
            style={{
              flex: 1, padding: '0.85rem',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 14, color: '#d1d5db',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem',
            }}
          >
            홈으로
          </button>
        </div>

        {graded.map((g, i) => {
          const dlMap = {
            '하': { text: '기초', color: '#4ade80' },
            '중': { text: '표준', color: '#fbbf24' },
            '상': { text: '심화', color: '#f87171' }
          };
          const d = dlMap[g.난이도] || dlMap['중'];
          return (
            <div key={i} className={`result-item ${g.isCorrect ? 'correct' : 'wrong'}`}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: d.color, fontWeight: 700 }}>{d.text}</span>
                  <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>문제 {i + 1}</span>
                </div>
                <span style={{ fontSize: '1.1rem' }}>{g.isCorrect ? '✅' : '❌'}</span>
              </div>
              <div style={{ fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '0.5rem', color: '#e5e7eb' }}>{g.문제}</div>
              <div style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                내 답: <span style={{ color: g.isCorrect ? '#4ade80' : '#f87171', fontWeight: 700 }}>{g.userAnswer || '(무응답)'}</span>
              </div>
              {showAnswers && (
                <div className="exp-box">
                  <div style={{ fontSize: '0.83rem', color: '#4ade80', fontWeight: 700, marginBottom: '0.35rem' }}>
                    정답: {g.정답} {g.isCorrect ? '✓' : ''}
                  </div>
                  {g.해설 ? (
                    <div style={{ fontSize: '0.8rem', color: '#c4b5fd', lineHeight: 1.7 }}>
                      💡 {g.해설}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>해설 없음</div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={() => router.push('/')}
          style={{
            width: '100%', padding: '1rem', marginTop: '1rem',
            background: accent, border: 'none', borderRadius: 14,
            color: '#fff', fontFamily: 'inherit', fontSize: '1rem', fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          다른 단원 풀기 →
        </button>
      </PageShell>
    );
  }

  return null;
}

function PageShell({ children, accent = '#6C63FF' }) {
  return (
    <>
      <Head>
        <title>중1 수학 퀴즈</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          min-height: 100vh;
          background: #0f0f1a;
          font-family: 'Noto Sans KR', sans-serif;
          color: #f0f0f5;
        }
        .container {
          max-width: 480px; margin: 0 auto;
          padding: 2rem 1.25rem 5rem;
          min-height: 100vh;
        }
      `}</style>
      <div className="container">{children}</div>
    </>
  );
}

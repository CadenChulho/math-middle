import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function AdminPage() {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [authed, setAuthed] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function login() {
    setLoading(true);
    setError('');
    const res = await fetch(`/api/admin-results?pw=${encodeURIComponent(pw)}`);
    const data = await res.json();
    setLoading(false);
    if (data.error) { setError('비밀번호가 틀렸습니다.'); return; }
    setResults(data.results || []);
    setAuthed(true);
  }

  const unitLabel = { unit1: '1. 수와 연산', unit2: '2. 문자와 식', unit3: '3. 좌표평면' };

  return (
    <>
      <Head>
        <title>관리자 — 중1 수학 퀴즈</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f0f1a; color: #f0f0f5; font-family: 'Noto Sans KR', sans-serif; }
        .wrap { max-width: 700px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
        .card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 16px; padding: 1.2rem;
          margin-bottom: 0.75rem;
        }
        .input {
          width: 100%; background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12); border-radius: 12px;
          padding: 0.85rem 1rem; color: #f0f0f5;
          font-family: 'Noto Sans KR', sans-serif; font-size: 1rem;
          outline: none; margin-bottom: 0.75rem;
        }
        .btn {
          width: 100%; padding: 0.9rem; border: none; border-radius: 12px;
          background: #6C63FF; color: #fff; font-family: 'Noto Sans KR', sans-serif;
          font-size: 1rem; font-weight: 700; cursor: pointer;
        }
        table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
        th { color: #9ca3af; padding: 0.5rem 0.4rem; border-bottom: 1px solid rgba(255,255,255,0.08); text-align: left; }
        td { padding: 0.6rem 0.4rem; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top; }
        .score-badge {
          display: inline-block; padding: 0.15rem 0.5rem; border-radius: 999px;
          font-weight: 700; font-size: 0.78rem;
        }
        .correct-detail { color: #4ade80; font-size: 0.72rem; }
        .wrong-detail { color: #f87171; font-size: 0.72rem; }
      `}</style>

      <div className="wrap">
        <div style={{ marginBottom: '2rem' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.85rem' }}>← 홈</button>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '0.75rem' }}>📊 학습 현황</h1>
          <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '0.25rem' }}>중1 수학 주간 퀴즈 관리자 페이지</p>
        </div>

        {!authed ? (
          <div className="card" style={{ maxWidth: 360 }}>
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '1rem' }}>관리자 비밀번호를 입력하세요</div>
            <input
              className="input"
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
            />
            {error && <div style={{ color: '#f87171', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{error}</div>}
            <button className="btn" onClick={login} disabled={loading}>{loading ? '확인 중...' : '로그인'}</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '1rem' }}>
              총 {results.length}개의 제출 기록
            </div>
            {results.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', color: '#9ca3af' }}>아직 제출된 기록이 없습니다.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>학생</th>
                      <th>단원</th>
                      <th>주차</th>
                      <th>점수</th>
                      <th>상세</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => {
                      const graded = typeof r.answers === 'string' ? JSON.parse(r.answers) : r.answers;
                      const pct = Math.round((r.score / r.total) * 100);
                      const scoreColor = pct === 100 ? '#4ade80' : pct >= 60 ? '#fbbf24' : '#f87171';
                      return (
                        <tr key={i}>
                          <td style={{ fontWeight: 700 }}>{r.student_name}</td>
                          <td style={{ color: '#9ca3af' }}>{unitLabel[r.unit_id] || r.unit_id}</td>
                          <td style={{ color: '#6b7280', fontSize: '0.72rem' }}>
                            {r.week_start}<br />~{r.week_end}
                          </td>
                          <td>
                            <span className="score-badge" style={{ background: `${scoreColor}22`, color: scoreColor }}>
                              {r.score}/{r.total} ({pct}%)
                            </span>
                          </td>
                          <td>
                            {graded && graded.map((g, j) => (
                              <div key={j} style={{ marginBottom: '0.2rem' }}>
                                <span className={g.isCorrect ? 'correct-detail' : 'wrong-detail'}>
                                  Q{j+1}: {g.isCorrect ? '✓' : `✗ (${g.userAnswer || '무응답'})`}
                                </span>
                              </div>
                            ))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

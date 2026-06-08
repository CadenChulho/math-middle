import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const UNITS = [
  { unitId: 'unit1', 단원: '1. 수와 연산', 단원부제: '소인수분해, 정수와 유리수', icon: '🔢', color: '#6C63FF' },
  { unitId: 'unit2', 단원: '2. 문자와 식', 단원부제: '문자의 사용, 일차방정식', icon: '🔡', color: '#FF6584' },
  { unitId: 'unit3', 단원: '3. 좌표평면과 그래프', 단원부제: '정비례와 반비례', icon: '📐', color: '#43C6AC' },
];

function getWeekLabel() {
  const now = new Date();
  const kst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  const day = kst.getDay();
  const daysSinceFri = (day + 2) % 7;
  const fri = new Date(kst);
  fri.setDate(kst.getDate() - daysSinceFri);
  const thu = new Date(fri);
  thu.setDate(fri.getDate() + 6);
  const fmt = d => `${d.getMonth()+1}/${d.getDate()}`;
  return `이번 주 문제 (${fmt(fri)} 금 ~ ${fmt(thu)} 목)`;
}

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [saved, setSaved] = useState('');
  const [weekLabel, setWeekLabel] = useState('');

  useEffect(() => {
    const n = sessionStorage.getItem('studentName') || '';
    setSaved(n);
    if (n) setName(n);
    setWeekLabel(getWeekLabel());
  }, []);

  function handleStart(unitId) {
    const trimmed = name.trim();
    if (!trimmed) { alert('이름을 입력해주세요!'); return; }
    sessionStorage.setItem('studentName', trimmed);
    router.push(`/quiz/${unitId}`);
  }

  return (
    <>
      <Head>
        <title>중1 수학 주간 퀴즈</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          min-height: 100vh;
          background: #0f0f1a;
          font-family: 'Noto Sans KR', sans-serif;
          color: #f0f0f5;
          overflow-x: hidden;
        }
        .bg-glow {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 0;
          background:
            radial-gradient(ellipse 60% 40% at 20% 20%, rgba(108,99,255,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(67,198,172,0.14) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 60% 10%, rgba(255,101,132,0.10) 0%, transparent 70%);
          pointer-events: none;
        }
        .container {
          position: relative; z-index: 1;
          max-width: 480px; margin: 0 auto;
          padding: 2.5rem 1.25rem 4rem;
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center;
        }
        .logo-area { text-align: center; margin-bottom: 2.5rem; }
        .logo-icon { font-size: 3rem; margin-bottom: 0.5rem; display: block; }
        .logo-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.6rem; font-weight: 700;
          background: linear-gradient(135deg, #a78bfa, #6C63FF, #43C6AC);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }
        .logo-sub {
          font-size: 0.82rem; color: #9ca3af;
          margin-top: 0.3rem; letter-spacing: 0.02em;
        }
        .week-badge {
          display: inline-block;
          background: rgba(108,99,255,0.15);
          border: 1px solid rgba(108,99,255,0.35);
          border-radius: 999px;
          padding: 0.3rem 1rem;
          font-size: 0.78rem; color: #a78bfa;
          margin-bottom: 2rem;
          letter-spacing: 0.03em;
        }
        .name-section { width: 100%; margin-bottom: 2rem; }
        .name-label {
          font-size: 0.82rem; color: #9ca3af;
          margin-bottom: 0.5rem; display: block;
          letter-spacing: 0.05em; text-transform: uppercase;
          font-weight: 500;
        }
        .name-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          padding: 0.9rem 1.2rem;
          color: #f0f0f5;
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .name-input:focus {
          border-color: rgba(108,99,255,0.6);
          background: rgba(108,99,255,0.08);
        }
        .name-input::placeholder { color: #6b7280; }
        .units-label {
          font-size: 0.82rem; color: #9ca3af;
          margin-bottom: 1rem; display: block;
          letter-spacing: 0.05em; text-transform: uppercase;
          font-weight: 500; width: 100%;
        }
        .unit-cards { width: 100%; display: flex; flex-direction: column; gap: 0.9rem; }
        .unit-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 18px;
          padding: 1.2rem 1.4rem;
          display: flex; align-items: center; gap: 1rem;
          cursor: pointer;
          transition: transform 0.18s, border-color 0.18s, background 0.18s;
          position: relative; overflow: hidden;
        }
        .unit-card::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px;
          border-radius: 3px 0 0 3px;
          transition: opacity 0.18s;
        }
        .unit-card:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.07);
        }
        .unit-icon {
          font-size: 2rem; width: 48px; height: 48px;
          background: rgba(255,255,255,0.06);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .unit-info { flex: 1; }
        .unit-name { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.15rem; }
        .unit-sub { font-size: 0.75rem; color: #9ca3af; }
        .unit-arrow {
          font-size: 1rem; color: #4b5563;
          transition: transform 0.18s, color 0.18s;
        }
        .unit-card:hover .unit-arrow { transform: translateX(4px); color: #9ca3af; }
        .unit-q-count {
          font-size: 0.7rem;
          background: rgba(255,255,255,0.07);
          border-radius: 999px;
          padding: 0.15rem 0.55rem;
          color: #9ca3af;
          margin-top: 0.25rem;
          display: inline-block;
        }
        .admin-link {
          margin-top: 3rem;
          font-size: 0.75rem; color: #374151;
          text-decoration: none;
          display: block; text-align: center;
          transition: color 0.2s;
        }
        .admin-link:hover { color: #6b7280; }
      `}</style>

      <div className="bg-glow" />
      <div className="container">
        <div className="logo-area">
          <span className="logo-icon">📚</span>
          <div className="logo-title">중1 수학 주간 퀴즈</div>
          <div className="logo-sub">매주 금요일 새 문제로 업데이트</div>
        </div>

        {weekLabel && <div className="week-badge">📅 {weekLabel}</div>}

        <div className="name-section">
          <label className="name-label">학생 이름</label>
          <input
            className="name-input"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && name.trim() && handleStart('unit1')}
            maxLength={10}
          />
        </div>

        <span className="units-label">단원 선택</span>
        <div className="unit-cards">
          {UNITS.map(u => (
            <div
              key={u.unitId}
              className="unit-card"
              style={{ '--accent': u.color }}
              onClick={() => handleStart(u.unitId)}
            >
              <style>{`.unit-card[data-id="${u.unitId}"]::before { background: ${u.color}; }`}</style>
              <div className="unit-icon">{u.icon}</div>
              <div className="unit-info">
                <div className="unit-name" style={{ color: u.color }}>{u.단원}</div>
                <div className="unit-sub">{u.단원부제}</div>
                <div className="unit-q-count">5문제 (하2 · 중2 · 상1)</div>
              </div>
              <span className="unit-arrow">›</span>
            </div>
          ))}
        </div>

        <a href="/admin" className="admin-link">관리자</a>
      </div>
    </>
  );
}

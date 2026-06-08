const questions = require('../data/questions');

// Week runs Friday(5) ~ Thursday(4)
// Returns the "week number" since a fixed epoch (2026-01-02 Friday)
function getWeekNumber(date) {
  const epoch = new Date('2026-01-02T00:00:00+09:00'); // First Friday
  const kstDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  const diffMs = kstDate - epoch;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

// Get the current week's Friday date string (KST)
function getCurrentWeekFriday() {
  const now = new Date();
  const kstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  const day = kstNow.getDay(); // 0=Sun, 5=Fri, 6=Sat
  // days since last Friday
  const daysSinceFri = (day + 2) % 7; // Fri=0, Sat=1, Sun=2, Mon=3, ...Thu=6
  const friday = new Date(kstNow);
  friday.setDate(kstNow.getDate() - daysSinceFri);
  return friday.toISOString().slice(0, 10);
}

// Get the current week's Thursday date string (end of week)
function getCurrentWeekThursday() {
  const friday = new Date(getCurrentWeekFriday() + 'T00:00:00');
  const thursday = new Date(friday);
  thursday.setDate(friday.getDate() + 6);
  return thursday.toISOString().slice(0, 10);
}

// Select 5 questions for a unit for this week (2 하, 2 중, 1 상)
function getWeeklyQuestions(unitId) {
  const unit = questions.find(u => u.unitId === unitId);
  if (!unit) return null;

  const weekNum = getWeekNumber(new Date());
  const all = unit.문제리스트;

  const low = all.filter(q => q.난이도 === '하');
  const mid = all.filter(q => q.난이도 === '중');
  const high = all.filter(q => q.난이도 === '상');

  function pickN(arr, n, offset) {
    const result = [];
    for (let i = 0; i < n; i++) {
      result.push(arr[(weekNum * n + offset + i) % arr.length]);
    }
    return result;
  }

  const selected = [
    ...pickN(low, 2, 0),
    ...pickN(mid, 2, 10),
    ...pickN(high, 1, 20),
  ];

  return {
    unitId: unit.unitId,
    단원: unit.단원,
    단원부제: unit.단원부제,
    weekStart: getCurrentWeekFriday(),
    weekEnd: getCurrentWeekThursday(),
    questions: selected.map((q, idx) => ({
      idx,
      번호: q.번호,
      난이도: q.난이도,
      유형: q.유형,
      문제: q.문제,
      보기: q.보기 || [],
      정답: q.정답,
      해설: q.해설 || '',
    }))
  };
}

function getAllUnits() {
  return questions.map(u => ({
    unitId: u.unitId,
    단원: u.단원,
    단원부제: u.단원부제,
  }));
}

module.exports = { getWeeklyQuestions, getAllUnits, getCurrentWeekFriday, getCurrentWeekThursday };

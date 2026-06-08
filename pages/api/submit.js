const { getWeeklyQuestions } = require('../../lib/weeklyQuestions');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://albvsukzrjeobxhawanb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsYnZzdWt6cmplb2J4aGF3YW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMDE0ODMsImV4cCI6MjA5NTg3NzQ4M30.hg3vQ9UQ1gzdemF0jCqq4l9er5VPqWiJN3AjMMA7GqM'
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { studentName, unitId, answers } = req.body;
  if (!studentName || !unitId || !answers) {
    return res.status(400).json({ error: '필수 데이터가 없습니다.' });
  }

  const weekData = getWeeklyQuestions(unitId);
  if (!weekData) return res.status(404).json({ error: '단원 없음' });

  const graded = weekData.questions.map((q, i) => {
    const userAnswer = (answers[i] || '').trim();
    const correct = q.정답.trim();
    const isCorrect = userAnswer === correct;
    return {
      idx: q.idx,
      번호: q.번호,
      난이도: q.난이도,
      유형: q.유형,
      문제: q.문제,
      보기: q.보기,
      정답: correct,
      해설: q.해설 || '',
      userAnswer,
      isCorrect,
    };
  });

  const score = graded.filter(g => g.isCorrect).length;
  const total = graded.length;

  try {
    await supabase.from('quiz_results_middle1').insert({
      student_name: studentName,
      unit_id: unitId,
      unit_name: weekData.단원,
      week_start: weekData.weekStart,
      week_end: weekData.weekEnd,
      score,
      total,
      answers: JSON.stringify(graded),
      submitted_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Supabase insert error:', e);
  }

  return res.status(200).json({ graded, score, total });
}

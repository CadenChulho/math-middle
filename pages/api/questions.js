const { getWeeklyQuestions, getAllUnits } = require('../../lib/weeklyQuestions');

export default function handler(req, res) {
  const { unitId } = req.query;

  if (!unitId) {
    // Return all units info
    return res.status(200).json({ units: getAllUnits() });
  }

  const data = getWeeklyQuestions(unitId);
  if (!data) {
    return res.status(404).json({ error: '단원을 찾을 수 없습니다.' });
  }

  // Strip answers for client
  const clientData = {
    ...data,
    questions: data.questions.map(q => ({
      idx: q.idx,
      번호: q.번호,
      난이도: q.난이도,
      유형: q.유형,
      문제: q.문제,
      보기: q.보기,
    }))
  };

  return res.status(200).json(clientData);
}

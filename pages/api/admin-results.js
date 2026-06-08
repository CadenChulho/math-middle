const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { pw } = req.query;
  const adminPw = process.env.ADMIN_PW || 'math5678!';
  if (pw !== adminPw) return res.status(401).json({ error: '인증 실패' });

  const { data, error } = await supabase
    .from('quiz_results_middle1')
    .select('*')
    .order('submitted_at', { ascending: false })
    .limit(200);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ results: data });
}

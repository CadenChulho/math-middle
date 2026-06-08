const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://albvsukzrjeobxhawanb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsYnZzdWt6cmplb2J4aGF3YW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMDE0ODMsImV4cCI6MjA5NTg3NzQ4M30.hg3vQ9UQ1gzdemF0jCqq4l9er5VPqWiJN3AjMMA7GqM'
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

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://albvsukzrjeobxhawanb.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsYnZzdWt6cmplb2J4aGF3YW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMDE0ODMsImV4cCI6MjA5NTg3NzQ4M30.hg3vQ9UQ1gzdemF0jCqq4l9er5VPqWiJN3AjMMA7GqM';

export const supabase = createClient(supabaseUrl, supabaseKey);

const { execSync } = require('child_process');

const envs = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://zwvbekumylpdujqtlqns.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3dmJla3VteWxwZHVqcXRscW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MjE0MDIsImV4cCI6MjEwNjI5NzQwMn0.0ul1XXB1J9g0mVMWQ0c7LL6_WcAjMSpKp6nvSIAhbOE',
  SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3dmJla3VteWxwZHVqcXRscW5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDcyMTQwMiwiZXhwIjoyMTA2Mjk3NDAyfQ.kNaZtbLO9LQFWzKe84CM12DRtSWlZmcRRzR0DyOTSrs',
  SETUP_SECRET_KEY: '4690708e3f1ce7eacb29dcc5c00a40efa9b80fb1942ca98acebdbea5818fa41a',
  TELEGRAM_ENCRYPTION_KEY: '3718711b45dca5e14b748fcb170eab6e259179449cba98acc0b4a7502b28737d'
};

const envTypes = ['production', 'preview', 'development'];

for (const [key, val] of Object.entries(envs)) {
  for (const t of envTypes) {
    try {
      console.log(`Adding ${key} to ${t}...`);
      execSync(`npx vercel env add ${key} ${t} --value "${val}" --yes --force`);
    } catch(e) {
      console.error(`Failed: ${key} on ${t}`);
    }
  }
}
console.log('Finished uploading variables.');

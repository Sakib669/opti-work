'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const response = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (response?.error) {
      setError('Invalid credentials.');
      return;
    }

    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-24 text-slate-100">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-800/90 bg-slate-900/80 p-10 shadow-glow backdrop-blur">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-sky-400">OptiWork Access</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Sign in to your workspace</h1>
          <p className="mt-2 text-slate-400">Use the seeded admin or staff account to test role-based access.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
      </div>
    </main>
  );
}

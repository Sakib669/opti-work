import Link from 'next/link';
import { LayoutDashboard, Tool, ListChecks, ShieldCheck, ArrowRight } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Workstations', href: '/workstations', icon: Tool },
  { title: 'Tasks', href: '/tasks', icon: ListChecks }
];

export default async function DashboardShell({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const username = session?.user?.name || session?.user?.email || 'Guest';
  const role = session?.user?.role || 'STAFF';

  return (
    <div className="main-shell">
      <aside className="sidebar border-r border-slate-800/80 px-6 py-8">
        <div className="mb-10">
          <div className="mb-6 flex items-center gap-3 rounded-3xl bg-slate-950/80 px-4 py-4 shadow-sm">
            <ShieldCheck className="h-8 w-8 text-sky-400" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">OptiWork</p>
              <p className="text-sm text-slate-300">{role === 'ADMIN' ? 'Administrator' : 'Staff'}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800/90 bg-slate-950/80 p-4 text-sm text-slate-300">
            <p className="font-semibold text-white">Signed in as</p>
            <p className="mt-1 truncate">{username}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"
            >
              <item.icon className="h-5 w-5 text-sky-400" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-10 rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 text-sm text-slate-300">
          <p className="mb-3 font-semibold text-white">Quick actions</p>
          <Link href="/tasks" className="inline-flex items-center gap-2 text-sky-300 hover:text-white">
            <ArrowRight className="h-4 w-4" /> Review tasks
          </Link>
        </div>
      </aside>

      <section className="content">{children}</section>
    </div>
  );
}

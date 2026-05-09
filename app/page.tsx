import Link from 'next/link';
import { ArrowRight, LayoutDashboard, Tool, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen py-24 px-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-800/60 bg-slate-950/70 p-10 shadow-glow backdrop-blur">
        <div className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400">OptiWork MVP</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Manufacturing Productivity Dashboard</h1>
          <p className="max-w-3xl text-slate-300 sm:text-lg">
            Track workstations, manage orders, and deliver a secure role-based workflow for admins and staff.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
            { label: 'Workstations', icon: Tool, href: '/workstations' },
            { label: 'Tasks', icon: Users, href: '/tasks' }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-3xl border border-slate-800/70 bg-slate-900/80 p-6 transition hover:border-sky-400/20 hover:bg-slate-900"
            >
              <div className="flex items-center gap-4">
                <item.icon className="h-8 w-8 text-sky-400 transition group-hover:text-white" />
                <div>
                  <p className="text-lg font-semibold text-white">{item.label}</p>
                  <p className="text-sm text-slate-400">Manage {item.label.toLowerCase()} and assignments.</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                View section <ArrowRight className="h-4 w-4 text-slate-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

import { ArrowRight, ClipboardList, ServerCog, Sparkles } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import DashboardShell from '../../components/dashboard-shell';
import { Badge } from '../../components/ui/badge';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/sign-in');

  const workstationCount = await prisma.workstation.count();
  const taskCount = await prisma.task.count();
  const completedTasks = await prisma.task.count({ where: { status: 'COMPLETED' } });
  const pendingTasks = await prisma.task.count({ where: { status: 'PENDING' } });
  const recentTasks = await prisma.task.findMany({
    orderBy: { deadline: 'asc' },
    take: 5,
    include: { workstation: true, assignee: true }
  });

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="rounded-3xl border border-slate-800/90 bg-slate-950/90 p-8 shadow-glow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-sky-400">Welcome back</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">OptiWork command center</h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Track workstation health, review active orders, and prioritize productivity from one central dashboard.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 text-slate-300 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-300">Signed in as</p>
              <p className="mt-2 text-lg font-semibold text-white">{session?.user?.name ?? session?.user?.email ?? 'Guest'}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Workstations', value: workstationCount, icon: ServerCog, variant: 'default' },
            { label: 'Total tasks', value: taskCount, icon: ClipboardList, variant: 'default' },
            { label: 'Completed', value: completedTasks, icon: Sparkles, variant: 'success' },
            { label: 'Open tasks', value: pendingTasks, icon: ArrowRight, variant: 'warning' }
          ].map((card) => (
            <div key={card.label} className="rounded-3xl border border-slate-800/90 bg-slate-950/90 p-6 shadow-glow">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
                </div>
                <card.icon className="h-8 w-8 text-sky-400" />
              </div>
              <Badge variant={card.variant as any} className="mt-5">
                {card.variant === 'success' ? 'On track' : card.variant === 'warning' ? 'Needs attention' : 'Stable'}
              </Badge>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-800/90 bg-slate-950/90 p-8 shadow-glow">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Upcoming tasks</h2>
              <p className="text-slate-400">Next deadlines and assigned workstations.</p>
            </div>
            <Link href="/tasks" className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm text-sky-300 transition hover:border-sky-400 hover:text-white">
              View all tasks
            </Link>
          </div>

          <div className="space-y-4">
            {recentTasks.length === 0 ? (
              <p className="text-slate-400">No tasks available yet.</p>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{task.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{task.workstation.name} • Assigned to {task.assignee?.name ?? 'Unassigned'}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-300">{task.status.replace('_', ' ')}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span>Priority: {task.priority}</span>
                    <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

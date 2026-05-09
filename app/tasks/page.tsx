import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import DashboardShell from '../../components/dashboard-shell';
import { createTask, deleteTask, updateTaskStatus } from '../actions/tasks';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';

const priorities = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' }
];

const statuses = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETED', label: 'Completed' }
];

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/sign-in');

  const [workstations, users, tasks] = await Promise.all([
    prisma.workstation.findMany({ orderBy: { name: 'asc' } }),
    prisma.user.findMany({ where: { role: 'STAFF' }, orderBy: { name: 'asc' } }),
    prisma.task.findMany({
      orderBy: { deadline: 'asc' },
      include: { workstation: true, assignee: true, createdBy: true }
    })
  ]);

  const visibleTasks = session?.user?.role === 'ADMIN'
    ? tasks
    : tasks.filter((task) => task.assigneeId === session?.user?.id);

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="rounded-3xl border border-slate-800/90 bg-slate-950/90 p-8 shadow-glow">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-sky-400">Task management</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Orders and productivity</h1>
              <p className="mt-3 max-w-2xl text-slate-300">Create tasks, assign workstations, and update statuses with secure role control.</p>
            </div>
            {session?.user?.role === 'ADMIN' ? (
              <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 text-slate-300">
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Admin mode</p>
                <p className="mt-1 text-sm">Full CRUD access for all tasks and workstations.</p>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 text-slate-300">
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Staff mode</p>
                <p className="mt-1 text-sm">Update task status for your assigned work.</p>
              </div>
            )}
          </div>
        </div>

        {session?.user?.role === 'ADMIN' ? (
          <div className="rounded-3xl border border-slate-800/90 bg-slate-950/90 p-8 shadow-glow">
            <h2 className="text-xl font-semibold text-white">Create new task</h2>
            <form action={createTask} className="mt-6 grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="createdById" value={session.user?.id ?? ''} />
              <div>
                <Label htmlFor="title">Title</Label>
                <Input name="title" id="title" placeholder="Task title" />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" id="priority" defaultValue="MEDIUM">
                  {priorities.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  placeholder="Describe the order or task details"
                />
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input type="date" name="deadline" id="deadline" />
              </div>
              <div>
                <Label htmlFor="workstationId">Workstation</Label>
                <Select name="workstationId" id="workstationId">
                  {workstations.map((station) => (
                    <option key={station.id} value={station.id}>{station.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="assigneeId">Assignee</Label>
                <Select name="assigneeId" id="assigneeId" defaultValue={users[0]?.id ?? ''}>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name ?? user.email}</option>
                  ))}
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Button type="submit">Create task</Button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="rounded-3xl border border-slate-800/90 bg-slate-950/90 p-8 shadow-glow">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Task table</h2>
              <p className="text-slate-400">{session?.user?.role === 'ADMIN' ? 'All tasks in the system.' : 'Only your assigned tasks.'}</p>
            </div>
            <Link href="/dashboard" className="text-sky-300 hover:text-white">Back to dashboard</Link>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-800/80">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
              <thead className="bg-slate-950/95 text-slate-300">
                <tr>
                  <th className="px-4 py-4">Title</th>
                  <th className="px-4 py-4">Workstation</th>
                  <th className="px-4 py-4">Assignee</th>
                  <th className="px-4 py-4">Priority</th>
                  <th className="px-4 py-4">Deadline</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleTasks.map((task) => (
                  <tr key={task.id} className="border-t border-slate-800/80 bg-slate-900/80">
                    <td className="px-4 py-4 text-slate-100">{task.title}</td>
                    <td className="px-4 py-4 text-slate-300">{task.workstation.name}</td>
                    <td className="px-4 py-4 text-slate-300">{task.assignee?.name ?? 'Unassigned'}</td>
                    <td className="px-4 py-4 text-slate-300">{task.priority}</td>
                    <td className="px-4 py-4 text-slate-300">{new Date(task.deadline).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-slate-300">
                      <form action={updateTaskStatus} className="flex items-center gap-2">
                        <input type="hidden" name="taskId" value={task.id} />
                        <Select name="status" defaultValue={task.status}>
                          {statuses.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </Select>
                        <Button type="submit">Save</Button>
                      </form>
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      {session?.user?.role === 'ADMIN' ? (
                        <form action={deleteTask}>
                          <input type="hidden" name="taskId" value={task.id} />
                          <Button type="submit" className="bg-rose-500 hover:bg-rose-400">Delete</Button>
                        </form>
                      ) : (
                        <span className="text-slate-500">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

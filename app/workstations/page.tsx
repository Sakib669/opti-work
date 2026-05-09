import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import DashboardShell from '../../components/dashboard-shell';
import { createWorkstation, deleteWorkstation, updateWorkstation } from '../actions/workstations';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';

const stationTypes = [
  { value: 'ASSEMBLY', label: 'Assembly' },
  { value: 'TESTING', label: 'Testing' },
  { value: 'PACKAGING', label: 'Packaging' },
  { value: 'INSPECTION', label: 'Inspection' }
];

const stationStatuses = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OFFLINE', label: 'Offline' }
];

export default async function WorkstationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/sign-in');
  const workstations = await prisma.workstation.findMany({
    include: { tasks: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="rounded-3xl border border-slate-800/90 bg-slate-950/90 p-8 shadow-glow">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-sky-400">Workstations</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Manage workstations</h1>
              <p className="mt-3 max-w-2xl text-slate-300">Track station types, status, and open task capacity for your operations.</p>
            </div>
          </div>
        </div>

        {session?.user?.role === 'ADMIN' ? (
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="rounded-3xl border border-slate-800/90 bg-slate-950/90 p-8 shadow-glow">
              <h2 className="text-xl font-semibold text-white">Current workstations</h2>
              <div className="mt-6 space-y-4">
                {workstations.map((station) => (
                  <div key={station.id} className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">{station.name}</p>
                        <p className="mt-1 text-sm text-slate-400">{station.type} • {station.status}</p>
                      </div>
                      <div className="text-sm text-slate-300">{station.tasks.length} assigned task(s)</div>
                    </div>
                    <form action={updateWorkstation} className="mt-5 grid gap-3 sm:grid-cols-3">
                      <input type="hidden" name="id" value={station.id} />
                      <Input name="name" defaultValue={station.name} aria-label="Workstation name" />
                      <Select name="type" defaultValue={station.type}>
                        {stationTypes.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </Select>
                      <Select name="status" defaultValue={station.status}>
                        {stationStatuses.map((status) => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </Select>
                      <div className="sm:col-span-3 flex flex-wrap gap-3">
                        <Button type="submit">Save</Button>
                      </div>
                    </form>
                    <form action={deleteWorkstation} className="mt-3 inline">
                      <input type="hidden" name="id" value={station.id} />
                      <Button type="submit" className="bg-rose-500 hover:bg-rose-400">Delete</Button>
                    </form>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800/90 bg-slate-950/90 p-8 shadow-glow">
              <h2 className="text-xl font-semibold text-white">Create new workstation</h2>
              <form action={createWorkstation} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input name="name" id="name" placeholder="Station name" />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" id="type" defaultValue="ASSEMBLY">
                    {stationTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" id="status" defaultValue="ACTIVE">
                    {stationStatuses.map((status) => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </Select>
                </div>
                <Button type="submit">Add workstation</Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-800/90 bg-slate-950/90 p-8 shadow-glow">
            <h2 className="text-xl font-semibold text-white">Workstation catalog</h2>
            <div className="mt-6 grid gap-4">
              {workstations.map((station) => (
                <div key={station.id} className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-5">
                  <p className="text-lg font-semibold text-white">{station.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{station.type} • {station.status}</p>
                  <p className="mt-2 text-sm text-slate-300">Assigned tasks: {station.tasks.length}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

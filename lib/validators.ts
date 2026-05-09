import { z } from 'zod';

export const workstationSchema = z.object({
  name: z.string().min(2, 'Workstation name is required'),
  type: z.enum(['ASSEMBLY', 'TESTING', 'PACKAGING', 'INSPECTION']),
  status: z.enum(['ACTIVE', 'MAINTENANCE', 'OFFLINE'])
});

export const taskSchema = z.object({
  title: z.string().min(5, 'Task title is required'),
  description: z.string().min(10, 'Task description is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  deadline: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Valid deadline required'),
  workstationId: z.string().min(1),
  assigneeId: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional()
});

export const taskStatusSchema = z.object({
  taskId: z.string().min(1),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
});

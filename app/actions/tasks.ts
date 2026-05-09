import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { taskSchema, taskStatusSchema } from '../../lib/validators';

export async function createTask(formData: FormData) {
  'use server';
  const input = {
    title: formData.get('title')?.toString() ?? '',
    description: formData.get('description')?.toString() ?? '',
    priority: formData.get('priority')?.toString() ?? 'MEDIUM',
    deadline: formData.get('deadline')?.toString() ?? '',
    workstationId: formData.get('workstationId')?.toString() ?? '',
    assigneeId: formData.get('assigneeId')?.toString() ?? '',
    status: formData.get('status')?.toString() ?? 'PENDING'
  };

  const result = taskSchema.safeParse(input);
  if (!result.success) {
    throw new Error(result.error.errors.map((item) => item.message).join(', '));
  }

  await prisma.task.create({
    data: {
      title: result.data.title,
      description: result.data.description,
      priority: result.data.priority,
      deadline: new Date(result.data.deadline),
      workstationId: result.data.workstationId,
      assigneeId: result.data.assigneeId || undefined,
      status: result.data.status,
      createdById: formData.get('createdById')?.toString() ?? ''
    }
  });

  revalidatePath('/tasks');
}

export async function updateTaskStatus(formData: FormData) {
  'use server';
  const result = taskStatusSchema.safeParse({
    taskId: formData.get('taskId')?.toString() ?? '',
    status: formData.get('status')?.toString() ?? 'PENDING'
  });

  if (!result.success) {
    throw new Error(result.error.errors.map((item) => item.message).join(', '));
  }

  await prisma.task.update({
    where: { id: result.data.taskId },
    data: { status: result.data.status }
  });
  revalidatePath('/tasks');
}

export async function deleteTask(formData: FormData) {
  'use server';
  const id = formData.get('taskId')?.toString();
  if (!id) throw new Error('Missing task id');

  await prisma.task.delete({ where: { id } });
  revalidatePath('/tasks');
}

import { revalidatePath } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { workstationSchema } from '../../lib/validators';
import { z } from 'zod';

export async function createWorkstation(formData: FormData) {
  'use server';
  const input = {
    name: formData.get('name')?.toString() ?? '',
    type: formData.get('type')?.toString() ?? 'ASSEMBLY',
    status: formData.get('status')?.toString() ?? 'ACTIVE'
  };

  const result = workstationSchema.safeParse(input);
  if (!result.success) {
    throw new Error(result.error.errors.map((item) => item.message).join(', '));
  }

  await prisma.workstation.create({ data: result.data });
  revalidatePath('/workstations');
}

export async function deleteWorkstation(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  if (!id) throw new Error('Missing workstation id');

  await prisma.workstation.delete({ where: { id } });
  revalidatePath('/workstations');
}

export async function updateWorkstation(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  if (!id) throw new Error('Missing workstation id');

  const input = {
    name: formData.get('name')?.toString() ?? '',
    type: formData.get('type')?.toString() ?? 'ASSEMBLY',
    status: formData.get('status')?.toString() ?? 'ACTIVE'
  };

  const result = workstationSchema.safeParse(input);
  if (!result.success) {
    throw new Error(result.error.errors.map((item) => item.message).join(', '));
  }

  await prisma.workstation.update({ where: { id }, data: result.data });
  revalidatePath('/workstations');
}

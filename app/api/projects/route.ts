import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const projects = await prisma.project.findMany({
      where: { companyId: payload.companyId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getUserFromRequest();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const project = await prisma.project.create({
      data: { ...data, companyId: payload.companyId },
    });

    return NextResponse.json({ project });
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

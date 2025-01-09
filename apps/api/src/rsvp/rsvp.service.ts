import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RSVPService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdateRSVP(
    userId: string,
    eventId: string,
    status: 'GOING' | 'MAYBE' | 'NOT_GOING',
  ) {
    return this.prisma.rSVP.upsert({
      where: { userId_eventId: { userId, eventId } },
      update: { status },
      create: { userId, eventId, status },
    });
  }

  async getUserRSVPs(userId: string) {
    return this.prisma.rSVP.findMany({
      where: { userId },
      include: { event: true },
    });
  }

  async getRSVPByEvent(userId: string, eventId: string) {
    return this.prisma.rSVP.findFirst({
      where: { userId, eventId },
    });
  }

  async getRSVPSummary(eventId: string) {
    const summary = await this.prisma.rSVP.groupBy({
      by: ['status'],
      where: { eventId },
      _count: true,
    });

    return summary.map((group) => ({
      status: group.status,
      count: group._count,
    }));
  }
}

import { Module } from '@nestjs/common';
import { RSVPService } from './rsvp.service';
import { RSVPController } from './rsvp.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RSVPController],
  providers: [RSVPService, PrismaService],
})
export class RsvpModule {}

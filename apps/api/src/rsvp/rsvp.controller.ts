import { Body, Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { RSVPService } from './rsvp.service';

@UseGuards(JwtGuard)
@Controller('rsvps')
export class RSVPController {
  constructor(private readonly rsvpService: RSVPService) {}

  @Post()
  createOrUpdateRSVP(
    @GetUser('id') userId: string,
    @Body() dto: { eventId: string; status: 'GOING' | 'MAYBE' | 'NOT_GOING' },
  ) {
    return this.rsvpService.createOrUpdateRSVP(userId, dto.eventId, dto.status);
  }

  @Get()
  getUserRSVPs(@GetUser('id') userId: string) {
    return this.rsvpService.getUserRSVPs(userId);
  }

  @Get(':eventId')
  getRSVPByEvent(
    @GetUser('id') userId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.rsvpService.getRSVPByEvent(userId, eventId);
  }

  @Get('/events/:eventId')
  getRSVPSummary(@Param('eventId') eventId: string) {
    return this.rsvpService.getRSVPSummary(eventId);
  }
}

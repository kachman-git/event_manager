import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagsDto, UpdateTagsDto } from './dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTag(dto: CreateTagsDto) {
    return this.prisma.tag.create({
      data: {
        name: dto.name,
        eventId: dto.eventId,
      },
    });
  }

  async getTagsByEvent(eventId: string) {
    return this.prisma.tag.findMany({
      where: { eventId },
    });
  }

  async updateTag(id: string, dto: UpdateTagsDto) {
    return this.prisma.tag.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  }

  async deleteTag(id: string) {
    return this.prisma.tag.delete({
      where: { id },
    });
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtGuard } from '../auth/guard';
import { CreateTagsDto, UpdateTagsDto } from './dto';

@UseGuards(JwtGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  createTag(@Body() dto: CreateTagsDto) {
    return this.tagsService.createTag(dto);
  }

  @Get(':eventId')
  getTagsByEvent(@Param('eventId') eventId: string) {
    return this.tagsService.getTagsByEvent(eventId);
  }

  @Patch(':id')
  updateTag(@Param('id') id: string, @Body() dto: UpdateTagsDto) {
    return this.tagsService.updateTag(id, dto);
  }

  @Delete(':id')
  deleteTag(@Param('id') id: string) {
    return this.tagsService.deleteTag(id);
  }
}

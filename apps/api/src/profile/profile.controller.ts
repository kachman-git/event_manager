import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { CreateProfileDto, UpdateProfileDto } from './dto';
import { ProfileService } from './profile.service';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  getMyProfile(@GetUser('id') userId: string) {
    return this.profileService.getMyProfile(userId);
  }

  @Get(':id')
  getProfile(@Param('id', ParseUUIDPipe) profileId: string) {
    return this.profileService.getProfile(profileId);
  }

  @Post()
  createProfile(@GetUser('id') userId: string, @Body() dto: CreateProfileDto) {
    return this.profileService.createProfile(userId, dto);
  }

  @Post('upload-avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new BadRequestException('Invalid file type'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadAvatar(
    @GetUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const filePath = `/uploads/avatars/${file.filename}`;
    return this.profileService.updateAvatar(userId, filePath);
  }

  @Patch(':id')
  editProfileById(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) profileId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.editProfileById(userId, profileId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteProfileById(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) profileId: string,
  ) {
    return this.profileService.deleteProfileById(userId, profileId);
  }
}

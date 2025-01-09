import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileDto, UpdateProfileDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  getMyProfile(userId: string) {
    return this.prisma.profile.findFirst({
      where: {
        userId,
      },
    });
  }

  getProfile(profileId: string) {
    return this.prisma.profile.findUnique({
      where: {
        id: profileId,
      },
    });
  }

  async createProfile(userId: string, dto: CreateProfileDto) {
    const profile = await this.prisma.profile.create({
      data: {
        userId,
        ...dto,
      },
    });

    return profile;
  }

  async editProfileById(
    userId: string,
    profileId: string,
    dto: UpdateProfileDto,
  ) {
    // get the profile by id
    const profile = await this.prisma.profile.findUnique({
      where: {
        id: profileId,
      },
    });

    // check if user owns the profile
    if (!profile || profile.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteProfileById(userId: string, profileId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id: profileId,
      },
    });

    // check if user owns the profile
    if (!profile || profile.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.profile.delete({
      where: {
        id: profileId,
      },
    });
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new ForbiddenException('Profile not found');
    }
    return this.prisma.profile.update({
      where: { userId },
      data: { avatarUrl },
    });
  }
}

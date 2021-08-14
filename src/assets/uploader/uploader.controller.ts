import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../../plugins/guards/auth.guard';
import { User } from '../../plugins/decorators/user.decorator';
import { UploaderService } from './uploader.service';

@Controller('uploader')
export class UploaderController {
  constructor(private uploaderService: UploaderService) {}
  @UseGuards(JwtAuthGuard)
  @Post('uploadVoice')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'messageVoiceFile', maxCount: 1 }], {
      dest: './uploads/voiceMessages',
    }),
  )
  async uploadVoice(@UploadedFiles() files) {
    return files.messageVoiceFile[0].filename;
  }

  @UseGuards(JwtAuthGuard)
  @Post('images/avatars')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'avatarImg', maxCount: 1 }], {
      dest: './uploads/cache',
    }),
  )
  async uploadAvatar(@UploadedFiles() files, @User() user: any) {
    return await this.uploaderService.uploadPhoto(files, user.userId);
  }

  @Get('voiceMessages/:voice')
  see(@Param('voice') voice, @Res() res) {
    return res.sendFile(voice, { root: './uploads/voiceMessages' });
  }

  @Get('images/avatars/:folder/:image')
  seeAvatar(@Param('folder') folder, @Param('image') image, @Res() res) {
    return res.sendFile(image, { root: `./uploads/images/avatars/${folder}` });
  }
}

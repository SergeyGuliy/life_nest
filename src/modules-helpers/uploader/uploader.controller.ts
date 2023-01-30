import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../../assets/guards/auth/auth.guard.js';
import { User } from '../../assets/decorators/user.decorator.js';
import { UploaderService } from './uploader.service.js';

@Controller('uploader')
export class UploaderController {
  @Inject(UploaderService)
  private readonly uploaderService: UploaderService;

  @UseGuards(JwtAuthGuard)
  @Post('uploadVoice')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'voice', maxCount: 1 }], {
      storage: diskStorage({
        destination: './uploads/voiceMessages',
        filename: (req, file, callback) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const { userId } = req.user;
          const { fieldname } = file;
          const filenameFormatted = `${fieldname}_senderId=${userId}_${new Date().getTime()}.mp3`;

          callback(null, filenameFormatted);
        },
      }),
    }),
  )
  async uploadVoice(@UploadedFiles() files) {
    return files.voice[0].filename;
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

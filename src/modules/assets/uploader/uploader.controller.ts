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
import { JwtAuthGuard } from '../auth/jwt/auth.guard';

@Controller('uploader')
export class UploaderController {
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

  @Get('voiceMessages/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './uploads/voiceMessages' });
  }
}

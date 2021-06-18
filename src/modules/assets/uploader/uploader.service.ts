import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../database/entities/users.entity';
import { Repository } from 'typeorm';
import { thumbnail } from 'easyimage';

import * as fs from 'fs';
import * as util from 'util';

const unlinkAsync = util.promisify(fs.unlink);
const rmdirAsync = util.promisify(fs.rmdir);

@Injectable()
export class UploaderService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async setUserAvatar(userId, { avatarSmall, avatarBig }) {
    await this.usersRepository.update(userId, {
      avatarSmall,
      avatarBig,
    });
    return await this.usersRepository.findOne(userId);
  }
  async clearUserAvatar(userId) {
    await this.usersRepository.update(userId, {
      avatarSmall: '',
      avatarBig: '',
    });
    return await this.usersRepository.findOne(userId);
  }
  async uploadPhoto(files, userId) {
    if (files.avatarImg && files.avatarImg[0]) {
      const sourceId = files.avatarImg[0].filename;
      await rmdirAsync(`./uploads/images/avatars/${userId}`, {
        recursive: true,
      });
      const imageBigData = await thumbnail({
        src: `./uploads/cache/${sourceId}`,
        width: 200,
        height: 200,
        dst: `./uploads/images/avatars/${userId}/${sourceId}-big.jpg`,
      });
      const imageSmallData = await thumbnail({
        src: `./uploads/cache/${sourceId}`,
        width: 45,
        height: 45,
        dst: `./uploads/images/avatars/${userId}/${sourceId}-small.jpg`,
      });
      const avatarSmall = `${userId}/${imageSmallData.name}`;
      const avatarBig = `${userId}/${imageBigData.name}`;
      await unlinkAsync(`./uploads/cache/${sourceId}`);
      return await this.setUserAvatar(userId, {
        avatarSmall,
        avatarBig,
      });
    } else {
      return await this.clearUserAvatar(userId);
    }
  }
}

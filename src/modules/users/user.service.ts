import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

import User from '../../common/database/entities/user.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const phone = require('phone');

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private postsRepository: Repository<User>,
  ) {}
  async getAllPosts() {
    return await this.postsRepository.find();
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne(id);
    if (post) {
      return post;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async replacePost(id: number, post: UpdateUserDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne(id);
    if (updatedPost) {
      return updatedPost;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async createPost(post: CreateUserDto) {
    post.phoneCountryCode = phone(post.phone)[1];
    const newPost = await this.postsRepository.create(post);
    await this.postsRepository.save(newPost);
    return newPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}

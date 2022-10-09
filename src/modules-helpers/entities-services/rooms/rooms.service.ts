import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rooms } from './rooms.entity';

@Injectable()
export class RoomsManager {
  @InjectRepository(Rooms)
  public readonly db: Repository<Rooms>;
}

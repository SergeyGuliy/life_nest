import { Injectable } from '@nestjs/common';

const modificators = {
  current: {
    inflation: 1,
    unemployment: 2,
    keyRate: 2,
  },
  accumulated: {
    inflation: 1,
  },
};

@Injectable()
export class GamesModification {}

import { Transform } from 'class-transformer';
import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  ValidateIf,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,16}$/;
import { ROOM_TYPES } from 'life_shared/enums/index.js';

export class CreateRoomDto {
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  roomName: string;

  @IsString()
  @Matches(/^(PUBLIC)|(PRIVATE)$/, {
    message: `typeOfRoom must be ${ROOM_TYPES.PUBLIC} or ${ROOM_TYPES.PRIVATE}`,
  })
  typeOfRoom: string;

  @ValidateIf((o) => o.typeOfRoom !== ROOM_TYPES.PUBLIC)
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(passwordRegex, {
    message: 'room password must contain 1 letter and 1 digit',
  })
  roomPassword: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  @Transform((o) => Number(o.obj.minCountOfUsers))
  minCountOfUsers: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  @Transform((o) => Number(o.obj.maxCountOfUsers))
  maxCountOfUsers: number;
}

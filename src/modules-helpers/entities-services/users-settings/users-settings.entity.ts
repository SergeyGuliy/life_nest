import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '../../../assets/base.entity.js';

import { LOCALES, SOUNDS } from 'life_shared/enums/index.js';

@Entity('userSettings')
export class UserSettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  public userSettingsId: number;

  @Column({
    type: 'enum',
    enum: LOCALES,
    default: LOCALES.en,
  })
  public locale: LOCALES;

  @Column({
    default: true,
  })
  public isDarkTheme?: boolean;

  @Column({
    default: false,
  })
  public globalIsTurnedOn?: boolean;

  @Column({
    default: false,
  })
  public roomIsTurnedOn?: boolean;

  @Column({
    default: false,
  })
  public privateIsTurnedOn?: boolean;

  @Column({
    default: false,
  })
  public globalAutoplay?: boolean;

  @Column({
    default: false,
  })
  public roomAutoplay?: boolean;

  @Column({
    default: false,
  })
  public privateAutoplay?: boolean;

  @Column({
    type: 'enum',
    enum: SOUNDS,
    default: SOUNDS.SOUNDS_1,
  })
  public globalSoundSelected?: SOUNDS;

  @Column({
    type: 'enum',
    enum: SOUNDS,
    default: SOUNDS.SOUNDS_1,
  })
  public roomSoundSelected?: SOUNDS;

  @Column({
    type: 'enum',
    enum: SOUNDS,
    default: SOUNDS.SOUNDS_1,
  })
  public privateSoundSelected?: SOUNDS;
}

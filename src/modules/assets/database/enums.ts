export enum UserRole {
  ADMIN = 'ADMIN',
  CASUAL = 'CASUAL',
}

export enum RoomTypes {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum MessageTypes {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
}

export enum MessageReceiverTypes {
  GLOBAL = 'GLOBAL',
  ROOM = 'ROOM',
  PRIVATE = 'PRIVATE',
}

export enum UserOnlineStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum UserGameStatus {
  NOT_IN_GAME = 'NOT_IN_GAME',
  WAITING_GAME_STARTING = 'WAITING_GAME_STARTING',
  GAME_IN_PROGRESS = 'GAME_IN_PROGRESS',
}

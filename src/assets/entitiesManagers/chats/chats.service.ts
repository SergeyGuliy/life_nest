// import {
//   ClassSerializerInterceptor,
//   Injectable,
//   UseInterceptors,
// } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Messages } from '../../plugins/database/entities/messages.entity';
// import { MESSAGE_RECEIVER_TYPES } from '../../plugins/database/enums';
//
// @Injectable()
// export class ChatsService {
//   constructor(
//     @InjectRepository(Messages)
//     private readonly messagesRepository: Repository<Messages>,
//   ) {}
//
//   @UseInterceptors(ClassSerializerInterceptor)
//   async saveMessage(messageData) {
//     const savedMessage = await this.messagesRepository.save(messageData);
//     return await this.messagesRepository.findOne(savedMessage.messageId, {
//       relations: ['messageSender'],
//     });
//   }
//
//   async getAllGlobalMessages() {
//     return await this.messagesRepository.find({
//       where: {
//         messageReceiverType: MESSAGE_RECEIVER_TYPES.GLOBAL,
//       },
//       relations: ['messageSender'],
//     });
//   }
//
//   async getAllPrivateMessages(userId) {
//     return await this.messagesRepository.find({
//       where: [
//         {
//           messageReceiverType: MESSAGE_RECEIVER_TYPES.PRIVATE,
//           messageSender: userId,
//         },
//         {
//           messageReceiverType: MESSAGE_RECEIVER_TYPES.PRIVATE,
//           messageReceiverUserId: userId,
//         },
//       ],
//       relations: ['messageSender'],
//     });
//   }
//
//   async getAllRoomMessages(roomJoinedId) {
//     return await this.messagesRepository.find({
//       where: {
//         messageReceiverType: MESSAGE_RECEIVER_TYPES.ROOM,
//         messageReceiverRoomId: roomJoinedId,
//       },
//       relations: ['messageSender'],
//     });
//   }
// }

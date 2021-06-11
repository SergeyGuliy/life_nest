import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketNameSpacerService {
  private mapOfUsers = {};

  deleteUser(socketSid) {
    delete this.mapOfUsers[socketSid];
  }

  addUser(socketSid, userId) {
    const oldUserSid = this.findAllSidByUserId(userId);
    console.log(oldUserSid);
    this.mapOfUsers[socketSid] = userId;
  }

  findUserIdBySid(socketSid) {
    return this.mapOfUsers[socketSid] || false;
  }

  findSidByUserId(userId) {
    const index = Object.values(this.mapOfUsers).findIndex((i) => i === userId);
    return Object.keys(this.mapOfUsers)[index];
  }

  findAllSidByUserId(userId) {
    return Object.keys(this.mapOfUsers).filter(
      (i) => this.mapOfUsers[i] === userId,
    );
  }
}

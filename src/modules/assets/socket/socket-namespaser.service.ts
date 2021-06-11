import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketNameSpacerService {
  private mapOfUsers = {};

  public deleteUser(socketSid) {
    delete this.mapOfUsers[socketSid];
  }

  public addUser(socketSid, userId) {
    const oldUserSid = this.findAllSidByUserId(userId);
    oldUserSid.forEach((oldSId) => {
      delete this.mapOfUsers[oldSId];
    });
    this.mapOfUsers[socketSid] = userId;
  }

  public findUserIdBySid(socketSid) {
    return this.mapOfUsers[socketSid] || false;
  }

  public findSidByUserId(userId) {
    const index = Object.values(this.mapOfUsers).findIndex((i) => i === userId);
    if (index >= 0) {
      return Object.keys(this.mapOfUsers)[index] || false;
    } else {
      return false;
    }
  }

  private findAllSidByUserId(userId) {
    return Object.keys(this.mapOfUsers).filter(
      (i) => this.mapOfUsers[i] === userId,
    );
  }
}

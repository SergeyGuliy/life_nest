import { Injectable } from '@nestjs/common';

const mapOfUsers = {};

@Injectable()
export class SocketNameSpacerService {
  public deleteUser(socketSid) {
    delete mapOfUsers[socketSid];
  }

  public addUser(socketSid, userId) {
    const oldUserSid = this.findAllSidByUserId(userId);
    oldUserSid.forEach((oldSId) => {
      delete mapOfUsers[oldSId];
    });
    mapOfUsers[socketSid] = userId;
    return oldUserSid;
  }

  public findUserIdBySid(socketSid) {
    return mapOfUsers[socketSid] || false;
  }

  public findSidByUserId(userId) {
    const index = Object.values(mapOfUsers).findIndex((i) => i === userId);
    if (index >= 0) {
      return Object.keys(mapOfUsers)[index] || false;
    } else {
      return false;
    }
  }

  private findAllSidByUserId(userId) {
    return Object.keys(mapOfUsers).filter((i) => mapOfUsers[i] === userId);
  }
}
//
// setInterval(() => {
//   console.log(mapOfUsers);
// }, 3000);

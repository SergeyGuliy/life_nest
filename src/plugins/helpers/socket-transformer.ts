const mapOfUsers = {};

export function deleteUser(socketSid) {
  delete mapOfUsers[socketSid];
}

export function addUser(socketSid, userId) {
  mapOfUsers[socketSid] = userId;
}

export function findUserIdBySid(socketSid) {
  return mapOfUsers[socketSid];
}

export function findSidByUserId(userId) {
  const index = Object.values(mapOfUsers).findIndex((i) => i === userId);
  return Object.keys(mapOfUsers)[index];
}

const mapOfUsers = {};

export function deleteUser(socketSid) {
  // const userId = findUserIdBySid(socketSid);
  // Object.keys(mapOfUsers).forEach((sid) => {
  //   if (mapOfUsers[sid] === userId) {
  //     delete mapOfUsers[sid];
  //   }
  // });
  // console.log(mapOfUsers);
  delete mapOfUsers[socketSid];
  // console.log(mapOfUsers);
}

export function addUser(socketSid, userId) {
  mapOfUsers[socketSid] = userId;
}

export function findUserIdBySid(socketSid) {
  return mapOfUsers[socketSid] || false;
}

export function findSidByUserId(userId) {
  const index = Object.values(mapOfUsers).findIndex((i) => i === userId);
  return Object.keys(mapOfUsers)[index];
}

setInterval(() => {
  console.log(mapOfUsers);
}, 3000);

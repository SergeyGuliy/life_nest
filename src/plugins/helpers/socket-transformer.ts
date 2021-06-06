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
  const oldUserSid = findAllSidByUserId(userId);
  console.log(oldUserSid);
  mapOfUsers[socketSid] = userId;
}

export function findUserIdBySid(socketSid) {
  return mapOfUsers[socketSid] || false;
}

export function findSidByUserId(userId) {
  const index = Object.values(mapOfUsers).findIndex((i) => i === userId);
  return Object.keys(mapOfUsers)[index];
}

export function findAllSidByUserId(userId) {
  return Object.keys(mapOfUsers).filter((i) => mapOfUsers[i] === userId);
}

// setInterval(() => {
//   console.log(mapOfUsers);
// }, 3000);

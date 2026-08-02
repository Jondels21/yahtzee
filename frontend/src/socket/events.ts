export const ClientEvents = {
  CREATE_LOBBY: "createLobby",
  JOIN_LOBBY: "joinLobby",
  SET_NICKNAME: "setNickname",
  LEAVE_LOBBY: "leaveLoby",
  PLAYER_READY: "playerReady",
  START_GAME: "startGame",
} as const;

export const ServerEvents = {
  LOBBY_CREATED: "lobbyCreated",
  LOBBY_JOINED: "lobbyJoined",
  LOBBY_UPDATED: "lobbyUpdated",
  NICKNAME_ACCEPTED: "nicknameAccepted",
  ERROR: "error",
} as const;
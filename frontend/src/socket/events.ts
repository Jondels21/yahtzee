export const ClientEvents = {
  CREATE_LOBBY: "createLobby",
  JOIN_LOBBY: "joinLobby",
  SET_NICKNAME: "setNickname",
  LEAVE_LOBBY: "leaveLoby",
  PLAYER_READY: "playerReady",
  START_GAME: "startGame",
  GET_GAME_STATE: "getGameState",
  ROLL_DICE: "rollDice",
  TOGGLE_DIE: "toggleDie",
} as const;

export const ServerEvents = {
  LOBBY_CREATED: "lobbyCreated",
  LOBBY_JOINED: "lobbyJoined",
  LOBBY_UPDATED: "lobbyUpdated",
  NICKNAME_ACCEPTED: "nicknameAccepted",
  GAME_STARTED: "gameStarted",
  GAME_UPDATED: "gameUpdated",
  ERROR: "error",
} as const;
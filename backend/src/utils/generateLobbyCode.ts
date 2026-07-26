export const generateLobbyCode = (length = 4) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let lobbyCode = "";
  for (let i = 0; i < length; i++) {
    lobbyCode += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  return lobbyCode;
};
export const generatePassword = () => {
  const listLettersNumbers =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ0123456789";
  const listSpecial = "!?@&";
  let resLettersNumbers = "";
  const resSpecial = listSpecial.charAt(
    Math.floor(Math.random() * listSpecial.length)
  );

  for (var i = 0; i < 8; i++) {
    var rnd = Math.floor(Math.random() * listLettersNumbers.length);
    resLettersNumbers = resLettersNumbers + listLettersNumbers.charAt(rnd);
  }

  return resLettersNumbers + resSpecial;
};

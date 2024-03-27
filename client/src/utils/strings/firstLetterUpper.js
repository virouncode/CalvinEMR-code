export const firstLetterUpper = (str) => {
  if (!str) return "";
  if (str.includes(" ") || str.includes(",")) {
    const names = str.split(/[\s,-]+/);
    const formattedName = names
      .map((name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
      .join(" ");
    return formattedName;
  } else if (str.includes("-")) {
    const names = str.split("-");
    const formattedName = names
      .map((name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
      .join("-");
    return formattedName;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
export const firstLetterOfFirstWordUpper = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

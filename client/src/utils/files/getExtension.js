export const getExtension = (path) => {
  let baseName = path.split(/[\\/]/).pop(), // extracts file name from full path
    // (supports separators `\\` and `/`)
    pos = baseName.lastIndexOf("."); // gets the last position of `.`
  if (baseName === "" || pos < 1)
    // if the file name is empty or ...
    return ""; // the dot not found (-1) or comes first (0)
  return baseName.slice(pos + 1); // extracts extension ignoring "."
};

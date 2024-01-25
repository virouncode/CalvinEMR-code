const formatName = (name) => {
  if (!name) return;
  const nameArray = name.split(" ");
  const lastName = nameArray.pop();
  const nameInitials = nameArray
    .map((elt) => elt.substring(0, 1) + ".")
    .join("");
  const nameShort = nameInitials + lastName;
  return nameShort;
};

export default formatName;

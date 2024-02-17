import formatName from "./formatName";

export const toHostName = (host_infos) => {
  const title = host_infos.title === "Doctor" ? "Dr. " : "";
  const abreviatedName = formatName(host_infos.full_name);
  return title + abreviatedName;
};

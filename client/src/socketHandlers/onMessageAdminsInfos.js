export const onMessageAdminsInfos = (message, adminsInfos, setAdminsInfos) => {
  if (message.route !== "ADMINS INFOS") return;
  switch (message.action) {
    case "update":
      setAdminsInfos(
        adminsInfos.map((item) =>
          item.id === message.content.id ? message.content.data : item
        )
      );
      localStorage.setItem(
        "adminsInfos",
        JSON.stringify(
          adminsInfos.map((item) =>
            item.id === message.content.id ? message.content.data : item
          )
        )
      );
      break;
    default:
      break;
  }
};

export const onMessageStaffInfos = (message, staffInfos, setStaffInfos) => {
  if (message.route !== "STAFF INFOS") return;
  switch (message.action) {
    case "create":
      setStaffInfos([message.content.data, ...staffInfos]);
      localStorage.setItem(
        "staffInfos",
        JSON.stringify([message.content.data, ...staffInfos])
      );
      break;
    case "update":
      setStaffInfos(
        staffInfos.map((item) =>
          item.id === message.content.id ? message.content.data : item
        )
      );
      localStorage.setItem(
        "staffInfos",
        JSON.stringify(
          staffInfos.map((item) =>
            item.id === message.content.id ? message.content.data : item
          )
        )
      );
      break;
    default:
      break;
  }
};

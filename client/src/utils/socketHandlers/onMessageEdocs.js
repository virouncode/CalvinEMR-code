export const onMessageEdocs = (message, edocs, setEdocs) => {
  if (message.route !== "EDOCS") return;
  switch (message.action) {
    case "create":
      setEdocs([message.content.data, ...edocs]);

      break;
    case "update":
      setEdocs(
        edocs.map((item) =>
          item.id === message.content.id ? message.content.data : item
        )
      );

      break;
    case "delete":
      setEdocs(edocs.filter((item) => item.id !== message.content.id));
      break;
    default:
      break;
  }
};

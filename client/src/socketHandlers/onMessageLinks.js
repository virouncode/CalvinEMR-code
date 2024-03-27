export const onMessageLinks = (message, links, setLinks, userId) => {
  if (message.route !== "LINKS") return;
  switch (message.action) {
    case "create":
      if (message.content.data.staff_id === userId) {
        setLinks([message.content.data, ...links]);
      }
      break;
    case "update":
      if (message.content.data.staff_id === userId) {
        setLinks(
          links.map((item) =>
            item.id === message.content.id ? message.content.data : item
          )
        );
      }
      break;
    case "delete":
      setLinks(links.filter((item) => item.id !== message.content.id));
      break;
    default:
      break;
  }
};

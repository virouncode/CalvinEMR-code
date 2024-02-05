export const onMessageSites = (message, sites, setSites) => {
  if (message.route !== "SITES") return;

  switch (message.action) {
    case "create":
      setSites([...sites, message.content.data]);
      break;
    case "update":
      setSites(
        sites.map((site) =>
          site.id === message.content.id ? message.content.data : site
        )
      );
      break;
    default:
      break;
  }
};

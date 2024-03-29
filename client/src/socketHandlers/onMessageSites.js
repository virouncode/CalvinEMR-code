export const onMessageSites = (message, sites, setSites) => {
  if (message.route !== "SITES") return;

  switch (message.action) {
    case "create":
      setSites([message.content.data, ...sites]);
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

export const showDocument = async (docUrl, docMime) => {
  let docWindow;
  if (!docMime.includes("officedocument")) {
    docWindow = window.open(
      docUrl,
      "_blank",
      "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=800, height=600, left=320, top=200"
    );
  } else {
    docWindow = window.open(
      `https://docs.google.com/gview?url=${docUrl}`,
      "_blank",
      "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=800, height=600, left=320, top=200"
    );
  }

  if (docWindow === null) {
    alert("Please disable your browser pop-up blocker and sign in again");
    window.location.assign("/login");
    return;
  }
};

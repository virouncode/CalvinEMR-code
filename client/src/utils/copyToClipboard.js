export const copyToClipboard = async (newWindow, element) => {
  newWindow.window.focus();
  try {
    newWindow.window.navigator.clipboard.writeText(element.innerText);
  } catch (err) {
    throw err;
  }
};

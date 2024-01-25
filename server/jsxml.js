const { XMLBuilder } = require("fast-xml-parser");
const xmldom = require("xmldom");

const convertJStoXML = (jsObj) => {
  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: "_",
  };
  const builder = new XMLBuilder(options);
  //Convert JS object to XMLString
  let xmlDataStr = builder.build(jsObj);
  //Remove empty tages
  const parser = new xmldom.DOMParser();
  const xmlDoc = parser.parseFromString(xmlDataStr, "text/xml");
  removeEmptyTags(xmlDoc);

  return new xmldom.XMLSerializer().serializeToString(xmlDoc);
  // return xmlDataStr;
};

module.exports = convertJStoXML;

const removeEmptyTags = (node) => {
  for (let i = node.childNodes.length - 1; i >= 0; i--) {
    const childNode = node.childNodes[i];
    if (childNode.nodeType === 1 /* ELEMENT_NODE */) {
      removeEmptyTags(childNode);
      if (
        childNode.childNodes.length === 0 &&
        childNode.textContent.trim() === ""
      ) {
        node.removeChild(childNode);
      }
    }
  }
};

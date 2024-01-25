const fs = require("fs");
const libxml = require("libxml-xsd").libxmljs;
const path = require("path");

const loadAndParseXsd = (xsdPath) => {
  const xsdContent = fs.readFileSync(xsdPath, "utf-8");
  return libxml.parseXmlString(xsdContent);
};

const validateXml = async (xmlString, mainXsdPath) => {
  try {
    const mainXsd = loadAndParseXsd(mainXsdPath);
    const xmlDoc = libxml.parseXmlString(xmlString);

    mainXsd.import(
      loadAndParseXsd(
        path.join(__dirname, "xsd", "EMR_Data_Migration_Schema_DT.xsd")
      )
    ); // Replace with the actual path

    const validationResult = await new Promise((resolve, reject) => {
      mainXsd.validate(xmlDoc, (err, validationErrors) => {
        if (err) {
          reject(err);
        } else if (validationErrors) {
          reject(
            new Error(`Validation errors: ${validationErrors.join(", ")}`)
          );
        } else {
          resolve("Validation successful");
        }
      });
    });

    console.log(validationResult);
  } catch (error) {
    console.error(`Validation failed: ${error.message}`);
  }
};

module.exports = validateXml;

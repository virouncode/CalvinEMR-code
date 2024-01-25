const { log } = require("console");
const axios = require("axios");

const { DocumentProcessorServiceClient } =
  require("@google-cloud/documentai").v1;
require("dotenv").config();
const projectId = process.env.DOCUMENTAI_PROJECT_ID;
const location = "us"; // Format is 'us' or 'eu'
const processorId = process.env.DOCUMENTAI_PROCESSOR_ID; // Create processor in Cloud Console
const client = new DocumentProcessorServiceClient();

const extractTextFromDoc = async (docUrl, mime) => {
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  // Read the file into memory.
  const response = await axios.get(docUrl, { responseType: "arraybuffer" });
  const encodedImage = Buffer.from(response.data, "binary").toString("base64");
  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: mime,
    },
  };

  // Recognizes text entities in the PDF document
  const [result] = await client.processDocument(request);
  const { document } = result;

  // Get all of the document text as one big string
  const { text } = document;

  // Extract shards from the text field
  const getText = (textAnchor) => {
    if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
      return "";
    }

    // First shard in document doesn't have startIndex property
    const startIndex = textAnchor.textSegments[0].startIndex || 0;
    const endIndex = textAnchor.textSegments[0].endIndex;

    return text.substring(startIndex, endIndex);
  };

  // Read the text recognition output from the processor
  const [page1] = document.pages;
  const { paragraphs } = page1;

  let decodedText = [];

  for (const paragraph of paragraphs) {
    const paragraphText = getText(paragraph.layout.textAnchor);
    decodedText.push(paragraphText);
  }
  return decodedText;
};

module.exports = extractTextFromDoc;

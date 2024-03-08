var extractTextFromDoc = require("../extractTextFromDoc");

const postExtractToText = async (req, res) => {
  try {
    const { docUrl, mime } = req.body;
    const result = await extractTextFromDoc(docUrl, mime);
    res.send(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { postExtractToText };

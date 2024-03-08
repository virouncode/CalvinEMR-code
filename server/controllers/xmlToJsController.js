// const xml2js = require("xml2js");
// var stripPrefix = require("xml2js").processors.stripPrefix;

const postXmlToJs = (req, res) => {
  // try {
  //   const { xmlContent } = req.body;
  //   const parser = new xml2js.Parser({
  //     explicitArray: false,
  //     tagNameProcessors: [stripPrefix],
  //   });
  //   parser.parseString(xmlContent, function (err, result) {
  //     res.send(result);
  //   });
  // } catch (err) {
  //   console.log(err);
  // }
};

module.exports = { postXmlToJs };

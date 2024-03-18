var fs = require("fs");
var path = require("path");
var os = require("os");

const postWriteXML = async (req, res) => {
  try {
    const {
      xmlFinal,
      patientFirstName,
      patientLastName,
      patientId,
      patientDob,
      doctorFirstName,
      doctorLastName,
      doctorOHIP,
      authorName,
      dateOfExport,
      reportsFiles,
    } = req.body;

    //Names
    const exportFolderName = `CalvinEMR_Export_${dateOfExport}`;
    const folderName = `${doctorFirstName}_${doctorLastName}_${doctorOHIP}`;
    const fileName = `${patientFirstName}_${patientLastName}_${patientId}_${patientDob}.xml`;
    const reportsFilesFolderName = "Reports_files";

    //Paths
    const downloadsPath = path.join(os.homedir(), "Downloads");
    const exportFolderPath = path.join(downloadsPath, exportFolderName);
    const folderPath = path.join(downloadsPath, exportFolderName, folderName);
    const filePath = path.join(folderPath, fileName);
    const reportsFilesPath = path.join(folderPath, reportsFilesFolderName);

    //Create folders
    if (!fs.existsSync(exportFolderPath)) {
      fs.mkdirSync(exportFolderPath);
    }
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    if (!fs.existsSync(reportsFilesPath)) {
      fs.mkdirSync(reportsFilesPath);
    }

    //Create ReadMe text
    const currentDateTime = DateTime.local({ zone: timezone });
    // Formater la date et l'heure dans le format désiré avec le fuseau horaire inclus
    const formattedDateTime = currentDateTime.toLocaleString({
      locale,
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
    const readMeContent = `This EMR export from CalvinEMR software was performed by ${authorName} on ${formattedDateTime}`;
    const readMePath = path.join(folderPath, "README.md");

    //Write file asynchronously
    fs.writeFile(filePath, xmlFinal, (err) => {
      if (err) {
        console.error("Error when writing XML file: ", err);
      } else {
        console.log("XML file saved successfully in Downloads folder.");
      }
    });
    fs.writeFile(readMePath, readMeContent, (err) => {
      if (err) {
        console.error("Error when writing README file: ", err);
      } else {
        console.log("README file saved successfully in Downloads folder.");
      }
    });
    for (let reportFile of reportsFiles) {
      console.log(reportFile.url);
      const url = reportFile.url;
      const destinationPath = path.join(reportsFilesPath, `${reportFile.name}`);
      try {
        const response = await axios.get(url, { responseType: "stream" });

        const fileStream = fs.createWriteStream(destinationPath);
        response.data.pipe(fileStream);

        await new Promise((resolve, reject) => {
          fileStream.on("finish", resolve);
          fileStream.on("error", reject);
        });

        console.log("File downloaded successfully.");
      } catch (error) {
        console.error(`Error downloading file: ${error.message}`);
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { postWriteXML };

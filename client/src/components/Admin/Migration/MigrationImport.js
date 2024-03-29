import axios from "axios";
import React, { useState } from "react";
import { toJsDemographics } from "../../../utils/migration/imports/jsTemplates";

const MigrationImport = () => {
  const [xmlContent, setXmlContent] = useState(null);
  const [jsContent, setJsContent] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const fileContent = await readFileContent(file);
      setXmlContent(fileContent);

      const xmlToJsResult = await axios.post("/api/xmlToJs", {
        xmlContent: fileContent,
      });
      const finalDemographics = toJsDemographics(
        xmlToJsResult.data.OmdCds.PatientRecord.Demographics
      );
      setJsContent(JSON.stringify(finalDemographics, null, " "));
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier XML :", error);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  return (
    <div className="migration-import">
      <input type="file" onChange={handleFileChange} />
      {xmlContent && (
        <div className="migration-import__viewer">
          <pre className="migration-import__viewer-xml">{xmlContent}</pre>
          <pre className="migration-import__viewer-js">{jsContent}</pre>
        </div>
      )}
    </div>
  );
};

export default MigrationImport;
